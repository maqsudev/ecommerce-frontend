/**
 * Enterprise Fallback & Mock Data Engine
 * Aligned 100% with postman_collection.json (Ecommerce API - Master Collection)
 * Provides instant interactivity, persistent cart & orders across sessions,
 * and seamless fallback when the backend REST API is offline.
 */

import { Brand, Category, Product } from "@/types/catalog";
import { Cart } from "@/types/cart";
import { Order, OrderTrackingResponse } from "@/types/orders";
import { Review } from "@/types/reviews";
import { Notification } from "@/types/notifications";
import { SavedCard } from "@/types/payments";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Noutbuklar & Kompyuterlar",
    slug: "laptops",
    description: "Professional noutbuklar, ultrabuklar va aksessuarlar",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    product_count: 24,
    children: [
      { id: 11, name: "Apple MacBook", slug: "apple-macbook", product_count: 8, parent: 1 },
      { id: 12, name: "Gaming Noutbuklar", slug: "gaming-laptops", product_count: 10, parent: 1 },
      { id: 13, name: "Ultrabuklar", slug: "ultrabooks", product_count: 6, parent: 1 },
    ],
  },
  {
    id: 2,
    name: "Smartfonlar & Gadjetlar",
    slug: "smartphones",
    description: "Eng so'nggi flagman smartfonlar va qulay narxlar",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    product_count: 36,
    children: [
      { id: 21, name: "Apple iPhone", slug: "apple-iphone", product_count: 14, parent: 2 },
      { id: 22, name: "Samsung Galaxy", slug: "samsung-galaxy", product_count: 12, parent: 2 },
      { id: 23, name: "Xiaomi & Poco", slug: "xiaomi", product_count: 10, parent: 2 },
    ],
  },
  {
    id: 3,
    name: "Quloqchinlar & Audio",
    slug: "audio",
    description: "Simsiz quloqchinlar, Hi-Fi akustika va kolonkalar",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    product_count: 18,
    children: [
      { id: 31, name: "Simsiz quloqchinlar (TWS)", slug: "tws-earbuds", product_count: 10, parent: 3 },
      { id: 32, name: "Over-Ear Naushniklar", slug: "over-ear", product_count: 8, parent: 3 },
    ],
  },
  {
    id: 4,
    name: "Aqlli Soatlar & Fitnes",
    slug: "wearables",
    description: "Apple Watch, Galaxy Watch va sport trekerlari",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    product_count: 15,
  },
  {
    id: 5,
    name: "Planshetlar & Elektron Kitoblar",
    slug: "tablets",
    description: "iPad, Galaxy Tab va chizish uchun grafik planshetlar",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
    product_count: 12,
  },
  {
    id: 6,
    name: "Maishiy Texnika & Uy",
    slug: "appliances",
    description: "Dyson texnikasi, robot changyutgichlar va aqlli uy",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
    product_count: 20,
  },
];

