// ─── Types ───────────────────────────────────────────────────────────────────

export interface Trip {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  status: "upcoming" | "ongoing" | "completed";
  totalBudget: number;
  spentBudget: number;
  stops: CityStop[];
  slug: string;
  isPublic: boolean;
  tags: string[];
}

export interface CityStop {
  id: string;
  city: string;
  country: string;
  image: string;
  startDate: string;
  endDate: string;
  activities: Activity[];
  accommodation: string;
  accommodationCost: number;
  transportCost: number;
}

export interface Activity {
  id: string;
  name: string;
  type: "food" | "sightseeing" | "adventure" | "culture" | "shopping" | "nightlife";
  time: string;
  duration: string;
  cost: number;
  image: string;
  description: string;
  rating: number;
}

export interface City {
  id: string;
  name: string;
  country: string;
  image: string;
  costIndex: number;
  popularity: number;
  description: string;
  tags: string[];
  avgDailyCost: number;
  bestTime: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  name: string;
  packed: boolean;
  essential: boolean;
}

export interface Note {
  id: string;
  tripId: string;
  title: string;
  content: string;
  day?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
  mood?: "happy" | "excited" | "neutral" | "tired";
}

// ─── Mock Trips ──────────────────────────────────────────────────────────────

export const mockTrips: Trip[] = [
  {
    id: "trip-1",
    name: "European Summer Adventure",
    description: "A magical journey through the heart of Europe — from the Eiffel Tower to the Colosseum.",
    coverImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
    startDate: "2026-06-15",
    endDate: "2026-07-05",
    destinations: ["Paris", "Rome", "Barcelona"],
    status: "upcoming",
    totalBudget: 5000,
    spentBudget: 1200,
    slug: "european-summer-adventure",
    isPublic: true,
    tags: ["Europe", "Culture", "Food"],
    stops: [
      {
        id: "stop-1",
        city: "Paris",
        country: "France",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
        startDate: "2026-06-15",
        endDate: "2026-06-21",
        accommodation: "Hotel Le Marais",
        accommodationCost: 840,
        transportCost: 120,
        activities: [
          {
            id: "act-1",
            name: "Eiffel Tower Visit",
            type: "sightseeing",
            time: "10:00 AM",
            duration: "3 hours",
            cost: 28,
            image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&q=80",
            description: "Visit the iconic iron lattice tower on the Champ de Mars.",
            rating: 4.8,
          },
          {
            id: "act-2",
            name: "Louvre Museum",
            type: "culture",
            time: "2:00 PM",
            duration: "4 hours",
            cost: 17,
            image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80",
            description: "World's largest art museum and historic monument.",
            rating: 4.9,
          },
          {
            id: "act-3",
            name: "Seine River Cruise",
            type: "sightseeing",
            time: "7:00 PM",
            duration: "1.5 hours",
            cost: 15,
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
            description: "Romantic evening cruise along the Seine.",
            rating: 4.7,
          },
        ],
      },
      {
        id: "stop-2",
        city: "Rome",
        country: "Italy",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80",
        startDate: "2026-06-22",
        endDate: "2026-06-28",
        accommodation: "Hotel Artemide",
        accommodationCost: 720,
        transportCost: 90,
        activities: [
          {
            id: "act-4",
            name: "Colosseum Tour",
            type: "culture",
            time: "9:00 AM",
            duration: "3 hours",
            cost: 22,
            image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80",
            description: "Explore the ancient amphitheater of the Roman Empire.",
            rating: 4.9,
          },
          {
            id: "act-5",
            name: "Vatican Museums",
            type: "culture",
            time: "1:00 PM",
            duration: "4 hours",
            cost: 20,
            image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=400&q=80",
            description: "Home to the Sistine Chapel and priceless art.",
            rating: 4.8,
          },
        ],
      },
      {
        id: "stop-3",
        city: "Barcelona",
        country: "Spain",
        image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80",
        startDate: "2026-06-29",
        endDate: "2026-07-05",
        accommodation: "Hotel Arts Barcelona",
        accommodationCost: 980,
        transportCost: 150,
        activities: [
          {
            id: "act-6",
            name: "Sagrada Família",
            type: "culture",
            time: "10:00 AM",
            duration: "2 hours",
            cost: 26,
            image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&q=80",
            description: "Gaudí's unfinished masterpiece basilica.",
            rating: 4.9,
          },
          {
            id: "act-7",
            name: "La Boqueria Market",
            type: "food",
            time: "12:00 PM",
            duration: "2 hours",
            cost: 30,
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
            description: "Famous public market with fresh produce and tapas.",
            rating: 4.6,
          },
        ],
      },
    ],
  },
  {
    id: "trip-2",
    name: "Japan Cherry Blossom",
    description: "Experience the breathtaking sakura season across Tokyo, Kyoto, and Osaka.",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    startDate: "2026-03-25",
    endDate: "2026-04-10",
    destinations: ["Tokyo", "Kyoto", "Osaka"],
    status: "upcoming",
    totalBudget: 4500,
    spentBudget: 4500,
    slug: "japan-cherry-blossom",
    isPublic: true,
    tags: ["Asia", "Culture", "Nature"],
    stops: [
      {
        id: "stop-4",
        city: "Tokyo",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
        startDate: "2026-03-25",
        endDate: "2026-03-31",
        accommodation: "Shinjuku Granbell Hotel",
        accommodationCost: 650,
        transportCost: 200,
        activities: [
          {
            id: "act-8",
            name: "Shibuya Crossing",
            type: "sightseeing",
            time: "8:00 PM",
            duration: "1 hour",
            cost: 0,
            image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
            description: "World's busiest pedestrian crossing.",
            rating: 4.7,
          },
        ],
      },
    ],
  },
  {
    id: "trip-3",
    name: "Bali Wellness Retreat",
    description: "A rejuvenating escape to the Island of Gods — temples, rice terraces, and spa days.",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    startDate: "2025-11-10",
    endDate: "2025-11-24",
    destinations: ["Ubud", "Seminyak", "Nusa Penida"],
    status: "completed",
    totalBudget: 2800,
    spentBudget: 2650,
    slug: "bali-wellness-retreat",
    isPublic: false,
    tags: ["Asia", "Wellness", "Beach"],
    stops: [],
  },
];

