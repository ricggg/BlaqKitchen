export type MenuCategory = "bowls" | "grills" | "smoothies" | "snacks" | "drinks";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  priceNaira: number;
  tag: string; // "High protein", "Vegan", "Post-workout", etc.
  popular?: boolean;
};

export const CATEGORY_LABEL: Record<MenuCategory, string> = {
  bowls: "Bowls & Mains",
  grills: "Grills & Wraps",
  smoothies: "Smoothies & Juices",
  snacks: "Snacks & Sides",
  drinks: "Drinks",
};

export const CATEGORY_ORDER: MenuCategory[] = ["bowls", "grills", "smoothies", "snacks", "drinks"];

/**
 * Demo menu shown when Supabase isn't configured yet, and used to seed
 * the `menu_items` table. Once NEXT_PUBLIC_SUPABASE_URL is set, /kitchen
 * fetches from `public.menu_items` instead.
 */
export const DEMO_MENU: MenuItem[] = [
  { id: "mi1", name: "Grilled Chicken & Quinoa Bowl", description: "Charred chicken breast, quinoa, roasted peppers, tahini drizzle.", category: "bowls", priceNaira: 4500, tag: "High protein", popular: true },
  { id: "mi2", name: "Lean Beef & Sweet Potato Bowl", description: "Seared lean beef strips, mashed sweet potato, sautéed greens.", category: "bowls", priceNaira: 5200, tag: "High protein" },
  { id: "mi3", name: "Jollof Power Bowl", description: "Smoky jollof rice, grilled plantain, boiled egg, chicken suya bits.", category: "bowls", priceNaira: 4200, tag: "Local favourite", popular: true },
  { id: "mi4", name: "Vegan Buddha Bowl", description: "Brown rice, roasted chickpeas, avocado, kale, lemon-tahini dressing.", category: "bowls", priceNaira: 3900, tag: "Vegan" },
  { id: "mi5", name: "Lean Beef Suya Wrap", description: "Spiced suya beef, onions, cabbage slaw, whole-wheat wrap.", category: "grills", priceNaira: 3800, tag: "Post-workout", popular: true },
  { id: "mi6", name: "Grilled Fish Platter", description: "Whole grilled tilapia, pepper sauce, jollof rice or salad.", category: "grills", priceNaira: 6500, tag: "High protein" },
  { id: "mi7", name: "Peri-Peri Chicken Skewers", description: "Char-grilled chicken skewers, peri-peri glaze, side salad.", category: "grills", priceNaira: 4800, tag: "Post-workout" },
  { id: "mi8", name: "Turkey Bacon Club Wrap", description: "Turkey bacon, grilled chicken, lettuce, tomato, light mayo.", category: "grills", priceNaira: 4300, tag: "High protein" },
  { id: "mi9", name: "Green Power Smoothie", description: "Spinach, banana, pineapple, ginger, coconut water.", category: "smoothies", priceNaira: 2200, tag: "Recovery", popular: true },
  { id: "mi10", name: "Peanut Butter Protein Shake", description: "Whey protein, peanut butter, banana, oat milk.", category: "smoothies", priceNaira: 2800, tag: "Post-workout" },
  { id: "mi11", name: "Berry Beet Recovery Juice", description: "Beetroot, mixed berries, apple, lemon.", category: "smoothies", priceNaira: 2400, tag: "Recovery" },
  { id: "mi12", name: "Tropical Green Detox", description: "Cucumber, pineapple, mint, lime, spinach.", category: "smoothies", priceNaira: 2200, tag: "Detox" },
  { id: "mi13", name: "Roasted Plantain Chips", description: "Air-fried plantain chips, sea salt, chili dust.", category: "snacks", priceNaira: 1500, tag: "Snack" },
  { id: "mi14", name: "Protein Energy Balls (4pc)", description: "Oats, dates, whey protein, dark chocolate chips.", category: "snacks", priceNaira: 1800, tag: "High protein" },
  { id: "mi15", name: "Greek Yoghurt & Granola Cup", description: "Greek yoghurt, house granola, honey, fresh berries.", category: "snacks", priceNaira: 2000, tag: "Light" },
  { id: "mi16", name: "Suya-Spiced Roasted Nuts", description: "Mixed nuts tossed in suya spice, lightly roasted.", category: "snacks", priceNaira: 1600, tag: "Snack" },
  { id: "mi17", name: "Cold Brew Coffee", description: "House cold brew, served over ice.", category: "drinks", priceNaira: 1800, tag: "Caffeine" },
  { id: "mi18", name: "Sparkling Hibiscus (Zobo)", description: "House zobo, ginger, cloves, light sparkle.", category: "drinks", priceNaira: 1500, tag: "Local favourite" },
  { id: "mi19", name: "Coconut Water", description: "Chilled, straight from the nut.", category: "drinks", priceNaira: 1200, tag: "Hydration" },
  { id: "mi20", name: "Still or Sparkling Water", description: "500ml bottled water.", category: "drinks", priceNaira: 700, tag: "Hydration" },
];