export const MOCK_BRANDS: Brand[] = [
  { id: 1, name: "Apple", slug: "apple", description: "Think Different. Cupertino, California", product_count: 28 },
  { id: 2, name: "Samsung", slug: "samsung", description: "Do What You Can't. Seoul, Korea", product_count: 22 },
  { id: 3, name: "Sony", slug: "sony", description: "Be Moved. Tokyo, Japan", product_count: 14 },
  { id: 4, name: "Dyson", slug: "dyson", description: "Engineered to perform. UK", product_count: 8 },
  { id: 5, name: "Xiaomi", slug: "xiaomi", description: "Innovation for Everyone", product_count: 16 },
  { id: 6, name: "Asus", slug: "asus", description: "In Search of Incredible", product_count: 9 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 16" M3 Max (36GB / 1TB)',
    slug: "macbook-pro-16",
    description:
      "Apple M3 Max chipi bilan jihozlangan eng kuchli noutbuk. 16.2 dyuymli Liquid Retina XDR displeyi, 120Hz ProMotion chastotasi va 22 soatgacha batareya quvvati bilan professional montajchilar va dasturchilar uchun ideal tanlov.",
    short_description: "16-dyuym Liquid Retina XDR, M3 Max 14-core CPU, 30-core GPU, 36GB RAM, 1TB SSD",
    category: MOCK_CATEGORIES[0],
    brand: MOCK_BRANDS[0],
    base_price: "34900000",
    discount_price: "32900000",
    rating: 4.9,
    review_count: 48,
    is_featured: true,
    in_stock: true,
    images: [
      {
        id: 101,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
        is_primary: true,
        alt_text: "MacBook Pro 16 Space Black",
      },
      {
        id: 102,
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80",
        is_primary: false,
        alt_text: "MacBook Pro 16 keyboard and trackpad",
      },
    ],
    variants: [
      {
        id: 1,
        sku: "MBP-16-SG-16",
        name: "Space Black / 36GB / 1TB",
        attributes: { color: "Space Black", ram: "36GB", storage: "1TB" },
        price: "32900000",
        compare_at_price: "34900000",
        stock_quantity: 12,
        in_stock: true,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 2,
        sku: "MBP-16-SL-16",
        name: "Silver / 36GB / 1TB",
        attributes: { color: "Silver", ram: "36GB", storage: "1TB" },
        price: "32900000",
        compare_at_price: "34900000",
        stock_quantity: 8,
        in_stock: true,
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    attributes: {
      Protsessor: "Apple M3 Max (14 yadro)",
      Ekran: '16.2" Liquid Retina XDR (3456x2234)',
      Operativ_xotira: "36 GB Unified Memory",
      Ichki_xotira: "1 TB SSD NVMe",
      Batareya: "100 Wh, 140W USB-C adapter",
      Og_irligi: "2.16 kg",
    },
    created_at: "2026-10-15T10:00:00Z",
  },
  {
    id: 2,
    name: "iPhone 16 Pro Max 256GB Desert Titanium",
    slug: "iphone-16-pro-max",
    description:
      "Titan korpus, yangi A18 Pro protsessori, 48MP asosiy kamera hamda maxsus Camera Control sensorli tugmasi. 6.9 dyuymli eng nozik romli Super Retina XDR displey.",
    short_description: "6.9-dyuym OLED 120Hz, A18 Pro, 48MP 5x Zoom, Desert Titanium",
    category: MOCK_CATEGORIES[1],
    brand: MOCK_BRANDS[0],
    base_price: "18500000",
    discount_price: "17200000",
    rating: 4.8,
    review_count: 82,
    is_featured: true,
    in_stock: true,
    images: [
      {
        id: 201,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
        is_primary: true,
        alt_text: "iPhone 16 Pro Max Front",
      },
    ],
    variants: [
      {
        id: 3,
        sku: "IP16PM-256-DESERT",
        name: "Desert Titanium / 256GB",
        attributes: { color: "Desert Titanium", storage: "256GB" },
        price: "17200000",
        compare_at_price: "18500000",
        stock_quantity: 25,
        in_stock: true,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 4,
        sku: "IP16PM-512-BLACK",
        name: "Black Titanium / 512GB",
        attributes: { color: "Black Titanium", storage: "512GB" },
        price: "19800000",
        compare_at_price: "21000000",
        stock_quantity: 14,
        in_stock: true,
      },
    ],
    attributes: {
      Displey: '6.9" Super Retina XDR OLED 120Hz ProMotion',
      Protsessor: "Apple A18 Pro (3nm)",
      Asosiy_kamera: "48 MP + 48 MP Ultra-wide + 12 MP 5x Telephoto",
      Batareya: "4685 mA/soat, MagSafe 25W",
    },
    created_at: "2026-10-18T12:00:00Z",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Simsiz Shovqinni So'ndiruvchi Quloqchin",
    slug: "sony-wh-1000xm5",
    description:
      "Dunyoning eng yaxshi shovqinni to'suvchi (Active Noise Cancelling) texnologiyasi. 8 mikrofon, ikkita protsessor va 30 soatgacha to'xtovsiz musiqa tinglash imkoniyati.",
    short_description: "ANC, 30 soat batareya, LDAC Hi-Res Audio, Multipoint Connection",
    category: MOCK_CATEGORIES[2],
    brand: MOCK_BRANDS[2],
    base_price: "4800000",
    discount_price: "4200000",
    rating: 4.9,
    review_count: 64,
    is_featured: true,
    in_stock: true,
    images: [
      {
        id: 301,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
        is_primary: true,
        alt_text: "Sony WH-1000XM5 Black",
      },
    ],
    variants: [
      {
        id: 5,
        sku: "SONY-XM5-BLK",
        name: "Black / ANC",
        attributes: { color: "Black" },
        price: "4200000",
        compare_at_price: "4800000",
        stock_quantity: 32,
        in_stock: true,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      },
      {
        id: 6,
        sku: "SONY-XM5-SLV",
        name: "Silver / ANC",
        attributes: { color: "Silver" },
        price: "4200000",
        compare_at_price: "4800000",
        stock_quantity: 18,
        in_stock: true,
      },
    ],
    attributes: {
      Ulanish: "Bluetooth 5.2, 3.5mm AUX, LDAC, AAC",
      Avtonomlik: "30 soat (ANC yoqilgan holda)",
      Shovqinni_to_sish: "HD Noise Cancelling Processor QN1 + V1",
      Og_irligi: "250 gramm",
    },
    created_at: "2026-10-10T14:00:00Z",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24 Ultra 12GB/512GB Titanium Gray",
    slug: "samsung-galaxy-s24-ultra",
    description:
      "Galaxy AI imkoniyatlari bilan boyitilgan flagman. 200MP kamera, o'rnatilgan S-Pen stilus va quyosh ostida aks etmaydigan Gorilla Armor oynasi.",
    short_description: "6.8-dyuym QHD+ AMOLED 120Hz, Snapdragon 8 Gen 3, 200MP, S-Pen",
    category: MOCK_CATEGORIES[1],
    brand: MOCK_BRANDS[1],
    base_price: "16500000",
    discount_price: "15300000",
    rating: 4.8,
    review_count: 53,
    is_featured: true,
    in_stock: true,
    images: [
      {
        id: 401,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80",
        is_primary: true,
        alt_text: "Samsung Galaxy S24 Ultra",
      },
    ],
    variants: [
      {
        id: 7,
        sku: "S24U-512-GRAY",
        name: "Titanium Gray / 512GB",
        attributes: { color: "Titanium Gray", storage: "512GB" },
        price: "15300000",
        compare_at_price: "16500000",
        stock_quantity: 16,
        in_stock: true,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    attributes: {
      Displey: '6.8" Dynamic AMOLED 2X, 1-120Hz, 2600 nits',
      Protsessor: "Snapdragon 8 Gen 3 for Galaxy",
      Kamera: "200 MP + 50 MP (5x) + 10 MP (3x) + 12 MP Ultra-wide",
      Akkumulyator: "5000 mA/soat, 45W simli zaryad",
    },
    created_at: "2026-10-12T16:00:00Z",
  },
  {
    id: 5,
    name: "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium",
    slug: "apple-watch-ultra-2",
    description:
      "Ekstremal sharoitlar va sport ixlosmandlari uchun yaratilgan mustahkam soat. 3000 nits yorqinlik, 36-72 soat batareya quvvati va 100 metrgacha suvga chidamlilik.",
    short_description: "49mm Aviatsiya titani, 3000 nits, Ikki chastotali GPS, Suv osti kompyuteri",
    category: MOCK_CATEGORIES[3],
    brand: MOCK_BRANDS[0],
    base_price: "11500000",
    discount_price: "10400000",
    rating: 4.9,
    review_count: 37,
    is_featured: true,
    in_stock: true,
    images: [
      {
        id: 501,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
        is_primary: true,
        alt_text: "Apple Watch Ultra 2",
      },
    ],
    variants: [
      {
        id: 8,
        sku: "AWU2-49-ORANGE",
        name: "Orange Ocean Band / 49mm",
        attributes: { band: "Orange Ocean Band", size: "49mm" },
        price: "10400000",
        compare_at_price: "11500000",
        stock_quantity: 9,
        in_stock: true,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    attributes: {
      Korpus: "49mm Aviatsiya darajasidagi titan",
      Yorqinlik: "3000 nits (quyosh ostida ravshan ko'rinadi)",
      Sensorlar: "EKG, Qondagi kislorod, Chuqurlik o'lchagich, Siren 86dB",
    },
    created_at: "2026-10-20T08:00:00Z",
  },
  {
    id: 6,
    name: "Dyson Airwrap Multi-Styler Complete Long",
    slug: "dyson-airwrap-complete",
    description:
      "Sochlarni haddan tashqari qizdirmasdan havoning Koanda effekti bilan shakllantiruvchi va turmaklovchi afsonaviy Dyson stayleri.",
    short_description: "Koanda aerodinamik effekti, 6 xil nasadka, Ionli himoya, Nickel/Copper",
    category: MOCK_CATEGORIES[5],
    brand: MOCK_BRANDS[3],
    base_price: "8200000",
    discount_price: "7600000",
    rating: 4.9,
    review_count: 58,
    is_featured: true,
    in_stock: true,
    images: [
      {
        id: 601,
        image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80",
        is_primary: true,
        alt_text: "Dyson Airwrap Multi-Styler",
      },
    ],
    variants: [
      {
        id: 9,
        sku: "DYSON-AIR-NC",
        name: "Nickel / Copper / Complete Long",
        attributes: { color: "Nickel / Copper" },
        price: "7600000",
        compare_at_price: "8200000",
        stock_quantity: 6,
        in_stock: true,
        image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    attributes: {
      Quvvat: "1300 Watt",
      Havo_oqimi: "13.5 l/s havo oqimi",
      Issiqlik_nazorati: "Sekundiga 40 marta haroratni o'lchash",
    },
    created_at: "2026-10-22T09:00:00Z",
  },
];

export const MOCK_REVIEWS: Record<number, Review[]> = {
  1: [
    {
      id: 1,
      product_id: 1,
      user: { id: 101, name: "Farhod Karimov" },
      rating: 5,
      title: "Haqiqiy professional noutbuk!",
      comment: "M3 Max protsessori montajda umuman qizimaydi va shovqinsiz ishlaydi. 16 dyuymli ekran eng yaxshisi.",
      pros: "Katta va sifatli ekran, yuqori tezlik, batareya 20+ soat ushlab turadi",
      cons: "Biroz og'irroq",
      is_verified_purchase: true,
      helpful_votes: 14,
      unhelpful_votes: 1,
      reply: {
        comment: "Xaridingiz va ijobiy bahoingiz uchun tashakkur! Unumli xizmat qilsin.",
        author: "Rasmiy Do'kon",
        created_at: "2026-10-26T09:00:00Z",
      },
      images: [],
      created_at: "2026-10-25T11:20:00Z",
    },
    {
      id: 2,
      product_id: 1,
      user: { id: 102, name: "Aziza Rahimova" },
      rating: 5,
      title: "Dasturchilar uchun ajoyib qurol",
      comment: "Docker, simulatorlar va o'nlab dasturlar bir vaqtda ochilganda ham yengil ishlaydi.",
      pros: "36GB xotira barcha ishlar uchun yetarli",
      cons: "Narxi qimmat, lekin arziydi",
      is_verified_purchase: true,
      helpful_votes: 9,
      unhelpful_votes: 0,
      images: [],
      created_at: "2026-10-28T14:10:00Z",
    },
  ],
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: "Buyurtmangiz yetkazilmoqda!",
    message: "ORD-2026-1048 raqamli buyurtmangiz kuryerga topshirildi. Kuryer bilan bog'lanish: +998901234567.",
    notification_type: "ORDER",
    priority: "HIGH",
    is_read: false,
    created_at: "Bugun, 14:30",
  },
  {
    id: 2,
    title: "To'lov muvaffaqiyatli qabul qilindi",
    message: "Payme orqali 32 900 000 so'm to'lovingiz qabul qilindi.",
    notification_type: "PAYMENT",
    priority: "MEDIUM",
    is_read: false,
    created_at: "Kecha, 18:15",
  },
  {
    id: 3,
    title: "Yangi mavsum aksiyasi: SAVE20",
    message: "Barcha smartfon va noutbuklar uchun SAVE20 promokodi orqali 20% gacha tejashga shoshiling!",
    notification_type: "PROMO",
    priority: "LOW",
    is_read: true,
    created_at: "2 kun oldin",
  },
];

const STORAGE_KEYS = {
  CART: "ecommerce_mock_cart",
  ORDERS: "ecommerce_mock_orders",
  CARDS: "ecommerce_mock_cards",
};

export function getMockCart(): Cart {
  if (typeof window === "undefined") {
    return {
      id: 1,
      items: [
        {
          id: 1,
          variant_id: 1,
          variant: MOCK_PRODUCTS[0].variants[0],
          product: MOCK_PRODUCTS[0],
          quantity: 1,
          unit_price: MOCK_PRODUCTS[0].variants[0].price,
          total_price: MOCK_PRODUCTS[0].variants[0].price,
        },
      ],
      total_items: 1,
      subtotal: "32900000",
      discount: "0",
      total: "32900000",
    };
  }

  const raw = localStorage.getItem(STORAGE_KEYS.CART);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      //
    }
  }

  const defaultCart: Cart = {
    id: "CART-GUEST-1",
    items: [],
    total_items: 0,
    subtotal: "0",
    discount: "0",
    total: "0",
  };
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(defaultCart));
  return defaultCart;
}

export function saveMockCart(cart: Cart) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }
}

export function recalculateCart(cart: Cart): Cart {
  let subtotal = 0;
  let totalItems = 0;

  for (const item of cart.items) {
    const unitPrice = Number(item.unit_price) || 0;
    const itemTotal = unitPrice * item.quantity;
    item.total_price = itemTotal.toString();
    subtotal += itemTotal;
    totalItems += item.quantity;
  }

  let discount = 0;
  if (cart.coupon === "SAVE20") {
    discount = Math.round(subtotal * 0.2);
  } else if (cart.coupon === "YANGI10") {
    discount = Math.round(subtotal * 0.1);
  }

  const total = Math.max(0, subtotal - discount);

  return {
    ...cart,
    total_items: totalItems,
    subtotal: subtotal.toString(),
    discount: discount.toString(),
    total: total.toString(),
  };
}

export function getMockOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      //
    }
  }
  const initialOrders: Order[] = [
    {
      id: 101,
      order_number: "ORD-2026-1048",
      status: "SHIPPED",
      payment_method: "PAYME",
      payment_status: "COMPLETED",
      shipping_method: "STANDARD",
      shipping_address: {
        recipient_name: "Alisher Navoiy",
        phone_number: "+998901234567",
        region: "Toshkent shahri",
        district: "Mirobod tumani",
        street_address: "Amir Temur shoh ko'chasi 15-uy",
        apartment_office: "24-xonadon",
      },
      items: [
        {
          id: 1,
          variant_id: 1,
          product_name: 'MacBook Pro 16" M3 Max',
          variant_name: "Space Black / 36GB / 1TB",
          sku: "MBP-16-SG-16",
          unit_price: "32900000",
          quantity: 1,
          total_price: "32900000",
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        },
      ],
      subtotal: "32900000",
      shipping_fee: "35000",
      discount_amount: "0",
      total_amount: "32935000",
      created_at: "2026-11-01T14:20:00Z",
    },
  ];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
  return initialOrders;
}

