import Constants from "expo-constants";

export const GEMINI_API_KEY: string =
  (Constants.expoConfig?.extra?.geminiApiKey as string | undefined) ?? "";

export interface Product {
  id: number;
  title: string;
  price: number;
  unit: string;
  cat: "vege" | "fruit" | "leafy" | "fish" | "meat" | "dairy" | "spice" | "ready";
  farmer: string;
  farmerId: number;
  desc: string;
  img: string;
  badge?: string;
  bestSeller?: boolean;
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
  // ───────────────── সবজি ─────────────────
  {
    id: 1,
    title: "কচি বেগুন",
    price: 60, unit: "কেজি", cat: "vege",
    farmer: "শামীম আহমেদ", farmerId: 4,
    desc: "কোমল কালো বেগুন, সদ্য তোলা। ভর্তা ও তরকারিতে অতুলনীয় স্বাদ।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download.jpg?v=1778788778",
    badge: "টাটকা", bestSeller: true,
  },
  {
    id: 2,
    title: "তিতা করলা",
    price: 70, unit: "কেজি", cat: "vege",
    farmer: "শামীম আহমেদ", farmerId: 4,
    desc: "স্বাস্থ্যকর তিতা করলা, ডায়াবেটিস ও রক্তচাপ নিয়ন্ত্রণে বিশেষ উপকারী।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_1.jpg?v=1778788778",
    badge: "স্বাস্থ্যকর",
  },
  {
    id: 3,
    title: "মিষ্টি কুমড়া",
    price: 40, unit: "কেজি", cat: "vege",
    farmer: "করিম মিয়া", farmerId: 1,
    desc: "হলুদ মিষ্টি কুমড়া, ভিটামিন এ সমৃদ্ধ। শিশুদের জন্য বিশেষ উপকারী।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_17.jpg?v=1778788778",
    badge: "ভিটামিন এ",
  },
  {
    id: 4,
    title: "দেশি লাউ",
    price: 50, unit: "পিস", cat: "vege",
    farmer: "আব্দুর রহিম", farmerId: 12,
    desc: "সবুজ কচি লাউ, হালকা ও পুষ্টিকর। তরকারি ও লাউ-ডাল করার জন্য আদর্শ।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_2.jpg?v=1778788779",
    badge: "কচি",
  },
  {
    id: 5,
    title: "মিক্স সবজি প্যাক",
    price: 120, unit: "কেজি", cat: "vege",
    farmer: "ফারুক হোসেন", farmerId: 14,
    desc: "মিশ্র সবজির প্যাক — আলু, গাজর, পটল, মটর। রান্নায় সরাসরি ব্যবহারযোগ্য।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_9.jpg?v=1778788777",
    badge: "মিক্স",
  },
  {
    id: 6,
    title: "কাটা পেঁয়াজ প্যাক",
    price: 80, unit: "৫০০ গ্রাম", cat: "vege",
    farmer: "করিম মিয়া", farmerId: 1,
    desc: "পরিষ্কার করে কাটা পেঁয়াজ। সরাসরি ভাজায় ব্যবহার করুন — সময় বাঁচান।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_21.jpg?v=1778788778",
    badge: "রেডি",
  },
  // ───────────────── শাক ─────────────────
  {
    id: 7,
    title: "পুঁই শাক",
    price: 30, unit: "আঁটি", cat: "leafy",
    farmer: "আব্দুর রহিম", farmerId: 12,
    desc: "মসৃণ পুঁই শাক, ক্যালসিয়াম সমৃদ্ধ। চিংড়ি দিয়ে রান্না করলে অপূর্ব স্বাদ।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_6.jpg?v=1778788778",
    badge: "ক্যালসিয়াম", bestSeller: true,
  },
  {
    id: 8,
    title: "লাল শাক",
    price: 20, unit: "আঁটি", cat: "leafy",
    farmer: "সামসুল হক", farmerId: 13,
    desc: "উজ্জ্বল লাল শাক, ভিটামিন ও মিনারেলে ভরপুর। ভর্তা ও ভাজায় সুস্বাদু।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_5.jpg?v=1778788778",
    badge: "পুষ্টিকর",
  },
  {
    id: 9,
    title: "মুলা শাক",
    price: 25, unit: "আঁটি", cat: "leafy",
    farmer: "সামসুল হক", farmerId: 13,
    desc: "কচি মুলার পাতা, ডিটক্সে সহায়ক। ভাজা ও ডালে মিশিয়ে খাওয়া যায়।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_7.jpg?v=1778788779",
    badge: "ডিটক্স",
  },
  // ───────────────── মাছ ─────────────────
  {
    id: 10,
    title: "পদ্মার ইলিশ",
    price: 1600, unit: "কেজি", cat: "fish",
    farmer: "মৎস্য আড়ত", farmerId: 10,
    desc: "বিশ্বখ্যাত পদ্মার ইলিশ, তেলে ভরা ও সুস্বাদু। ভাপে বা ভাজায় অতুলনীয়।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_8.jpg?v=1778788778",
    badge: "পদ্মার", bestSeller: true,
  },
  {
    id: 11,
    title: "দেশি শিং মাছ",
    price: 700, unit: "কেজি", cat: "fish",
    farmer: "আলমগীর হোসেন", farmerId: 11,
    desc: "জীবন্ত দেশি শিং মাছ, কাদায় লালিত। অসুস্থদের জন্য বিশেষ পুষ্টিকর।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_19.jpg?v=1778788778",
    badge: "জীবন্ত",
  },
  {
    id: 12,
    title: "কালো মাগুর মাছ",
    price: 600, unit: "কেজি", cat: "fish",
    farmer: "আলমগীর হোসেন", farmerId: 11,
    desc: "দেশি কালো মাগুর, শক্তিবর্ধক ও রোগ নিরাময়ে উপকারী। প্রোটিনে ভরপুর।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_20.jpg?v=1778788779",
    badge: "দেশি",
  },
  // ───────────────── ফল ─────────────────
  {
    id: 13,
    title: "রসালো কমলা",
    price: 220, unit: "কেজি", cat: "fruit",
    farmer: "মিনারা বেগম", farmerId: 8,
    desc: "তাজা দেশি কমলা, ভিটামিন সি সমৃদ্ধ। রোগ প্রতিরোধে অত্যন্ত কার্যকর।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_18.jpg?v=1778788778",
    badge: "রসালো", bestSeller: true,
  },
  {
    id: 14,
    title: "দেশি লিচু",
    price: 400, unit: "১০০ পিস", cat: "fruit",
    farmer: "মিনারা বেগম", farmerId: 8,
    desc: "সুমিষ্ট লিচু, রাজশাহী থেকে সংগ্রহ। অ্যান্টিঅক্সিডেন্টে ভরপুর।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_4.jpg?v=1778788779",
    badge: "দেশি",
  },
  {
    id: 15,
    title: "সবুজ পেয়ারা",
    price: 80, unit: "কেজি", cat: "fruit",
    farmer: "কামাল হোসেন", farmerId: 9,
    desc: "ভিটামিন সি সমৃদ্ধ দেশি পেয়ারা। ডায়াবেটিস নিয়ন্ত্রণে সহায়ক।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_10.jpg?v=1778790017",
    badge: "ভিটামিন সি",
  },
  // ───────────────── মাংস ─────────────────
  {
    id: 16,
    title: "গরুর মাংস",
    price: 750, unit: "কেজি", cat: "meat",
    farmer: "হালাল মাংস", farmerId: 16,
    desc: "তাজা হালাল গরুর মাংস, রান্নার জন্য প্রস্তুত। গ্রাম থেকে সরাসরি সংগৃহীত।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_12.jpg?v=1778789927",
    badge: "হালাল", bestSeller: true,
  },
  {
    id: 17,
    title: "খাসির মাংস",
    price: 1050, unit: "কেজি", cat: "meat",
    farmer: "হালাল মাংস", farmerId: 16,
    desc: "দেশি খাসির মাংস, কুরবানির মৌসুমে বিশেষ চাহিদা। নরম ও সুস্বাদু।",
    img: "https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&w=600",
    badge: "দেশি",
  },
  {
    id: 18,
    title: "দেশি মুরগি",
    price: 550, unit: "কেজি", cat: "meat",
    farmer: "পোলট্রি খামার", farmerId: 17,
    desc: "বাড়িতে লালিত দেশি মুরগি। ঝোল রান্নায় অতুলনীয় স্বাদ ও পুষ্টি।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_11.jpg?v=1778789927",
    badge: "দেশি",
  },
  {
    id: 19,
    title: "ফার্মের মুরগি",
    price: 190, unit: "কেজি", cat: "meat",
    farmer: "পোলট্রি খামার", farmerId: 17,
    desc: "সাশ্রয়ী ও পুষ্টিকর ফার্মের মুরগি। প্রতিদিনের রান্নার জন্য আদর্শ।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_16.jpg?v=1778791062",
    badge: "সাশ্রয়ী",
  },
  // ───────────────── ডিম / দুগ্ধ ─────────────────
  {
    id: 20,
    title: "ফার্মের ডিম",
    price: 145, unit: "ডজন", cat: "dairy",
    farmer: "পোলট্রি খামার", farmerId: 17,
    desc: "তাজা ফার্মের ডিম, প্রতিদিন সংগৃহীত। প্রোটিনের সেরা উৎস।",
    img: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&w=600",
    badge: "তাজা", bestSeller: true,
  },
  {
    id: 21,
    title: "দেশি ডিম",
    price: 210, unit: "ডজন", cat: "dairy",
    farmer: "গ্রামীণ খামার", farmerId: 18,
    desc: "দেশি মুরগির ডিম, গভীর কুসুম ও অধিক পুষ্টিগুণ সম্পন্ন।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/1545578418923.jpg?v=1778790838",
    badge: "দেশি",
  },
  {
    id: 22,
    title: "গরুর দুধ",
    price: 90, unit: "লিটার", cat: "dairy",
    farmer: "গ্রামীণ গোচারণ", farmerId: 19,
    desc: "বিশুদ্ধ গরুর কাঁচা দুধ, প্রতিদিন সকালে সংগৃহীত। ক্যালসিয়ামে ভরপুর।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_13.jpg?v=1778789927",
    badge: "খাঁটি",
  },
  {
    id: 23,
    title: "মিষ্টি দই",
    price: 260, unit: "কেজি", cat: "dairy",
    farmer: "বগুড়া দুগ্ধ", farmerId: 20,
    desc: "বগুড়ার বিখ্যাত মিষ্টি দই। ঐতিহ্যবাহী মাটির পাত্রে তৈরি, অপূর্ব স্বাদ।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_24.jpg?v=1778789927",
    badge: "বগুড়ার",
  },
  {
    id: 24,
    title: "দেশি ঘি",
    price: 1600, unit: "কেজি", cat: "dairy",
    farmer: "গ্রামীণ গোচারণ", farmerId: 19,
    desc: "খাঁটি গরুর দুধের ঘি, হাতে তৈরি। রান্না ও স্বাস্থ্যের জন্য অমূল্য।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_14.jpg?v=1778789927",
    badge: "খাঁটি",
  },
  {
    id: 26,
    title: "হাঁসের ডিম",
    price: 210, unit: "ডজন", cat: "dairy",
    farmer: "গ্রামীণ খামার", farmerId: 18,
    desc: "তাজা হাঁসের ডিম, বড় কুসুম ও অধিক পুষ্টিকর। হালুয়া ও কেকে অসাধারণ।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_2.webp?v=1778803922",
    badge: "হাঁসের",
  },
  // ───────────────── মশলা ─────────────────
  {
    id: 25,
    title: "দেশি আদা",
    price: 210, unit: "কেজি", cat: "spice",
    farmer: "ছালাম মিয়া", farmerId: 3,
    desc: "সুগন্ধি দেশি আদা, ঔষধিগুণে ভরা। চা, রান্না ও ঠান্ডা-সর্দিতে অত্যন্ত উপকারী।",
    img: "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_3.jpg?v=1778788779",
    badge: "ঔষধি", bestSeller: true,
  },
];

