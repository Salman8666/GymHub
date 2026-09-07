import { prisma } from '../lib/db';

const CART_ITEM_INCLUDE = {
  product: {
    include: {
      store: { select: { id: true, name: true, trainerProfileId: true } },
    },
  },
  variant: true,
} as const;

async function findOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
}

async function getCartWithItems(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: CART_ITEM_INCLUDE } },
  });
}

export async function getUserCart(userId: string) {
  let cart = await getCartWithItems(userId);

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: CART_ITEM_INCLUDE } },
    });
  }

  let subtotal = 0;
  const itemsFormatted = cart.items.map((item) => {
    const unitPrice = item.variant ? item.variant.price : item.product.price;
    const itemTotal = unitPrice * item.quantity;
    subtotal += itemTotal;

    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      name: item.product.name,
      variantName: item.variant?.name,
      category: item.product.category,
      image: item.product.image,
      unitPrice,
      quantity: item.quantity,
      itemTotal,
      storeId: item.product.store.id,
      storeName: item.product.store.name,
      trainerProfileId: item.product.store.trainerProfileId,
    };
  });

  return {
    cartId: cart.id,
    items: itemsFormatted,
    subtotal: parseFloat(subtotal.toFixed(2)),
    totalItems: itemsFormatted.reduce((sum, i) => sum + i.quantity, 0),
  };
}

function determineStockSource(product: { stock: number }, variant?: { stock: number } | null) {
  return variant ? variant.stock : product.stock;
}

async function validateCartItem(
  productId: string,
  variantId: string | undefined | null,
  requestedQuantity: number
) {
  if (!productId) {
    throw new Error('CART_ERROR: productId is required');
  }
  if (requestedQuantity <= 0) {
    throw new Error('CART_ERROR: quantity must be greater than 0');
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product) {
    throw new Error('CART_ERROR: Product not found');
  }

  if (!product.isPublished) {
    throw new Error('CART_ERROR: Product is no longer available');
  }

  let variant = null;
  if (variantId) {
    variant = product.variants.find((v) => v.id === variantId) || null;
    if (!variant) {
      throw new Error('CART_ERROR: Selected variant is not available');
    }
  }

  const availableStock = determineStockSource(product, variant);
  if (availableStock < requestedQuantity) {
    throw new Error(
      `CART_ERROR: Only ${availableStock} units available, requested ${requestedQuantity}`
    );
  }

  return { product, variant };
}

export async function addToCart(
  userId: string,
  productId: string,
  variantId?: string,
  quantity: number = 1
) {
  await validateCartItem(productId, variantId, quantity);

  const cart = await findOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
      variantId: variantId || null,
    },
    include: { product: true, variant: true },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    const availableStock = determineStockSource(existingItem.product, existingItem.variant);
    if (availableStock < newQuantity) {
      throw new Error(
        `CART_ERROR: Only ${availableStock} units available, cart would contain ${newQuantity}`
      );
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
    });
  }

  return getUserCart(userId);
}

export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number
) {
  if (quantity <= 0) {
    return removeFromCart(userId, cartItemId);
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: { userId },
    },
    include: { product: true, variant: true },
  });

  if (!cartItem) {
    throw new Error('CART_ERROR: Item not found in your cart');
  }

  const availableStock = determineStockSource(cartItem.product, cartItem.variant);
  if (availableStock < quantity) {
    throw new Error(
      `CART_ERROR: Only ${availableStock} units available, requested ${quantity}`
    );
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  return getUserCart(userId);
}

export async function removeFromCart(userId: string, cartItemId: string) {
  const { count } = await prisma.cartItem.deleteMany({
    where: {
      id: cartItemId,
      cart: { userId },
    },
  });

  if (count === 0) {
    throw new Error('CART_ERROR: Item not found in your cart');
  }

  return getUserCart(userId);
}

export async function clearUserCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