export function saveMockOrders(orders: Order[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
}

export function getMockCards(): SavedCard[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      //
    }
  }
  const defaultCards: SavedCard[] = [
    {
      id: 1,
      card_number: "8600 •••• •••• 9812",
      expire_date: "12/28",
      card_holder: "ALISHER NAVOIY",
      card_type: "UZCARD",
      is_default: true,
      created_at: "2026-10-15T12:00:00Z",
    },
    {
      id: 2,
      card_number: "9860 •••• •••• 4421",
      expire_date: "08/29",
      card_holder: "ALISHER NAVOIY",
      card_type: "HUMO",
      is_default: false,
      created_at: "2026-10-22T09:30:00Z",
    },
  ];
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(defaultCards));
  return defaultCards;
}

export function saveMockCards(cards: SavedCard[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  }
}

/**
 * Main Mock Dispatcher: intercept API calls when backend is offline
 */
export async function dispatchMockResponse(
  method: string,
  url: string,
  data?: any,
  params?: any
): Promise<any> {
  const normUrl = url.split("?")[0].replace(/\/+$/, "");
  const upperMethod = method.toUpperCase();

  // 1. Auth endpoints
  if (normUrl.endsWith("/auth/login")) {
    const user = {
      id: 1,
      email: data?.email || "user@example.com",
      first_name: "Alisher",
      last_name: "Navoiy",
      role: "CUSTOMER",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("ecommerce_access_token", "mock_access_token_jwt");
      localStorage.setItem("ecommerce_refresh_token", "mock_refresh_token_jwt");
      localStorage.setItem("ecommerce_user_data", JSON.stringify(user));
    }
    return {
      access: "mock_access_token_jwt",
      refresh: "mock_refresh_token_jwt",
      user,
    };
  }

  if (normUrl.endsWith("/auth/register") || normUrl.endsWith("/auth/send-otp")) {
    return {
      message: "Tasdiqlash kodi elektron pochtangizga yuborildi. Kod: 123456",
      email: data?.email || "user@example.com",
      expires_in: 300,
    };
  }

  if (normUrl.endsWith("/auth/verify-otp")) {
    const user = {
      id: 1,
      email: data?.email || "user@example.com",
      first_name: "Alisher",
      last_name: "Navoiy",
      role: "CUSTOMER",
    };
    return {
      access: "mock_access_token_jwt",
      refresh: "mock_refresh_token_jwt",
      user,
    };
  }

  if (normUrl.endsWith("/auth/me")) {
    return {
      id: 1,
      email: "user@example.com",
      first_name: "Alisher",
      last_name: "Navoiy",
      phone_number: "+998901234567",
      role: "CUSTOMER",
      date_joined: "2026-01-15T10:00:00Z",
    };
  }

  // 2. Catalog Categories
  if (normUrl.endsWith("/catalog/categories")) {
    return MOCK_CATEGORIES;
  }

  if (normUrl.includes("/catalog/categories/")) {
    const slug = normUrl.split("/catalog/categories/")[1]?.replace(/\/$/, "");
    const found = MOCK_CATEGORIES.find((c) => c.slug === slug);
    return found || MOCK_CATEGORIES[0];
  }

  // 3. Catalog Brands
  if (normUrl.endsWith("/catalog/brands")) {
    const query = params?.q?.toLowerCase() || "";
    if (query) {
      return MOCK_BRANDS.filter((b) => b.name.toLowerCase().includes(query));
    }
    return MOCK_BRANDS;
  }

  if (normUrl.includes("/catalog/brands/")) {
    const slug = normUrl.split("/catalog/brands/")[1]?.replace(/\/$/, "");
    const found = MOCK_BRANDS.find((b) => b.slug === slug);
    return found || MOCK_BRANDS[0];
  }

  // 4. Featured products
  if (normUrl.endsWith("/catalog/featured")) {
    return MOCK_PRODUCTS.filter((p) => p.is_featured);
  }

  // 5. Catalog Search suggestions
  if (normUrl.endsWith("/catalog/search/suggest")) {
    const q = (params?.q || "").toLowerCase();
    const matchedProducts = MOCK_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q)
    ).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.discount_price || p.base_price),
      image: p.images[0]?.image,
    }));
    const matchedCategories = MOCK_CATEGORIES.filter((c: Category) =>
      c.name.toLowerCase().includes(q)
    ).map((c: Category) => ({ id: c.id, name: c.name, slug: c.slug }));
    const matchedBrands = MOCK_BRANDS.filter((b: Brand) =>
      b.name.toLowerCase().includes(q)
    ).map((b: Brand) => ({ id: b.id, name: b.name, slug: b.slug }));

    return {
      products: matchedProducts,
      categories: matchedCategories,
      brands: matchedBrands,
    };
  }

  // 6. Dynamic Filters
  if (normUrl.endsWith("/catalog/filters")) {
    return {
      categories: MOCK_CATEGORIES,
      brands: MOCK_BRANDS,
      price_range: { min: 4000000, max: 35000000 },
      attributes: [
        {
          code: "color",
          name: "Rang",
          options: [
            { value: "space-black", label: "Space Black", count: 8 },
            { value: "silver", label: "Silver", count: 6 },
            { value: "desert-titanium", label: "Desert Titanium", count: 4 },
            { value: "black", label: "Black", count: 12 },
          ],
        },
        {
          code: "storage",
          name: "Xotira hajmi",
          options: [
            { value: "256gb", label: "256 GB", count: 14 },
            { value: "512gb", label: "512 GB", count: 18 },
            { value: "1tb", label: "1 TB", count: 8 },
          ],
        },
      ],
    };
  }

  // 7. Single Product Variant
  if (normUrl.includes("/variants/")) {
    const parts = normUrl.split("/");
    const sku = parts[parts.length - 1];
    for (const p of MOCK_PRODUCTS) {
      const v = p.variants.find((v) => v.sku === sku);
      if (v) return v;
    }
    return MOCK_PRODUCTS[0].variants[0];
  }

  // 8. Single Product Details
  if (normUrl.includes("/catalog/products/")) {
    const slug = normUrl.split("/catalog/products/")[1]?.replace(/\/$/, "");
    const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (found) return found;
  }

  // 9. Catalog Products List (Faceted Filtering & Pagination)
  if (normUrl.endsWith("/catalog/products")) {
    let list = [...MOCK_PRODUCTS];

    if (params?.category) {
      list = list.filter(
        (p) =>
          typeof p.category === "object" &&
          (p.category.slug === params.category ||
            p.category.children?.some((c: Category) => c.slug === params.category))
      );
    }

    if (params?.brand) {
      list = list.filter((p) => p.brand?.slug === params.brand);
    }

    if (params?.in_stock) {
      list = list.filter((p) => p.in_stock);
    }

    if (params?.min_price) {
      list = list.filter(
        (p) => Number(p.discount_price || p.base_price) >= Number(params.min_price)
      );
    }

    if (params?.max_price) {
      list = list.filter(
        (p) => Number(p.discount_price || p.base_price) <= Number(params.max_price)
      );
    }

    if (params?.q) {
      const q = params.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand?.name.toLowerCase().includes(q)
      );
    }

    if (params?.ordering) {
      if (params.ordering === "price") {
        list.sort(
          (a, b) =>
            Number(a.discount_price || a.base_price) -
            Number(b.discount_price || b.base_price)
        );
      } else if (params.ordering === "-price") {
        list.sort(
          (a, b) =>
            Number(b.discount_price || b.base_price) -
            Number(a.discount_price || a.base_price)
        );
      } else if (params.ordering === "-created_at") {
        list.sort(
          (a, b) =>
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
        );
      }
    }

    return {
      count: list.length,
      next: null,
      previous: null,
      results: list,
    };
  }

  // 10. Cart Endpoints
  if (normUrl.endsWith("/cart/count")) {
    const cart = getMockCart();
    return { count: cart.total_items || 0 };
  }

  if (normUrl.endsWith("/cart") && upperMethod === "GET") {
    return getMockCart();
  }

  if (normUrl.endsWith("/cart/items") && upperMethod === "POST") {
    const cart = getMockCart();
    const variantId = Number(data?.variant_id);
    const quantity = Number(data?.quantity) || 1;

    let targetVariant = null;
    let targetProduct: Product = MOCK_PRODUCTS[0];
    for (const p of MOCK_PRODUCTS) {
      const v = p.variants.find((v) => v.id === variantId);
      if (v) {
        targetVariant = v;
        targetProduct = p;
        break;
      }
    }

    if (!targetVariant) {
      targetVariant = MOCK_PRODUCTS[0].variants[0];
      targetProduct = MOCK_PRODUCTS[0];
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.variant_id === variantId
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].total_price = (
        Number(cart.items[existingIndex].unit_price) *
        cart.items[existingIndex].quantity
      ).toString();
    } else {
      cart.items.push({
        id: Date.now(),
        variant_id: variantId,
        variant: targetVariant,
        product: targetProduct,
        quantity,
        unit_price: targetVariant.price,
        total_price: (Number(targetVariant.price) * quantity).toString(),
      });
    }

    const updated = recalculateCart(cart);
    saveMockCart(updated);
    return updated;
  }

  if (normUrl.includes("/cart/items/") && upperMethod === "PATCH") {
    const parts = normUrl.split("/");
    const itemId = Number(parts[parts.length - 1]);
    const cart = getMockCart();
    const item = cart.items.find((i) => i.id === itemId);
    if (item && data?.quantity !== undefined) {
      item.quantity = Math.max(1, Number(data.quantity));
      item.total_price = (Number(item.unit_price) * item.quantity).toString();
    }
    const updated = recalculateCart(cart);
    saveMockCart(updated);
    return updated;
  }

  if (normUrl.includes("/cart/items/") && upperMethod === "DELETE") {
    const parts = normUrl.split("/");
    const itemId = Number(parts[parts.length - 1]);
    const cart = getMockCart();
    cart.items = cart.items.filter((i) => i.id !== itemId);
    const updated = recalculateCart(cart);
    saveMockCart(updated);
    return updated;
  }

  if (normUrl.endsWith("/cart/clear") && upperMethod === "POST") {
    const cart = getMockCart();
    cart.items = [];
    const updated = recalculateCart(cart);
    saveMockCart(updated);
    return updated;
  }

  if (normUrl.endsWith("/cart/merge") && upperMethod === "POST") {
    return {
      merged: true,
      total_items: getMockCart().total_items,
      message: "Mehmon savati muvaffaqiyatli birlashtirildi",
    };
  }

  // 11. Checkout & Orders
  if (normUrl.endsWith("/orders/coupons/validate")) {
    const code = (data?.code || "").toUpperCase();
    const subtotal = Number(data?.subtotal) || 0;
    if (code === "SAVE20") {
      const discount = Math.round(subtotal * 0.2);
      return {
        valid: true,
        discount_amount: discount.toString(),
        discount_percent: 20,
        message: "SAVE20 promokodi qo'llandi (-20%)!",
      };
    }
    if (code === "YANGI10") {
      const discount = Math.round(subtotal * 0.1);
      return {
        valid: true,
        discount_amount: discount.toString(),
        discount_percent: 10,
        message: "YANGI10 promokodi qo'llandi (-10%)!",
      };
    }
    return {
      valid: false,
      discount_amount: "0",
      message: "Noto'g'ri yoki muddati o'tgan promokod",
    };
  }

  if (normUrl.endsWith("/orders/checkout/preview")) {
    const cart = getMockCart();
    const subtotal = Number(cart.subtotal) || 32900000;
    let shippingFee = 35000;
    if (data?.shipping_method === "EXPRESS") shippingFee = 60000;
    if (data?.shipping_method === "PICKUP" || subtotal > 10000000) shippingFee = 0;

    let discount = 0;
    if (data?.coupon_code === "SAVE20") discount = Math.round(subtotal * 0.2);

    const grandTotal = Math.max(0, subtotal - discount + shippingFee);

    return {
      subtotal: subtotal.toString(),
      shipping_fee: shippingFee.toString(),
      discount: discount.toString(),
      estimated_tax: "0",
      grand_total: grandTotal.toString(),
      estimated_delivery_days: data?.shipping_method === "EXPRESS" ? 0 : 2,
      coupon_applied: !!data?.coupon_code,
    };
  }

  if (normUrl.endsWith("/orders") && upperMethod === "POST") {
    const cart = getMockCart();
    const orders = getMockOrders();
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: Date.now(),
      order_number: orderNumber,
      status: "CONFIRMED",
      payment_method: data?.payment_method || "PAYME",
      payment_status: data?.payment_method === "CASH_ON_DELIVERY" ? "PENDING" : "COMPLETED",
      shipping_method: data?.shipping_method || "STANDARD",
      shipping_address: data?.shipping_address || {
        recipient_name: "Alisher Navoiy",
        phone_number: "+998901234567",
        region: "Toshkent",
        district: "Mirobod",
        street_address: "Amir Temur shoh ko'chasi 15",
      },
      items: cart.items.length > 0 ? cart.items.map((i) => ({
        id: i.id,
        variant_id: i.variant_id,
        product_name: i.product?.name || "Mahsulot",
        variant_name: i.variant?.name || "Variant",
        sku: i.variant?.sku || "SKU-001",
        unit_price: i.unit_price,
        quantity: i.quantity,
        total_price: i.total_price,
        image: i.variant?.image || i.product?.images?.[0]?.image,
      })) : [
        {
          id: 1,
          variant_id: 1,
          product_name: MOCK_PRODUCTS[0].name,
          sku: "MBP-16-SG-16",
          unit_price: "32900000",
          quantity: 1,
          total_price: "32900000",
          image: MOCK_PRODUCTS[0].images[0]?.image,
        },
      ],
      subtotal: cart.subtotal || "32900000",
      shipping_fee: "35000",
      discount_amount: cart.discount || "0",
      total_amount: (Number(cart.total || 32900000) + 35000).toString(),
      coupon_code: data?.coupon_code,
      customer_notes: data?.customer_notes,
      created_at: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    saveMockOrders(orders);

    // Clear cart after order
    cart.items = [];
    saveMockCart(recalculateCart(cart));

    return newOrder;
  }

  if (normUrl.endsWith("/orders") && upperMethod === "GET") {
    const orders = getMockOrders();
    return {
      count: orders.length,
      next: null,
      previous: null,
      results: orders,
    };
  }

  if (normUrl.includes("/orders/") && normUrl.endsWith("/tracking")) {
    const orderNumber = normUrl.split("/orders/")[1].replace("/tracking", "").replace(/\/$/, "");
    const trackingRes: OrderTrackingResponse = {
      order_number: orderNumber,
      status: "SHIPPED",
      tracking_number: "UZEX-20261022-9988",
      carrier: "Express Courier Uzbekistan",
      milestones: [
        { title: "Buyurtma qabul qilindi", description: "Buyurtma tizimga muvaffaqiyatli qabul qilindi", timestamp: "2026-11-01T14:20:00Z", completed: true, current: false },
        { title: "To'lov tasdiqlandi", description: "To'lov muvaffaqiyatli o'tdi", timestamp: "2026-11-01T14:25:00Z", completed: true, current: false },
        { title: "Ombordan yig'ilmoqda", description: "Mahsulotlar qadoqlanmoqda", timestamp: "2026-11-01T16:00:00Z", completed: true, current: false },
        { title: "Yetkazib berishga chiqdi", description: "Kuryer yo'lda", timestamp: "2026-11-02T10:00:00Z", completed: true, current: true },
        { title: "Mijozga topshirildi", description: "Topshirish kutilmoqda", timestamp: "", completed: false, current: false },
      ],
    };
    return trackingRes;
  }

  if (normUrl.includes("/orders/") && normUrl.endsWith("/invoice")) {
    const orders = getMockOrders();
    return orders[0];
  }

  if (normUrl.includes("/orders/") && upperMethod === "GET") {
    const orderNumber = normUrl.split("/orders/")[1].replace(/\/$/, "");
    const orders = getMockOrders();
    const found = orders.find((o) => o.order_number === orderNumber);
    return found || orders[0];
  }

  // 12. Saved Cards & Payments
  if (normUrl.endsWith("/payments/cards") && upperMethod === "GET") {
    return getMockCards();
  }

  if (normUrl.endsWith("/payments/cards") && upperMethod === "POST") {
    return {
      card_id: Date.now(),
      message: "Tasdiqlash kodi telefoningizga yuborildi. Kod: 123456",
      expires_in: 120,
    };
  }

  if (normUrl.includes("/payments/cards/") && normUrl.endsWith("/verify")) {
    const cards = getMockCards();
    const newCard: SavedCard = {
      id: Date.now(),
      card_number: "8600 •••• •••• 1234",
      expire_date: "12/28",
      card_holder: "ALISHER NAVOIY",
      card_type: "UZCARD",
      is_default: cards.length === 0,
      created_at: new Date().toISOString(),
    };
    cards.push(newCard);
    saveMockCards(cards);
    return {
      success: true,
      card: newCard,
      message: "Karta muvaffaqiyatli saqlandi!",
    };
  }

  if (normUrl.includes("/payments/cards/") && normUrl.endsWith("/default")) {
    const parts = normUrl.split("/");
    const id = Number(parts[parts.length - 2]);
    const cards = getMockCards();
    cards.forEach((c) => (c.is_default = c.id === id));
    saveMockCards(cards);
    return { success: true };
  }

  if (normUrl.includes("/payments/cards/") && upperMethod === "DELETE") {
    const parts = normUrl.split("/");
    const id = Number(parts[parts.length - 1]);
    let cards = getMockCards();
    cards = cards.filter((c) => c.id !== id);
    saveMockCards(cards);
    return { success: true };
  }

  if (normUrl.endsWith("/payments/initialize")) {
    return {
      payment_number: `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      provider: data?.provider || "PAYME",
      payment_url: "https://checkout.paycom.uz/mock",
      status: "PENDING",
    };
  }

  if (normUrl.endsWith("/payments/pay-with-card")) {
    return {
      status: "COMPLETED",
      transaction_id: "TX-99881122",
      message: "To'lov muvaffaqiyatli amalga oshirildi!",
    };
  }

  // 13. Reviews & Ratings
  if (normUrl.includes("/reviews/products/") && normUrl.endsWith("/summary")) {
    return {
      average_rating: 4.9,
      total_reviews: 48,
      distribution: {
        5: 42,
        4: 5,
        3: 1,
        2: 0,
        1: 0,
      },
      recommendation_percentage: 98,
    };
  }

  if (normUrl.includes("/reviews/products/") && upperMethod === "GET") {
    return {
      count: 2,
      results: MOCK_REVIEWS[1] || [],
    };
  }

  if (normUrl.includes("/reviews/products/") && upperMethod === "POST") {
    const newRev: Review = {
      id: Date.now(),
      product_id: 1,
      user: { id: 999, name: "Alisher Navoiy" },
      rating: Number(data?.rating) || 5,
      title: data?.title || "Fikr bildirildi",
      comment: data?.comment || "",
      pros: data?.pros,
      cons: data?.cons,
      is_verified_purchase: true,
      helpful_votes: 0,
      unhelpful_votes: 0,
      images: [],
      created_at: new Date().toISOString(),
    };
    if (!MOCK_REVIEWS[1]) MOCK_REVIEWS[1] = [];
    MOCK_REVIEWS[1].unshift(newRev);
    return newRev;
  }

  if (normUrl.includes("/reviews/") && normUrl.endsWith("/vote")) {
    return { success: true, message: "Ovozingiz qabul qilindi" };
  }

  // 14. Notifications
  if (normUrl.endsWith("/notifications/unread-count")) {
    return { unread_count: 2, urgent_count: 1 };
  }

  if (normUrl.endsWith("/notifications")) {
    return {
      count: MOCK_NOTIFICATIONS.length,
      results: MOCK_NOTIFICATIONS,
    };
  }

  if (normUrl.endsWith("/notifications/read-all")) {
    MOCK_NOTIFICATIONS.forEach((n) => (n.is_read = true));
    return { success: true };
  }

  // 15. Admin & Dashboard APIs
  if (normUrl.endsWith("/dashboard/analytics/overview")) {
    return {
      total_revenue: 482450000,
      revenue_growth_percent: 18.4,
      total_orders: 1284,
      orders_growth_percent: 12.6,
      average_order_value: 3750000,
      aov_growth_percent: 5.2,
      conversion_rate: 3.42,
      conversion_growth_percent: 0.8,
    };
  }

  if (normUrl.endsWith("/dashboard/analytics/sales-chart")) {
    return [
      { date: "26 Okt", revenue: 14200000, orders: 12 },
      { date: "27 Okt", revenue: 18900000, orders: 15 },
      { date: "28 Okt", revenue: 22400000, orders: 19 },
      { date: "29 Okt", revenue: 19800000, orders: 14 },
      { date: "30 Okt", revenue: 27500000, orders: 22 },
      { date: "31 Okt", revenue: 31200000, orders: 26 },
      { date: "01 Noy", revenue: 38400000, orders: 31 },
    ];
  }

  if (normUrl.endsWith("/dashboard/analytics/top-products")) {
    return [
      { id: 1, name: 'MacBook Pro 16" M3 Max', sold_quantity: 48, revenue: 1579200000 },
      { id: 2, name: "iPhone 16 Pro Max 256GB", sold_quantity: 64, revenue: 1100800000 },
      { id: 3, name: "Sony WH-1000XM5", sold_quantity: 72, revenue: 302400000 },
      { id: 4, name: "Samsung Galaxy S24 Ultra", sold_quantity: 38, revenue: 581400000 },
      { id: 5, name: "Apple Watch Ultra 2", sold_quantity: 26, revenue: 270400000 },
    ];
  }

  if (normUrl.endsWith("/dashboard/analytics/top-customers")) {
    return [
      { id: 1, name: "Jamshid Rahmonov", email: "jamshid@example.com", total_orders: 8, total_spent: 84500000 },
      { id: 2, name: "Sardor Azimov", email: "sardor@example.com", total_orders: 6, total_spent: 62100000 },
      { id: 3, name: "Nilufar Qosimova", email: "nilufar@example.com", total_orders: 5, total_spent: 49800000 },
      { id: 4, name: "Bekzod Umarov", email: "bekzod@example.com", total_orders: 4, total_spent: 41200000 },
    ];
  }

  if (normUrl.endsWith("/dashboard/inventory")) {
    return [
      {
        id: 1,
        product_name: 'MacBook Pro 16" M3 Max',
        sku: "MBP-16-SG-16",
        stock_quantity: 12,
        low_stock_threshold: 5,
        is_low_stock: false,
        price: "32900000",
      },
      {
        id: 2,
        product_name: 'MacBook Pro 16" M3 Max',
        sku: "MBP-16-SL-16",
        stock_quantity: 3,
        low_stock_threshold: 5,
        is_low_stock: true,
        price: "32900000",
      },
      {
        id: 3,
        product_name: "iPhone 16 Pro Max 256GB",
        sku: "IP16PM-256-DESERT",
        stock_quantity: 25,
        low_stock_threshold: 10,
        is_low_stock: false,
        price: "17200000",
      },
      {
        id: 6,
        product_name: "Dyson Airwrap Complete",
        sku: "DYSON-AIR-NC",
        stock_quantity: 2,
        low_stock_threshold: 5,
        is_low_stock: true,
        price: "7600000",
      },
    ];
  }

  if (normUrl.includes("/dashboard/inventory/") && normUrl.endsWith("/adjust")) {
    return {
      success: true,
      message: "Ombor zaxirasi muvaffaqiyatli o'zgartirildi",
      new_stock: 15,
    };
  }

  if (normUrl.endsWith("/dashboard/orders")) {
    return {
      count: getMockOrders().length,
      results: getMockOrders(),
    };
  }

  if (normUrl.endsWith("/dashboard/customers")) {
    return [
      { id: 1, full_name: "Alisher Navoiy", email: "user@example.com", phone: "+998901234567", orders_count: 3, total_spent: 78500000, is_active: true },
      { id: 2, full_name: "Jasur Mirzayev", email: "jasur@example.com", phone: "+998939876543", orders_count: 5, total_spent: 42000000, is_active: true },
      { id: 3, full_name: "Botir Qodirov", email: "botir@example.com", phone: "+998971112233", orders_count: 1, total_spent: 12500000, is_active: false },
    ];
  }

  if (normUrl.endsWith("/dashboard/alerts")) {
    return [
      { id: 1, type: "LOW_STOCK", title: "Dyson Airwrap qoldig'i kam qoldi (2 dona)", severity: "WARNING", is_resolved: false },
      { id: 2, type: "PAYMENT_GATEWAY", title: "Click to'lov shlyuzida kechikish kuzatildi", severity: "INFO", is_resolved: true },
    ];
  }

  if (normUrl.includes("/dashboard/alerts/") && normUrl.endsWith("/resolve")) {
    return { success: true };
  }

  // Generic fallback: empty list or success
  return { results: [], success: true };
}