// ── Orders (dashboard + admin demo data) ─────────────────────────────

export type OrderStatus = "received" | "preparing" | "ready" | "completed" | "cancelled";
export type OrderType = "pickup" | "dine_in";

export type KitchenOrderItem = {
  name: string;
  quantity: number;
  unitPriceNaira: number;
};

export type KitchenOrder = {
  id: string;
  items: KitchenOrderItem[];
  orderType: OrderType;
  tableNumber?: string;
  notes?: string;
  status: OrderStatus;
  totalNaira: number;
  createdAt: string; // display string
  customerName?: string; // used in admin view
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Received",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
  received: "text-[var(--color-warn)] bg-[var(--color-warn)]/10",
  preparing: "text-[var(--color-brass)] bg-[var(--color-brass)]/10",
  ready: "text-[var(--color-success)] bg-[var(--color-success)]/10",
  completed: "text-[var(--color-text-muted)] bg-white/5",
  cancelled: "text-[var(--color-danger)] bg-[var(--color-danger)]/10",
};

export const DEMO_ORDERS: KitchenOrder[] = [
  {
    id: "ko1",
    items: [
      { name: "Grilled Chicken & Quinoa Bowl", quantity: 1, unitPriceNaira: 4500 },
      { name: "Green Power Smoothie", quantity: 1, unitPriceNaira: 2200 },
    ],
    orderType: "pickup",
    status: "preparing",
    totalNaira: 6700,
    createdAt: "Today · 12:40",
  },
  {
    id: "ko2",
    items: [{ name: "Lean Beef Suya Wrap", quantity: 2, unitPriceNaira: 3800 }],
    orderType: "dine_in",
    tableNumber: "T4",
    status: "completed",
    totalNaira: 7600,
    createdAt: "Yesterday · 18:05",
  },
];

export const ADMIN_DEMO_ORDERS: KitchenOrder[] = [
  { ...DEMO_ORDERS[0], customerName: "Chidinma Okafor" },
  { ...DEMO_ORDERS[1], customerName: "Tunde Balogun" },
  {
    id: "ko3",
    items: [{ name: "Jollof Power Bowl", quantity: 3, unitPriceNaira: 4200 }],
    orderType: "dine_in",
    tableNumber: "T1",
    status: "received",
    totalNaira: 12600,
    createdAt: "Today · 13:02",
    customerName: "Grace Effiong",
  },
  {
    id: "ko4",
    items: [{ name: "Peri-Peri Chicken Skewers", quantity: 1, unitPriceNaira: 4800 }, { name: "Cold Brew Coffee", quantity: 1, unitPriceNaira: 1800 }],
    orderType: "pickup",
    status: "ready",
    totalNaira: 6600,
    createdAt: "Today · 13:20",
    customerName: "Emeka Nwosu",
  },
];