// ─── Mock Cities ─────────────────────────────────────────────────────────────

export const mockCities: City[] = [
  {
    id: "city-1",
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    costIndex: 78,
    popularity: 95,
    description: "The City of Light — romance, art, cuisine, and iconic landmarks.",
    tags: ["Romance", "Art", "Food", "Fashion"],
    avgDailyCost: 180,
    bestTime: "Apr–Jun, Sep–Oct",
  },
  {
    id: "city-2",
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    costIndex: 72,
    popularity: 92,
    description: "A dazzling blend of ultramodern and traditional — neon lights meet ancient temples.",
    tags: ["Technology", "Food", "Culture", "Anime"],
    avgDailyCost: 160,
    bestTime: "Mar–May, Sep–Nov",
  },
  {
    id: "city-3",
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    costIndex: 35,
    popularity: 88,
    description: "Tropical paradise with stunning temples, rice terraces, and world-class surf.",
    tags: ["Beach", "Wellness", "Culture", "Surf"],
    avgDailyCost: 65,
    bestTime: "Apr–Oct",
  },
  {
    id: "city-4",
    name: "New York",
    country: "USA",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
    costIndex: 90,
    popularity: 94,
    description: "The city that never sleeps — Broadway, Central Park, and world-class dining.",
    tags: ["Urban", "Art", "Food", "Shopping"],
    avgDailyCost: 250,
    bestTime: "Apr–Jun, Sep–Nov",
  },
  {
    id: "city-5",
    name: "Barcelona",
    country: "Spain",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80",
    costIndex: 62,
    popularity: 87,
    description: "Gaudí's playground — stunning architecture, beaches, and vibrant nightlife.",
    tags: ["Architecture", "Beach", "Food", "Nightlife"],
    avgDailyCost: 130,
    bestTime: "May–Jun, Sep–Oct",
  },
  {
    id: "city-6",
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    costIndex: 70,
    popularity: 90,
    description: "Iconic white-washed buildings, volcanic beaches, and legendary sunsets.",
    tags: ["Romance", "Beach", "Views", "Wine"],
    avgDailyCost: 200,
    bestTime: "May–Oct",
  },
  {
    id: "city-7",
    name: "Kyoto",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
    costIndex: 65,
    popularity: 89,
    description: "Japan's cultural heart — thousands of temples, geisha districts, and bamboo groves.",
    tags: ["Culture", "History", "Nature", "Temples"],
    avgDailyCost: 140,
    bestTime: "Mar–May, Oct–Nov",
  },
  {
    id: "city-8",
    name: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    costIndex: 85,
    popularity: 86,
    description: "Futuristic skyline, luxury shopping, and desert adventures.",
    tags: ["Luxury", "Shopping", "Desert", "Modern"],
    avgDailyCost: 220,
    bestTime: "Nov–Mar",
  },
];

