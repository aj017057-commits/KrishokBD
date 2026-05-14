export interface Product {
  id: number;
  title: string;
  price: number;
  unit: string;
  cat: "vege" | "fruit" | "leafy" | "fish" | "ready";
  farmer: string;
  farmerId: number;
  desc: string;
  img: string;
  badge?: string;
}

export interface Farmer {
  id: number;
  name: string;
  phone: string;
  address: string;
  password: string;
  verified: boolean;
  avatar: string;
  sales: number;
  products: string;
  rating: number;
  gender: "male" | "female";
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  password: string;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  unit: string;
  farmer: string;
  qty: number;
  img: string;
}

export interface Order {
  id: string;
  items: { title: string; qty: number; unit: string; price: number }[];
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  deliveryArea: "dhaka" | "outside";
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerId: string;
  farmerId?: number;
  farmerName?: string;
  date: string;
  status: "pending" | "confirmed" | "delivered";
}

export const INITIAL_PRODUCTS: Product[] = [
  // Vegetables
  {
    id: 1, title: "তাজা আলু", price: 35, unit: "কেজি", cat: "vege",
    farmer: "করিম মিয়া", farmerId: 1,
    desc: "মিষ্টি দেশি আলু, খেত থেকে সদ্য তোলা। রান্না ও ভাজায় আদর্শ।",
    img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/wounds_and_cracks-potatoes-411975_1920.jpg?v=1773958204",
    badge: "টাটকা"
  },
  {
    id: 2, title: "জৈব টমেটো", price: 45, unit: "কেজি", cat: "vege",
    farmer: "রহিমা বেগম", farmerId: 2,
    desc: "রসালো টমেটো, কোনো কীটনাশক ছাড়া চাষ করা। সালাদ ও রান্নায় সেরা।",
    img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/elementus-tomato-371906_1920.jpg?v=1773958166",
    badge: "জৈব"
  },
  {
    id: 3, title: "দেশি পেঁয়াজ", price: 55, unit: "কেজি", cat: "vege",
    farmer: "ফরহাদ আলী", farmerId: 1,
    desc: "মিষ্টি ঝাঁঝালো পেঁয়াজ, দীর্ঘস্থায়ী। সব রান্নার জন্য অপরিহার্য।",
    img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/hans-red-vegetable-onions-499066_1920.jpg?v=1773958168",
    badge: "টাটকা"
  },
  {
    id: 4, title: "খাঁটি রসুন", price: 80, unit: "কেজি", cat: "vege",
    farmer: "ছালাম মিয়া", farmerId: 3,
    desc: "সুগন্ধি দেশি রসুন, প্রাকৃতিক চাষ। রান্নার স্বাদ বাড়ায়।",
    img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/publicdomainpictures-garlic-84691_1920.jpg?v=1773958167",
    badge: "খাঁটি"
  },
  {
    id: 5, title: "সাদা ফুলকপি", price: 45, unit: "পিস", cat: "vege",
    farmer: "শামীম আহমেদ", farmerId: 4,
    desc: "বড় সাদা ফুলকপি, কচি ও মিষ্টি। তরকারি ও ভাজায় সুস্বাদু।",
    img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/matthiasboeckel-cauliflower-6993499_1920.jpg?v=1773958169",
    badge: "টাটকা"
  },
  {
    id: 6, title: "তাজা বাঁধাকপি", price: 35, unit: "পিস", cat: "vege",
    farmer: "রহিমা বেগম", farmerId: 2,
    desc: "খাস্তা সবুজ বাঁধাকপি, পুষ্টিগুণ সমৃদ্ধ। সালাদ ও রান্নায় দারুণ।",
    img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/pexels-cabbage-1850722_1920.jpg?v=1773958204",
    badge: "টাটকা"
  },
  {
    id: 7, title: "কচি বেগুন", price: 40, unit: "কেজি", cat: "vege",
    farmer: "শামীম আহমেদ", farmerId: 5,
    desc: "কোমল কালো বেগুন, সদ্য তোলা। ভর্তা ও তরকারিতে সেরা স্বাদ।",
    img: "https://images.pexels.com/photos/2325844/pexels-photo-2325844.jpeg?auto=compress&w=400",
    badge: "কচি"
  },
  {
    id: 8, title: "তিতা করলা", price: 50, unit: "কেজি", cat: "vege",
    farmer: "শামীম আহমেদ", farmerId: 5,
    desc: "স্বাস্থ্যকর তিতা করলা, ডায়াবেটিস ও রক্তচাপে উপকারী।",
    img: "https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg?auto=compress&w=400",
    badge: "স্বাস্থ্যকর"
  },
  {
    id: 9, title: "মিষ্টি কুমড়া", price: 30, unit: "কেজি", cat: "vege",
    farmer: "করিম মিয়া", farmerId: 1,
    desc: "হলুদ মিষ্টি কুমড়া, ভিটামিন এ সমৃদ্ধ। শিশুদের জন্য বিশেষ উপকারী।",
    img: "https://images.pexels.com/photos/5945557/pexels-photo-5945557.jpeg?auto=compress&w=400",
    badge: "ভিটামিন এ"
  },
  {
    id: 10, title: "দেশি লাউ", price: 45, unit: "পিস", cat: "vege",
    farmer: "আব্দুর রহিম", farmerId: 12,
    desc: "সবুজ কচি লাউ, হালকা ও পুষ্টিকর। তরকারি ও লাউ-ডাল করার জন্য আদর্শ।",
    img: "https://images.pexels.com/photos/6158088/pexels-photo-6158088.jpeg?auto=compress&w=400",
    badge: "কচি"
  },
  {
    id: 11, title: "ক্যাপসিকাম", price: 90, unit: "কেজি", cat: "vege",
    farmer: "রহিমা বেগম", farmerId: 2,
    desc: "রঙিন মিষ্টি ক্যাপসিকাম, ভিটামিন সি ভরপুর। সালাদ ও স্টারফ্রাইতে সেরা।",
    img: "https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg?auto=compress&w=400",
    badge: "ভিটামিন সি"
  },
  {
    id: 12, title: "আদা", price: 120, unit: "কেজি", cat: "vege",
    farmer: "ছালাম মিয়া", farmerId: 3,
    desc: "সুগন্ধি দেশি আদা, ঔষধিগুণে ভরা। চা, রান্না ও ঠান্ডায় অত্যন্ত উপকারী।",
    img: "https://images.pexels.com/photos/161556/ginger-root-plant-161556.jpeg?auto=compress&w=400",
    badge: "ঔষধি"
  },
  // Fruits
  {
    id: 13, title: "হিমসাগর আম", price: 120, unit: "কেজি", cat: "fruit",
    farmer: "সিরাজ মিয়া", farmerId: 6,
    desc: "সুমিষ্ট হিমসাগর আম, চাঁপাইনবাবগঞ্জ থেকে সংগ্রহ করা।",
    img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/swidaalba-mango-8283262_1920.jpg?v=1773958170",
    badge: "মিষ্টি"
  },
  {
    id: 14, title: "চম্পা কলা", price: 80, unit: "ডজন", cat: "fruit",
    farmer: "মোস্তাফিজ", farmerId: 7,
    desc: "পাকা চম্পা কলা, শক্তির দারুণ উৎস। শিশু ও বড় সবার জন্য উপকারী।",
    img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/couleur-bananas-3474872_1920.jpg?v=1773958166",
    badge: "পাকা"
  },
  {
    id: 15, title: "রসালো কমলা", price: 150, unit: "কেজি", cat: "fruit",
    farmer: "মিনারা বেগম", farmerId: 8,
    desc: "তাজা দেশি কমলা, ভিটামিন সি সমৃদ্ধ। রোগ প্রতিরোধে অত্যন্ত কার্যকর।",
    img: "https://images.pexels.com/photos/894713/orange-fruit-citrus-organic-894713.jpeg?auto=compress&w=400",
    badge: "রসালো"
  },
  {
    id: 16, title: "দেশি লিচু", price: 200, unit: "কেজি", cat: "fruit",
    farmer: "মিনারা বেগম", farmerId: 8,
    desc: "সুমিষ্ট লিচু, রাজশাহী থেকে সংগ্রহ। অ্যান্টিঅক্সিডেন্টে ভরপুর।",
    img: "https://images.pexels.com/photos/156598/lychee-fruit-sweet-tropical-156598.jpeg?auto=compress&w=400",
    badge: "দেশি"
  },
  {
    id: 17, title: "সবুজ পেয়ারা", price: 80, unit: "কেজি", cat: "fruit",
    farmer: "কামাল হোসেন", farmerId: 9,
    desc: "ভিটামিন সি সমৃদ্ধ দেশি পেয়ারা। ডায়াবেটিস নিয়ন্ত্রণে সহায়ক।",
    img: "https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&w=400",
    badge: "ভিটামিন সি"
  },
  // Leafy
  {
    id: 18, title: "পালং শাক", price: 20, unit: "আটি", cat: "leafy",
    farmer: "আব্দুর রহিম", farmerId: 12,
    desc: "নরম পালং শাক, আয়রন ও ফলেট সমৃদ্ধ। রক্তাল্পতা দূর করে।",
    img: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&w=400",
    badge: "আয়রন"
  },
  {
    id: 19, title: "লাল শাক", price: 25, unit: "আটি", cat: "leafy",
    farmer: "সামসুল হক", farmerId: 13,
    desc: "উজ্জ্বল লাল শাক, ভিটামিন ও মিনারেলে ভরপুর। ভর্তা ও ভাজায় সুস্বাদু।",
    img: "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&w=400",
    badge: "পুষ্টিকর"
  },
  {
    id: 20, title: "পুঁই শাক", price: 20, unit: "আটি", cat: "leafy",
    farmer: "আব্দুর রহিম", farmerId: 12,
    desc: "মসৃণ পুঁই শাক, ক্যালসিয়াম সমৃদ্ধ। চিংড়ি দিয়ে রান্না করলে অপূর্ব স্বাদ।",
    img: "https://images.pexels.com/photos/5529597/pexels-photo-5529597.jpeg?auto=compress&w=400",
    badge: "ক্যালসিয়াম"
  },
  {
    id: 21, title: "মুলা শাক", price: 15, unit: "আটি", cat: "leafy",
    farmer: "সামসুল হক", farmerId: 13,
    desc: "কচি মুলার পাতা, ডিটক্সে সহায়ক। ভাজা ও ডালে মিশিয়ে খাওয়া যায়।",
    img: "https://images.pexels.com/photos/4871125/pexels-photo-4871125.jpeg?auto=compress&w=400",
    badge: "ডিটক্স"
  },
  // Fish
  {
    id: 22, title: "পদ্মার ইলিশ", price: 800, unit: "কেজি", cat: "fish",
    farmer: "মৎস্য আড়ত", farmerId: 10,
    desc: "বিশ্বখ্যাত পদ্মার ইলিশ, তেলে ভরা ও সুস্বাদু। ভাপে বা ভাজায় অতুলনীয়।",
    img: "https://images.pexels.com/photos/3296434/pexels-photo-3296434.jpeg?auto=compress&w=400",
    badge: "পদ্মার"
  },
  {
    id: 23, title: "দেশি শিং মাছ", price: 350, unit: "কেজি", cat: "fish",
    farmer: "আলমগীর হোসেন", farmerId: 11,
    desc: "জীবন্ত দেশি শিং মাছ, কাদায় লালিত। অসুস্থদের জন্য বিশেষ পুষ্টিকর।",
    img: "https://images.pexels.com/photos/6026712/pexels-photo-6026712.jpeg?auto=compress&w=400",
    badge: "জীবন্ত"
  },
  {
    id: 24, title: "কালো মাগুর মাছ", price: 400, unit: "কেজি", cat: "fish",
    farmer: "আলমগীর হোসেন", farmerId: 11,
    desc: "দেশি কালো মাগুর, শক্তিবর্ধক ও রোগ নিরাময়ে উপকারী।",
    img: "https://images.pexels.com/photos/1382394/pexels-photo-1382394.jpeg?auto=compress&w=400",
    badge: "দেশি"
  },
  // Ready to cook
  {
    id: 25, title: "মিক্স সবজি প্যাক", price: 150, unit: "প্যাক", cat: "ready",
    farmer: "ফারুক হোসেন", farmerId: 14,
    desc: "কাটা আলু, গাজর, পটল, মটর — রান্নার জন্য সম্পূর্ণ প্রস্তুত।",
    img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400",
    badge: "রেডি"
  },
  {
    id: 26, title: "ধোয়া পালং প্যাক", price: 50, unit: "প্যাক", cat: "ready",
    farmer: "হামিদুল ইসলাম", farmerId: 15,
    desc: "৩ বার পরিষ্কার করে কাটা পালং শাক — সরাসরি রান্নায় দিন।",
    img: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&w=400",
    badge: "ধোয়া"
  },
  {
    id: 27, title: "মিক্স ফ্রুট প্যাক", price: 250, unit: "প্যাক", cat: "ready",
    farmer: "ফল বাগান", farmerId: 8,
    desc: "আম, কলা, কমলা, লিচু মিশিয়ে তৈরি স্বাস্থ্যকর ফলের প্যাক।",
    img: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&w=400",
    badge: "মিক্স"
  },
  {
    id: 28, title: "কাটা পেঁয়াজ প্যাক", price: 60, unit: "প্যাক", cat: "ready",
    farmer: "করিম মিয়া", farmerId: 1,
    desc: "পরিষ্কার করে কাটা পেঁয়াজ, সরাসরি ভাজায় ব্যবহার করুন।",
    img: "https://images.pexels.com/photos/175753/pexels-photo-175753.jpeg?auto=compress&w=400",
    badge: "রেডি"
  },
];

