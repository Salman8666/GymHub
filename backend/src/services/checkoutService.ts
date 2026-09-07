import Stripe from 'stripe';
import { prisma } from '../lib/db';
import { stripe } from '../lib/stripe';
import { getUserCart } from './cartService';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export async function createStripeCheckoutSession(
  userId: string,
  data: {
    discountCode?: string;
    shippingAddress?: any;
  }
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('CHECKOUT_ERROR: User not found');
  }

  const cart = await getUserCart(userId);
  if (cart.items.length === 0) {
    throw new Error('CART_EMPTY: Your shopping cart is empty');
  }

  // 1. Calculate discount if promo code provided
  let discountAmount = 0;
  let appliedDiscountCodeId: string | undefined;
  if (data.discountCode) {
    const promo = await prisma.discountCode.findUnique({
      where: { code: data.discountCode.toUpperCase() },
    });
    if (
      promo &&
      promo.active &&
      (promo.expiryDate === null || promo.expiryDate > new Date()) &&
      cart.subtotal >= (promo.minimumOrderAmount || 0) &&
      (promo.usageLimit === null || promo.usageCount < promo.usageLimit)
    ) {
      appliedDiscountCodeId = promo.id;
      if (promo.discountType === 'PERCENTAGE') {
        discountAmount = (cart.subtotal * promo.discountValue) / 100;
      } else {
        discountAmount = promo.discountValue;
      }
    }
  }

  const finalTotal = Math.max(0, cart.subtotal - discountAmount);
  const parentOrderNumber = `GH-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  // 2. Group items by Store / Trainer (Multi-store order splitting architecture)
  const storeGroups = new Map<string, typeof cart.items>();
  for (const item of cart.items) {
    const group = storeGroups.get(item.storeId) || [];
    group.push(item);
    storeGroups.set(item.storeId, group);
  }

  // 3. Distribute discount proportionally across line items for Stripe
  const distributeDiscount = (items: typeof cart.items, discount: number) => {
    if (discount <= 0 || cart.subtotal <= 0) return items.map(() => 0);
    const ratios = items.map((i) => i.itemTotal / cart.subtotal);
    const allocated = ratios.map((r) => parseFloat((r * discount).toFixed(2)));
    // Fix rounding drift on the last item
    const allocatedSum = allocated.reduce((sum, v) => sum + v, 0);
    allocated[allocated.length - 1] = parseFloat((allocated[allocated.length - 1] + (discount - allocatedSum)).toFixed(2));
    return allocated;
  };

  const itemDiscounts = distributeDiscount(cart.items, discountAmount);

  // 4. Reserve Order & StoreOrders in Database Transaction as PENDING
  const order = await prisma.$transaction(async (tx) => {
    const parentOrder = await tx.order.create({
      data: {
        parentOrderNumber,
        userId,
        totalAmount: parseFloat(finalTotal.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        status: 'PENDING',
        shippingAddress: JSON.stringify(
          data.shippingAddress || {
            fullName: user.name,
            address: '',
            city: '',
            province: '',
            postalCode: '',
            country: '',
          }
        ),
      },
    });

    for (const [storeId, items] of storeGroups.entries()) {
      const storeSubtotal = items.reduce((sum, i) => sum + i.itemTotal, 0);
      const trainerProfileId = items[0].trainerProfileId;

      const storeOrder = await tx.storeOrder.create({
        data: {
          orderId: parentOrder.id,
          storeId,
          trainerProfileId,
          subtotal: parseFloat(storeSubtotal.toFixed(2)),
          status: 'PROCESSING',
        },
      });

      for (const item of items) {
        await tx.orderItem.create({
          data: {
            storeOrderId: storeOrder.id,
            productId: item.productId,
            variantId: item.variantId,
            name: item.variantName ? `${item.name} (${item.variantName})` : item.name,
            price: item.unitPrice,
            quantity: item.quantity,
          },
        });
      }
    }

    if (appliedDiscountCodeId) {
      await tx.discountCode.update({
        where: { id: appliedDiscountCodeId },
        data: { usageCount: { increment: 1 } },
      });
    }

    return parentOrder;
  });

  // 5. Build Stripe Checkout Session line items (discount applied proportionally)
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item, index) => {
    const discountedUnitAmount = Math.max(
      0,
      Math.round((item.itemTotal - itemDiscounts[index]) * 100) / item.quantity
    );
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.variantName ? `${item.name} (${item.variantName})` : item.name,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: discountedUnitAmount,
      },
      quantity: item.quantity,
    };
  });

  // 6. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: user.email,
    line_items: lineItems,
    success_url: `${FRONTEND_URL}/checkout?success=true&order=${order.parentOrderNumber}`,
    cancel_url: `${FRONTEND_URL}/checkout?canceled=true&order=${order.parentOrderNumber}`,
    metadata: {
      orderId: order.id,
      userId,
    },
  });

  // 6. Persist Stripe session id on the order
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return {
    orderNumber: order.parentOrderNumber,
    orderId: order.id,
    totalAmount: order.totalAmount,
    status: order.status,
    checkoutUrl: session.url,
    message: 'Stripe checkout session initialized & parent/store orders reserved.',
  };
}