// ─── Mock Activities ──────────────────────────────────────────────────────────

export const mockActivities: Activity[] = [
  {
    id: "a-1",
    name: "Eiffel Tower Visit",
    type: "sightseeing",
    time: "10:00 AM",
    duration: "3 hours",
    cost: 28,
    image: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&q=80",
    description: "Visit the iconic iron lattice tower on the Champ de Mars.",
    rating: 4.8,
  },
  {
    id: "a-2",
    name: "Sushi Making Class",
    type: "food",
    time: "11:00 AM",
    duration: "2 hours",
    cost: 85,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",
    description: "Learn to make authentic sushi from a master chef in Tokyo.",
    rating: 4.9,
  },
  {
    id: "a-3",
    name: "Colosseum Tour",
    type: "culture",
    time: "9:00 AM",
    duration: "3 hours",
    cost: 22,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80",
    description: "Explore the ancient amphitheater of the Roman Empire.",
    rating: 4.9,
  },
  {
    id: "a-4",
    name: "Bali Sunrise Trek",
    type: "adventure",
    time: "4:00 AM",
    duration: "6 hours",
    cost: 45,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80",
    description: "Hike Mount Batur for a breathtaking sunrise above the clouds.",
    rating: 4.8,
  },
  {
    id: "a-5",
    name: "Flamenco Show",
    type: "culture",
    time: "8:00 PM",
    duration: "2 hours",
    cost: 40,
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80",
    description: "Authentic flamenco performance in the heart of Barcelona.",
    rating: 4.7,
  },
  {
    id: "a-6",
    name: "Santorini Sunset Cruise",
    type: "sightseeing",
    time: "5:00 PM",
    duration: "3 hours",
    cost: 75,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80",
    description: "Sail around the caldera and watch the famous Oia sunset.",
    rating: 4.9,
  },
  {
    id: "a-7",
    name: "Street Food Tour",
    type: "food",
    time: "6:00 PM",
    duration: "3 hours",
    cost: 35,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    description: "Taste your way through the best street food stalls.",
    rating: 4.6,
  },
  {
    id: "a-8",
    name: "Desert Safari",
    type: "adventure",
    time: "3:00 PM",
    duration: "6 hours",
    cost: 95,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80",
    description: "Dune bashing, camel riding, and a traditional Bedouin dinner.",
    rating: 4.7,
  },
];

// ─── Mock Checklist ───────────────────────────────────────────────────────────

