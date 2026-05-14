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
  productName: string;
  qty: number;
  unit: string;
  total: number;
  farmerName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryCharge: number;
  grandTotal: number;
  date: string;
  farmerId?: number;
}

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, title: "আলু", price: 35, unit: "কেজি", cat: "vege", farmer: "করিম মিয়া", farmerId: 1, desc: "মিষ্টি আলু, খেত থেকে সদ্য তোলা", img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/wounds_and_cracks-potatoes-411975_1920.jpg?v=1773958204", badge: "টাটকা" },
  { id: 2, title: "টমেটো", price: 45, unit: "কেজি", cat: "vege", farmer: "রহিমা বেগম", farmerId: 2, desc: "রসালো, টাটকা, জৈব", img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/elementus-tomato-371906_1920.jpg?v=1773958166", badge: "জৈব" },
  { id: 3, title: "পেঁয়াজ", price: 55, unit: "কেজি", cat: "vege", farmer: "ফরহাদ আলী", farmerId: 1, desc: "মিষ্টি পেঁয়াজ", img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/hans-red-vegetable-onions-499066_1920.jpg?v=1773958168", badge: "টাটকা" },
  { id: 4, title: "রসুন", price: 80, unit: "কেজি", cat: "vege", farmer: "ছালাম মিয়া", farmerId: 3, desc: "খাঁটি রসুন", img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/publicdomainpictures-garlic-84691_1920.jpg?v=1773958167", badge: "টাটকা" },
  { id: 5, title: "ফুলকপি", price: 45, unit: "পিস", cat: "vege", farmer: "সাজ্জাদ হোসেন", farmerId: 4, desc: "সাদা, তাজা ফুলকপি", img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/matthiasboeckel-cauliflower-6993499_1920.jpg?v=1773958169", badge: "টাটকা" },
  { id: 6, title: "বাঁধাকপি", price: 35, unit: "পিস", cat: "vege", farmer: "রহিমা বেগম", farmerId: 2, desc: "তাজা, খাস্তা বাঁধাকপি", img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/pexels-cabbage-1850722_1920.jpg?v=1773958204", badge: "টাটকা" },
  { id: 7, title: "বেগুন", price: 40, unit: "কেজি", cat: "vege", farmer: "শামীম আহমেদ", farmerId: 5, desc: "কচি বেগুন, সদ্য তোলা", img: "https://images.pexels.com/photos/2325844/pexels-photo-2325844.jpeg?auto=compress&w=400", badge: "কচি" },
  { id: 8, title: "করলা", price: 50, unit: "কেজি", cat: "vege", farmer: "শামীম আহমেদ", farmerId: 5, desc: "টাটকা করলা, তেতো স্বাদ", img: "https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg?auto=compress&w=400", badge: "টাটকা" },
  { id: 9, title: "আম", price: 120, unit: "কেজি", cat: "fruit", farmer: "সিরাজ মিয়া", farmerId: 6, desc: "হিমসাগর আম, মিষ্টি", img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/swidaalba-mango-8283262_1920.jpg?v=1773958170", badge: "মিষ্টি" },
  { id: 10, title: "কলা", price: 80, unit: "ডজন", cat: "fruit", farmer: "মোস্তাফিজ", farmerId: 7, desc: "চম্পা কলা, পাকা", img: "https://cdn.shopify.com/s/files/1/0761/6600/4933/files/couleur-bananas-3474872_1920.jpg?v=1773958166", badge: "পাকা" },
  { id: 11, title: "কমলা", price: 150, unit: "কেজি", cat: "fruit", farmer: "মিনারা বেগম", farmerId: 8, desc: "টাটকা কমলা, রসালো", img: "https://images.pexels.com/photos/894713/orange-fruit-citrus-organic-894713.jpeg?auto=compress&w=400", badge: "রসালো" },
  { id: 12, title: "লিচু", price: 200, unit: "কেজি", cat: "fruit", farmer: "মিনারা বেগম", farmerId: 8, desc: "দেশি লিচু, মিষ্টি", img: "https://images.pexels.com/photos/156598/lychee-fruit-sweet-tropical-156598.jpeg?auto=compress&w=400", badge: "দেশি" },
  { id: 13, title: "পেয়ারা", price: 80, unit: "কেজি", cat: "fruit", farmer: "কামাল হোসেন", farmerId: 9, desc: "সবুজ পেয়ারা, ভিটামিন সি সমৃদ্ধ", img: "https://images.pexels.com/photos/5945755/pexels-photo-5945755.jpeg?auto=compress&w=400", badge: "ভিটামিন সি" },
  { id: 14, title: "ইলিশ", price: 800, unit: "কেজি", cat: "fish", farmer: "মৎস্য আড়ত", farmerId: 10, desc: "পদ্মার ইলিশ, তাজা", img: "https://images.pexels.com/photos/3296434/pexels-photo-3296434.jpeg?auto=compress&w=400", badge: "পদ্মার" },
  { id: 15, title: "শিং মাছ", price: 350, unit: "কেজি", cat: "fish", farmer: "আলমগীর হোসেন", farmerId: 11, desc: "দেশি শিং মাছ, জীবন্ত", img: "https://images.pexels.com/photos/6026712/pexels-photo-6026712.jpeg?auto=compress&w=400", badge: "জীবন্ত" },
  { id: 16, title: "মাগুর মাছ", price: 400, unit: "কেজি", cat: "fish", farmer: "আলমগীর হোসেন", farmerId: 11, desc: "কালো মাগুর, দেশি", img: "https://images.pexels.com/photos/3296434/pexels-photo-3296434.jpeg?auto=compress&w=400", badge: "দেশি" },
  { id: 17, title: "পালং শাক", price: 20, unit: "আটি", cat: "leafy", farmer: "আব্দুর রহিম", farmerId: 12, desc: "নরম পালং শাক, আয়রন সমৃদ্ধ", img: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&w=400", badge: "আয়রন" },
  { id: 18, title: "লাল শাক", price: 25, unit: "আটি", cat: "leafy", farmer: "সামসুল হক", farmerId: 13, desc: "লাল শাক, পুষ্টিকর", img: "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&w=400", badge: "পুষ্টিকর" },
  { id: 19, title: "মিক্স সবজি প্যাক", price: 150, unit: "প্যাক", cat: "ready", farmer: "ফারুক হোসেন", farmerId: 14, desc: "কাটা আলু, গাজর, পটল – রান্নার জন্য প্রস্তুত", img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400", badge: "রেডি টু কুক" },
  { id: 20, title: "ধোয়া পালং শাক", price: 50, unit: "প্যাক", cat: "ready", farmer: "হামিদুল ইসলাম", farmerId: 15, desc: "৩ বার ধোয়া, কাটা – সরাসরি রান্না করুন", img: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&w=400", badge: "ধোয়া" },
  { id: 21, title: "মিক্স ফল প্যাক", price: 250, unit: "প্যাক", cat: "ready", farmer: "ফল বাগান", farmerId: 8, desc: "আম, কলা, কমলা, লিচু – মিশ্রিত প্যাক", img: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&w=400", badge: "মিক্স" },
];

export const INITIAL_FARMERS: Farmer[] = [
  { id: 1, name: "করিম মিয়া", phone: "01700000001", address: "চট্টগ্রাম", password: "1234", verified: true, avatar: "https://randomuser.me/api/portraits/men/1.jpg", sales: 1250, products: "আলু, টমেটো, পেঁয়াজ", rating: 4.9, gender: "male" },
  { id: 2, name: "রহিমা বেগম", phone: "01700000002", address: "ঢাকা", password: "1234", verified: true, avatar: "https://randomuser.me/api/portraits/women/2.jpg", sales: 980, products: "গাজর, বেগুন, ফুলকপি", rating: 4.8, gender: "female" },
  { id: 3, name: "শামীম আহমেদ", phone: "01700000003", address: "নরসিংদী", password: "1234", verified: true, avatar: "https://randomuser.me/api/portraits/men/3.jpg", sales: 450, products: "বেগুন, করলা", rating: 4.7, gender: "male" },
];

export const VIDEO_IDS = [
  "5RE2Gx6643U", "NRveNHaYbVU", "Qd1SfGJxPk8",
  "8WOd3SfGXt0", "d-lmVLO9I-M", "Lp4F9gNm1zk",
  "HIHkgZezJus", "116Yti89CKI", "fJ9rUzIMcZQ", "3JZ_D3ELwOQ"
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