export const INITIAL_FARMERS: Farmer[] = [
  {
    id: 1, name: "করিম মিয়া", phone: "01700000001", address: "রাজশাহী", password: "1234",
    verified: true, avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    sales: 1250, products: "আলু, পেঁয়াজ, মিষ্টি কুমড়া", rating: 4.9, gender: "male"
  },
  {
    id: 2, name: "রহিমা বেগম", phone: "01700000002", address: "ঢাকা", password: "1234",
    verified: true, avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    sales: 980, products: "টমেটো, বাঁধাকপি, ক্যাপসিকাম", rating: 4.8, gender: "female"
  },
  {
    id: 3, name: "শামীম আহমেদ", phone: "01700000003", address: "নরসিংদী", password: "1234",
    verified: true, avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    sales: 450, products: "বেগুন, করলা, রসুন", rating: 4.7, gender: "male"
  },
];

export const VIDEO_IDS = [
  "5RE2Gx6643U", "NRveNHaYbVU", "Qd1SfGJxPk8",
  "8WOd3SfGXt0", "d-lmVLO9I-M", "Lp4F9gNm1zk",
  "HIHkgZezJus", "116Yti89CKI", "fJ9rUzIMcZQ", "3JZ_D3ELwOQ",
];

export const CATEGORIES = [
  { key: "all", label: "সব পণ্য" },
  { key: "vege", label: "সবজি" },
  { key: "fruit", label: "ফল" },
  { key: "leafy", label: "শাক" },
  { key: "fish", label: "মাছ" },
  { key: "ready", label: "রেডি টু কুক" },
];

export const GEMINI_API_KEY = "AIzaSyAq4mNr4-mdV7roUCSlqlRJbHxzT8IAFXM";
export const SUPPORT_PHONE = "8801931355398";