export const mockChecklist: ChecklistItem[] = [
  // Documents
  { id: "c-1", category: "Documents", name: "Passport", packed: true, essential: true },
  { id: "c-2", category: "Documents", name: "Travel Insurance", packed: true, essential: true },
  { id: "c-3", category: "Documents", name: "Flight Tickets", packed: true, essential: true },
  { id: "c-4", category: "Documents", name: "Hotel Bookings", packed: false, essential: true },
  { id: "c-5", category: "Documents", name: "Visa Documents", packed: false, essential: true },
  // Clothing
  { id: "c-6", category: "Clothing", name: "T-Shirts (5x)", packed: true, essential: false },
  { id: "c-7", category: "Clothing", name: "Jeans (2x)", packed: true, essential: false },
  { id: "c-8", category: "Clothing", name: "Comfortable Shoes", packed: false, essential: false },
  { id: "c-9", category: "Clothing", name: "Rain Jacket", packed: false, essential: false },
  { id: "c-10", category: "Clothing", name: "Swimwear", packed: true, essential: false },
  // Electronics
  { id: "c-11", category: "Electronics", name: "Phone Charger", packed: true, essential: true },
  { id: "c-12", category: "Electronics", name: "Power Bank", packed: false, essential: false },
  { id: "c-13", category: "Electronics", name: "Universal Adapter", packed: false, essential: true },
  { id: "c-14", category: "Electronics", name: "Camera", packed: true, essential: false },
  { id: "c-15", category: "Electronics", name: "Earphones", packed: true, essential: false },
  // Toiletries
  { id: "c-16", category: "Toiletries", name: "Sunscreen SPF 50", packed: false, essential: false },
  { id: "c-17", category: "Toiletries", name: "Toothbrush & Paste", packed: true, essential: true },
  { id: "c-18", category: "Toiletries", name: "Shampoo & Conditioner", packed: false, essential: false },
  { id: "c-19", category: "Toiletries", name: "Deodorant", packed: true, essential: false },
  // Health
  { id: "c-20", category: "Health", name: "First Aid Kit", packed: false, essential: true },
  { id: "c-21", category: "Health", name: "Prescription Meds", packed: true, essential: true },
  { id: "c-22", category: "Health", name: "Hand Sanitizer", packed: true, essential: false },
];

// ─── Mock Notes ───────────────────────────────────────────────────────────────

export const mockNotes: Note[] = [
  {
    id: "n-1",
    tripId: "trip-1",
    title: "Paris Day 1 — Arrived!",
    content: "Finally landed at CDG after a 10-hour flight. The city is even more beautiful than I imagined. Checked into Hotel Le Marais — the room has a tiny balcony overlooking the rooftops. Had the most incredible croissant at the café downstairs. Tomorrow: Eiffel Tower!",
    day: "Day 1",
    city: "Paris",
    createdAt: "2026-06-15T18:30:00Z",
    updatedAt: "2026-06-15T18:30:00Z",
    mood: "excited",
  },
  {
    id: "n-2",
    tripId: "trip-1",
    title: "Louvre was overwhelming (in the best way)",
    content: "Spent 4 hours at the Louvre and barely scratched the surface. The Mona Lisa is smaller than I expected but the Winged Victory of Samothrace blew my mind. Pro tip: book skip-the-line tickets in advance — the queue was massive.",
    day: "Day 2",
    city: "Paris",
    createdAt: "2026-06-16T21:00:00Z",
    updatedAt: "2026-06-16T21:00:00Z",
    mood: "happy",
  },
  {
    id: "n-3",
    tripId: "trip-1",
    title: "Rome first impressions",
    content: "Rome is chaos and beauty combined. The Colosseum is absolutely massive in person — photos don't do it justice. Had the best carbonara of my life at a tiny trattoria near the Pantheon. Note to self: avoid tourist restaurants near major landmarks.",
    day: "Day 7",
    city: "Rome",
    createdAt: "2026-06-22T20:15:00Z",
    updatedAt: "2026-06-22T20:15:00Z",
    mood: "excited",
  },
  {
    id: "n-4",
    tripId: "trip-1",
    title: "Budget check — midway",
    content: "Halfway through the trip and I've spent about $2,400 of my $5,000 budget. Paris was more expensive than expected (accommodation especially). Rome seems more affordable. Need to be careful in Barcelona — planning to splurge on a nice dinner.",
    day: "Day 10",
    city: "Rome",
    createdAt: "2026-06-25T19:00:00Z",
    updatedAt: "2026-06-25T19:00:00Z",
    mood: "neutral",
  },
];

