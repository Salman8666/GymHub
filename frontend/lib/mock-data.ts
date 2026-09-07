export interface Gym {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviewsCount: number;
  location: string;
  address: string;
  dayPassPrice: number;
  monthlyPrice: number;
  image: string;
  gallery: string[];
  amenities: string[];
  equipment: string[];
  hours: string;
  featured?: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  title: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  location: string;
  specialties: string[];
  experienceYears: number;
  image: string;
  verified: boolean;
  featured?: boolean;
  stats: {
    activeClients: number;
    totalWorkouts: number;
    clientSuccessRate: string;
  };
}

export interface Product {
  id: string;
  name: string;
  category: 'Supplements' | 'Apparel' | 'Gear' | 'Digital';
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  inStock: boolean;
  flavors?: string[];
  sizes?: string[];
  featured?: boolean;
}

export interface FitnessPlan {
  id: string;
  title: string;
  creator: string;
  creatorRole: string;
  creatorImage: string;
  category: 'Hypertrophy' | 'Strength' | 'Fat Loss' | 'Calisthenics';
  durationWeeks: number;
  daysPerWeek: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  rating: number;
  enrolledCount: number;
  image: string;
  description: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  image: string;
}

export const MOCK_GYMS: Gym[] = [
  {
    id: 'gym-iron-sanctuary',
    name: 'Iron Sanctuary Performance Center',
    tagline: 'Elite heavy metal powerlifting & strength conditioning lab',
    rating: 4.9,
    reviewsCount: 142,
    location: 'Downtown Athletic District, NY',
    address: '442 Ironworks Blvd, New York, NY 10001',
    dayPassPrice: 25,
    monthlyPrice: 120,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Eleiko Competition Racks', 'Sauna & Ice Bath Plunge', 'InBody 770 Composition Analyzer', 'Keycard 24/7 Access', 'Protein Shake Bar'],
    equipment: ['Hammer Strength Iso-Lateral', 'Calibrated Steel Plates', 'Monolift Squat Cage', 'Custom Dumbbells up to 150lbs', 'Turf Sled Track'],
    hours: '24 Hours / 7 Days a Week',
    featured: true
  },
  {
    id: 'gym-apex-kinetics',
    name: 'Apex Kinetics Athletic Lab',
    tagline: 'Biomechanics, recovery suites, and athletic speed training',
    rating: 4.8,
    reviewsCount: 98,
    location: 'Metro Plaza, CA',
    address: '108 Apex Way, Los Angeles, CA 90015',
    dayPassPrice: 30,
    monthlyPrice: 150,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Cryotherapy Chamber', 'Infrared Sauna', 'HydroMassage Lounge', 'Physio & Chiro Clinic'],
    equipment: ['Keiser Pneumatic System', 'Force Plate Jump Sensors', 'Speed Treadmills 25mph'],
    hours: '05:00 AM - 11:00 PM',
    featured: true
  },
  {
    id: 'gym-titan-forge',
    name: 'Titan Forge Gym & Conditioning',
    tagline: 'Old-school bodybuilding atmosphere with modern recovery tech',
    rating: 4.7,
    reviewsCount: 215,
    location: 'Northside Industrial, TX',
    address: '77 Forge Street, Austin, TX 78701',
    dayPassPrice: 20,
    monthlyPrice: 95,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Pose Lighting Room', 'Outdoor Strongman Pit', 'Supplement Depot'],
    equipment: ['Nautilus Vintage Machines', 'Atlas Stones', 'Log Press Cages'],
    hours: '04:30 AM - Midnight',
    featured: false
  }
];