export const BEST_SELLERS: { cat: Product["cat"]; label: string; emoji: string }[] = [
  { cat: "vege",  label: "সবজি",      emoji: "🥦" },
  { cat: "leafy", label: "শাক",       emoji: "🌿" },
  { cat: "fish",  label: "মাছ",       emoji: "🐟" },
  { cat: "fruit", label: "ফল",        emoji: "🍊" },
  { cat: "meat",  label: "মাংস",      emoji: "🥩" },
  { cat: "dairy", label: "ডিম/দুগ্ধ", emoji: "🥚" },
  { cat: "spice", label: "মশলা",      emoji: "🫚" },
];

export const INITIAL_FARMERS = [
  {
    id: 1,  name: "করিম মিয়া",      phone: "01700000001", address: "রাজশাহী",
    password: "1234", verified: true, avatar: "", sales: 1250,
    products: "সবজি, পেঁয়াজ, কুমড়া", rating: 4.9, gender: "male" as const,
  },
  {
    id: 2,  name: "রহিমা বেগম",      phone: "01700000002", address: "ঢাকা",
    password: "1234", verified: true, avatar: "", sales: 980,
    products: "টমেটো, বাঁধাকপি, ক্যাপসিকাম", rating: 4.8, gender: "female" as const,
  },
  {
    id: 3,  name: "ছালাম মিয়া",      phone: "01700000003", address: "নরসিংদী",
    password: "1234", verified: true, avatar: "", sales: 450,
    products: "আদা, রসুন, মশলা", rating: 4.7, gender: "male" as const,
  },
  {
    id: 4,  name: "শামীম আহমেদ",     phone: "01700000004", address: "গাজীপুর",
    password: "1234", verified: true, avatar: "", sales: 620,
    products: "বেগুন, করলা, শাকসবজি", rating: 4.6, gender: "male" as const,
  },
  {
    id: 8,  name: "মিনারা বেগম",     phone: "01700000005", address: "চাঁপাইনবাবগঞ্জ",
    password: "1234", verified: true, avatar: "", sales: 890,
    products: "কমলা, লিচু, মৌসুমী ফল", rating: 4.9, gender: "female" as const,
  },
  {
    id: 10, name: "মৎস্য আড়ত",      phone: "01700000006", address: "পদ্মা তীর",
    password: "1234", verified: true, avatar: "", sales: 3200,
    products: "ইলিশ, নদীর মাছ", rating: 4.8, gender: "male" as const,
  },
  {
    id: 11, name: "আলমগীর হোসেন",    phone: "01700000007", address: "ময়মনসিংহ",
    password: "1234", verified: false, avatar: "", sales: 210,
    products: "শিং, মাগুর, দেশি মাছ", rating: 4.5, gender: "male" as const,
  },
  {
    id: 12, name: "আব্দুর রহিম",     phone: "01700000008", address: "সিলেট",
    password: "1234", verified: true, avatar: "", sales: 380,
    products: "লাউ, পালং, পুঁই শাক", rating: 4.7, gender: "male" as const,
  },
  {
    id: 16, name: "হালাল মাংস",      phone: "01700000009", address: "ঢাকা",
    password: "1234", verified: true, avatar: "", sales: 1100,
    products: "গরু, খাসি, হালাল মাংস", rating: 4.8, gender: "male" as const,
  },
  {
    id: 17, name: "পোলট্রি খামার",   phone: "01700000010", address: "নারায়ণগঞ্জ",
    password: "1234", verified: true, avatar: "", sales: 2400,
    products: "মুরগি, ফার্মের ডিম", rating: 4.6, gender: "male" as const,
  },
  {
    id: 18, name: "নূর বেগম",        phone: "01700000011", address: "মানিকগঞ্জ",
    password: "1234", verified: false, avatar: "", sales: 160,
    products: "দেশি ডিম, হাঁসের ডিম", rating: 4.4, gender: "female" as const,
  },
  {
    id: 19, name: "গ্রামীণ গোচারণ",  phone: "01700000012", address: "পাবনা",
    password: "1234", verified: true, avatar: "", sales: 750,
    products: "গরুর দুধ, ঘি, মাখন", rating: 4.9, gender: "male" as const,
  },
  {
    id: 20, name: "বগুড়া দুগ্ধ",    phone: "01700000013", address: "বগুড়া",
    password: "1234", verified: true, avatar: "", sales: 920,
    products: "মিষ্টি দই, ছানা, রসগোল্লা", rating: 5.0, gender: "male" as const,
  },
];

// YouTube Shorts IDs for the খেত থেকে লাইভ section
export const VIDEO_IDS = [
  "iRHqWnxj-jU",
  "oLgAz7tiS-Y",
  "4iph-cQWg3g",
  "ivdux5l52TY",
  "n6TW95vbqxo",
  "lXgJgxP9frU",
];

// "Why use this app?" section videos
export const WHY_APP_VIDEO_IDS = [
  "s-CMeMovJyY",
  "ybCj8e-L9_w",
];

export const CATEGORIES = [
  { key: "all",   label: "সব",        emoji: "🛒" },
  { key: "vege",  label: "সবজি",      emoji: "🥦" },
  { key: "leafy", label: "শাক",       emoji: "🌿" },
  { key: "fish",  label: "মাছ",       emoji: "🐟" },
  { key: "fruit", label: "ফল",        emoji: "🍊" },
  { key: "meat",  label: "মাংস",      emoji: "🥩" },
  { key: "dairy", label: "ডিম/দুগ্ধ", emoji: "🥚" },
  { key: "spice", label: "মশলা",      emoji: "🫚" },
];

export const SUPPORT_PHONE = "8801931355398";