// ─── Budget Data ──────────────────────────────────────────────────────────────

export const mockBudgetBreakdown = {
  total: 5000,
  spent: 3240,
  categories: [
    { name: "Accommodation", budget: 2000, spent: 1540, color: "#f97316" },
    { name: "Transport", budget: 800, spent: 560, color: "#3b82f6" },
    { name: "Food", budget: 1200, spent: 820, color: "#10b981" },
    { name: "Activities", budget: 600, spent: 248, color: "#8b5cf6" },
    { name: "Shopping", budget: 400, spent: 72, color: "#f59e0b" },
  ],
  dailySpend: [
    { day: "Jun 15", amount: 320 },
    { day: "Jun 16", amount: 180 },
    { day: "Jun 17", amount: 240 },
    { day: "Jun 18", amount: 150 },
    { day: "Jun 19", amount: 290 },
    { day: "Jun 20", amount: 210 },
    { day: "Jun 21", amount: 180 },
    { day: "Jun 22", amount: 350 },
    { day: "Jun 23", amount: 220 },
    { day: "Jun 24", amount: 190 },
    { day: "Jun 25", amount: 160 },
    { day: "Jun 26", amount: 280 },
    { day: "Jun 27", amount: 200 },
    { day: "Jun 28", amount: 170 },
  ],
};

// ─── Recommended Destinations ─────────────────────────────────────────────────

export const recommendedDestinations = [
  {
    id: "r-1",
    name: "Golden Bridge, Bà Nà Hills",
    country: "Vietnam",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80",
    tag: "Trending",
  },
  {
    id: "r-2",
    name: "Cappadocia",
    country: "Turkey",
    image: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=600&q=80",
    tag: "Popular",
  },
  {
    id: "r-3",
    name: "Sydney Harbour",
    country: "Australia",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    tag: "Must Visit",
  },
  {
    id: "r-4",
    name: "Amalfi Coast",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=600&q=80",
    tag: "Hidden Gem",
  },
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const mockStories = [
  {
    id: "s-1",
    title: "10 Things to Try in Los Angeles",
    category: "Food and Drink",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    readTime: "4 min read",
    date: "Aug 10, 2024",
    excerpt: "From rooftop bars to hidden taco stands, LA's food scene is endlessly surprising.",
  },
  {
    id: "s-2",
    title: "15 South London Markets You'll Love",
    category: "Shopping",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    readTime: "5 min read",
    date: "May 18, 2024",
    excerpt: "Borough Market is just the beginning — discover the hidden gems of South London.",
  },
  {
    id: "s-3",
    title: "10 Incredible Hotels Around the World with Pools in 2024",
    category: "Hotels",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80",
    readTime: "6 min read",
    date: "Aug 18, 2024",
    excerpt: "Infinity pools, rooftop retreats, and underwater suites — the world's most stunning hotel pools.",
  },
  {
    id: "s-4",
    title: "Visiting Chicago on a Budget",
    category: "Travel Budget",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80",
    readTime: "5 min read",
    date: "Aug 15, 2024",
    excerpt: "Affordable eats, free museums, and stunning architecture — Chicago doesn't have to break the bank.",
  },
];

// ─── User Profile ─────────────────────────────────────────────────────────────

export const mockUser = {
  name: "Maria Angelica",
  email: "maria@traveloop.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  location: "San Francisco, CA",
  bio: "Adventure seeker. Coffee lover. Collecting passport stamps since 2015.",
  tripsCount: 12,
  countriesVisited: 24,
  savedDestinations: ["Paris", "Kyoto", "Patagonia", "Iceland"],
  joinedDate: "January 2023",
};