export const MOCK_TRAINERS: Trainer[] = [
  {
    id: 'trainer-marcus-vance',
    name: 'Marcus Vance',
    title: 'IFBB Pro & Elite Strength Conditioning Coach',
    bio: 'Specializing in mechanical tension hypertrophy, prep coaching, and high-density metabolic conditioning with over 10+ years of athlete transformation experience.',
    rating: 4.98,
    reviewsCount: 84,
    hourlyRate: 110,
    location: 'New York, NY (In-person & Virtual)',
    specialties: ['Hypertrophy Science', 'Strength & Power', 'Contest Prep', 'Biomechanics'],
    experienceYears: 12,
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80',
    verified: true,
    featured: true,
    stats: {
      activeClients: 28,
      totalWorkouts: 1450,
      clientSuccessRate: '98.4%'
    }
  },
  {
    id: 'trainer-elena-rodriguez',
    name: 'Ethan Rodriguez, CSCS',
    title: 'Functional Movement & Athletic Performance Specialist',
    bio: 'Former Olympic weightlifting team coach specializing in explosive mobility, rotational power, and injury mitigation for high-performance athletes.',
    rating: 4.95,
    reviewsCount: 62,
    hourlyRate: 95,
    location: 'Los Angeles, CA',
    specialties: ['Olympic Lifting', 'Athletic Speed', 'Mobility & Rehab', 'Kettlebell Mastery'],
    experienceYears: 9,
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
    verified: true,
    featured: true,
    stats: {
      activeClients: 22,
      totalWorkouts: 980,
      clientSuccessRate: '96.8%'
    }
  },
  {
    id: 'trainer-david-chen',
    name: 'David Chen',
    title: 'Powerlifting State Champion & Muscle Hypertrophy Specialist',
    bio: 'Focuses on RPE-guided periodization, bar speed tracking, and bulletproof technique mastery for heavy squat, bench, and deadlift.',
    rating: 4.90,
    reviewsCount: 47,
    hourlyRate: 85,
    location: 'Austin, TX',
    specialties: ['Powerlifting', 'Powerbuilding', 'Rehab Integration'],
    experienceYears: 8,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    verified: true,
    featured: false,
    stats: {
      activeClients: 19,
      totalWorkouts: 740,
      clientSuccessRate: '95.2%'
    }
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Elite ISO-Whey Protein Isolate (5lbs)',
    category: 'Supplements',
    price: 74.99,
    rating: 4.9,
    reviewsCount: 320,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80',
    description: '100% Micro-Filtered Whey Isolate with 27g Protein per scoop, zero added sugar, fast absorption, and digestive enzymes for rapid muscle repair.',
    inStock: true,
    flavors: ['Gourmet Chocolate', 'Vanilla Cream', 'Salted Caramel', 'Unflavored'],
    sizes: ['2 lbs', '5 lbs'],
    featured: true
  },
  {
    id: 'prod-2',
    name: 'Heavy Duty Leather Weightlifting Belt (10mm)',
    category: 'Gear',
    price: 59.95,
    rating: 4.95,
    reviewsCount: 184,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    description: 'Competition-grade vegetable-tanned genuine leather with heavy steel lever buckle for maximum intra-abdominal pressure support.',
    inStock: true,
    sizes: ['Small', 'Medium', 'Large', 'X-Large'],
    featured: true
  },
  {
    id: 'prod-3',
    name: 'Pre-Workout Matrix High Focus Formula',
    category: 'Supplements',
    price: 49.99,
    rating: 4.85,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'Clinical dosing of L-Citrulline Malate (8g), Beta-Alanine (3.2g), and Alpha-GPC for insane muscle pumps and laser hyper-focus.',
    inStock: true,
    flavors: ['Sour Green Apple', 'Blue Raspberry', 'Electric Lemonade'],
    featured: true
  },
  {
    id: 'prod-4',
    name: 'Vance Performance Oversized Athletic Hoodie',
    category: 'Apparel',
    price: 65.00,
    rating: 4.8,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-heavyweight 480gsm French Terry cotton designed for cold pump covers and relaxed aesthetic gym wear.',
    inStock: true,
    sizes: ['Medium', 'Large', 'X-Large', 'XX-Large'],
    featured: false
  }
];

export const MOCK_PLANS: FitnessPlan[] = [
  {
    id: 'plan-1',
    title: '12-Week Mechanical Tension Hypertrophy System',
    creator: 'Marcus Vance',
    creatorRole: 'IFBB Pro Coach',
    creatorImage: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=150&q=80',
    category: 'Hypertrophy',
    durationWeeks: 12,
    daysPerWeek: 5,
    difficulty: 'Advanced',
    price: 49.99,
    rating: 4.96,
    enrolledCount: 420,
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80',
    description: 'Comprehensive hypertrophy blueprint incorporating Lengthened Partial Reps, Progressive Overload tracking, and Periodized Deload Blocks.'
  },
  {
    id: 'plan-2',
    title: 'Powerlifting Peak & RPE Strength Blueprint',
    creator: 'David Chen',
    creatorRole: 'State Champion',
    creatorImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=150&q=80',
    category: 'Strength',
    durationWeeks: 10,
    daysPerWeek: 4,
    difficulty: 'Intermediate',
    price: 39.99,
    rating: 4.88,
    enrolledCount: 290,
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
    description: 'Calculated 1RM percentage scaling with autoregulated RPE sets for Squat, Bench, and Deadlift maximum total output.'
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'article-plateaus',
    title: 'Breaking Through Weightlifting Plateaus: Biomechanics & Autoregulation',
    excerpt: 'Discover why standard linear progression fails after the novice phase and how micro-periodization unlocks continuous strength gains.',
    category: 'Training Science',
    readTime: '6 min read',
    date: 'Aug 28, 2026',
    author: 'Marcus Vance',
    authorRole: 'Head Performance Coach',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'article-nutrition',
    title: 'The Science of Intra-Workout Carbohydrates for Elite Muscle Retention',
    excerpt: 'Optimizing glycogen resynthesis and insulin spikes during 90+ minute high-volume training sessions.',
    category: 'Nutrition',
    readTime: '8 min read',
    date: 'Aug 22, 2026',
    author: 'Dr. Samuel Jenkins',
    authorRole: 'Sports Nutrition PhD',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  }
];

export const MOCK_CLIENTS = [
  {
    id: 'client-1',
    name: 'Alexander Wright',
    program: '12-Week Hypertrophy',
    progress: 78,
    status: 'Active',
    lastWorkout: 'Yesterday (Leg Day B)',
    currentWeight: '194 lbs',
    targetWeight: '190 lbs',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'client-2',
    name: 'Julian Martinez',
    program: 'Functional Athletic Speed',
    progress: 92,
    status: 'Active',
    lastWorkout: 'Today (Upper Body Heavy)',
    currentWeight: '138 lbs',
    targetWeight: '140 lbs',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'client-3',
    name: 'Brandon Cole',
    program: 'Powerlifting RPE Blueprint',
    progress: 45,
    status: 'Pending Review',
    lastWorkout: '3 days ago (Deadlift Peak)',
    currentWeight: '215 lbs',
    targetWeight: '220 lbs',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
  }
];
