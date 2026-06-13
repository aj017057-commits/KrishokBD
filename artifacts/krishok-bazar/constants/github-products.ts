import type { Product } from "./data";

const V = [
  "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&q=75",
  "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&q=75",
  "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=75",
  "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&q=75",
];
const FR = [
  "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=600&q=75",
  "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=75",
  "https://images.unsplash.com/photo-1519996521430-02b798c1d881?w=600&q=75",
  "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&q=75",
];
const RI = [
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=75",
  "https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=600&q=75",
  "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=75",
  "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&q=75",
];
const FI = [
  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=75",
  "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=75",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=75",
  "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=75",
];
const ME = [
  "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&q=75",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=75",
  "https://images.unsplash.com/photo-1532407191490-e4066c1500d4?w=600&q=75",
  "https://images.unsplash.com/photo-1529692236671-f1f6e9481b28?w=600&q=75",
];
const EG = [
  "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&q=75",
  "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600&q=75",
  "https://images.unsplash.com/photo-1582722872445-44c5b7c3c8f7?w=600&q=75",
  "https://images.unsplash.com/photo-1598965402049-7551d528ff24?w=600&q=75",
];
const HO = [
  "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=75",
  "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&q=75",
  "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=75",
  "https://images.unsplash.com/photo-1587049352851-8d4e89134292?w=600&q=75",
];
const SP = [
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=75",
  "https://images.unsplash.com/photo-1532336414038-cf1907de1fd0?w=600&q=75",
  "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&q=75",
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=75",
];
const OR = [
  "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=75",
  "https://images.unsplash.com/photo-1628773822503-930a840000a9?w=600&q=75",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=75",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=75",
];
const LE = [
  "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=600&q=75",
  "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=75",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=75",
  "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=75",
];
const RC = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=75",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=75",
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=75",
  "https://images.unsplash.com/photo-1576021182211-9ea8dced3690?w=600&q=75",
];

function g(imgs: string[], i: number): string[] {
  return [imgs[i%4], imgs[(i+1)%4], imgs[(i+2)%4], imgs[(i+3)%4], imgs[i%4]];
}

const VF = ["করিম মিয়া","রহিমা বেগম","ছালাম মিয়া","শামীম আহমেদ"];
const VFI = [1,2,3,4];
const FFN = ["মিনারা বেগম","কামাল হোসেন"];
const FFI = [8,9];
const FIN = ["মৎস্য আড়ত","আলমগীর হোসেন"];
const FII = [10,11];
const MFN = ["হালাল মাংস","পোলট্রি খামার"];
const MFI = [16,17];
const EFN = ["পোলট্রি খামার","নূর বেগম"];
const EFI = [17,18];
const LFN = ["আব্দুর রহিম","সামসুল হক"];
const LFI = [12,13];
const RFN = ["ফারুক হোসেন","পোলট্রি খামার"];
const RFI = [14,17];

export const GITHUB_PRODUCTS: Product[] = [
  // ── সবজি (200–214) ──
  { id:200, title:"বালু মাটির গোল লাল আলু", price:42, unit:"কেজি", cat:"vege", farmer:VF[0], farmerId:VFI[0], desc:"বগুড়ার বিখ্যাত সুস্বাদু বালু মাটির গোল লাল আলু। তরকারিতে স্বাদ বৃদ্ধি করে।", img:V[0], gallery:g(V,0), badge:"বগুড়ার" },
  { id:201, title:"যশোরের তাজা তাল বেগুন", price:68, unit:"কেজি", cat:"vege", farmer:VF[1], farmerId:VFI[1], desc:"যশোরের বিখ্যাত নরম ও বীজহীন চমৎকার বেগুন, পোড়ানোর জন্য অত্যন্ত পুষ্টিকর ও সেরা।", img:V[1], gallery:g(V,1), badge:"নরম" },
  { id:202, title:"ফরিদপুরের পেঁয়াজ", price:85, unit:"কেজি", cat:"vege", farmer:VF[2], farmerId:VFI[2], desc:"দেশি ঝাঁঝালো নতুন ফরিদপুরের লাল পেঁয়াজ। রান্নার মূল সুস্বাদু মসলাদার উপাদান।", img:V[2], gallery:g(V,2), badge:"দেশি" },
  { id:203, title:"দেশী বড় কোয়ার শুষ্ক রসুন", price:140, unit:"কেজি", cat:"vege", farmer:VF[3], farmerId:VFI[3], desc:"অর্গানিক উপায়ে বুনো জমিতে উৎপাদিত বড় কোয়ার দেশী কড়া ঝাঁঝ রসুনের সেরা কোয়ালিটি।", img:V[3], gallery:g(V,3), badge:"অর্গানিক" },
  { id:204, title:"কুষ্টিয়ার কচি আঁশহীন আদা", price:175, unit:"কেজি", cat:"vege", farmer:VF[0], farmerId:VFI[0], desc:"ঝাঁঝালো চমৎকার দেশি সোনালী আদা, সরাসরি ক্ষেত থেকে সংগৃহীত।", img:V[0], gallery:g(V,0), badge:"কচি" },
  { id:205, title:"তিস্তা চরের সবুজ কচি পটল", price:48, unit:"কেজি", cat:"vege", farmer:VF[1], farmerId:VFI[1], desc:"নরম কচি ও পাতলা খোসাযুক্ত তরতাজা সবুজ কচি পটল, প্রতিদিনের সুস্বাদু ভাজিতে অসাধারণ।", img:V[1], gallery:g(V,1), badge:"তরতাজা" },
  { id:206, title:"কুমিল্লার বড় তেতো করলা", price:62, unit:"কেজি", cat:"vege", farmer:VF[2], farmerId:VFI[2], desc:"তিক্ত স্বাদের কিন্তু অত্যন্ত পুষ্টিকর ও ঔষধি গুণসম্পন্ন তরতাজা করলা।", img:V[2], gallery:g(V,2), badge:"ঔষধি" },
  { id:207, title:"নরম কচি লম্বা লাউ", price:55, unit:"পিস", cat:"vege", farmer:VF[3], farmerId:VFI[3], desc:"কচি ডগাসমেত কচি মিষ্টি লাউ, সম্পূর্ণ কেমিক্যাল মুক্ত সুস্বাদু পানি লাউ।", img:V[3], gallery:g(V,3), badge:"কেমিক্যালমুক্ত" },
  { id:208, title:"হলুদ মিষ্টি কুমড়া আস্ত", price:45, unit:"কেজি", cat:"vege", farmer:VF[0], farmerId:VFI[0], desc:"পাকা কড়া মিষ্টি কুমড়া আস্ত, চমৎকার স্বাদ ও তরকারির রাজকীয় পুষ্টি বাড়াবে।", img:V[0], gallery:g(V,0), badge:"মিষ্টি" },
  { id:209, title:"মেহেরপুরের কচি নরম ঢেঁড়শ", price:50, unit:"কেজি", cat:"vege", farmer:VF[1], farmerId:VFI[1], desc:"কচি নরম সবুজ ভেন্ডি বা ঢেঁড়শ, সকালের পুষ্টিকর ভাজিতে এক অমলিন স্বাদ।", img:V[1], gallery:g(V,1), badge:"নরম" },
  { id:210, title:"সাদা বড় তাজা ফুলকপি", price:45, unit:"পিস", cat:"vege", farmer:VF[2], farmerId:VFI[2], desc:"তাজা ও পরিষ্কার পোকা মুক্ত গোল কড়া সাদা পাতাযুক্ত ফুলকপি।", img:V[2], gallery:g(V,2), badge:"পোকামুক্ত" },
  { id:211, title:"নরসিংদীর কচি কাঁচকলা হালি", price:35, unit:"জোড়া", cat:"vege", farmer:VF[3], farmerId:VFI[3], desc:"খাদ্যমান ও আয়রন সমৃদ্ধ কচি কাঁচকলা যা রান্নায় সুস্বাদু ও চমৎকার উপকারী।", img:V[3], gallery:g(V,3), badge:"আয়রন" },
  { id:212, title:"ক্ষেতের তাজা লাল টমেটো", price:90, unit:"কেজি", cat:"vege", farmer:VF[0], farmerId:VFI[0], desc:"লাল কচি টসটসে তাজা টমেটো, সালাদ ও তরকারির স্বাদ দ্বিগুণ করে দেবে।", img:V[0], gallery:g(V,0), badge:"টসটসে" },
  { id:213, title:"দেশি মিষ্ট কচি গাজর", price:80, unit:"কেজি", cat:"vege", farmer:VF[1], farmerId:VFI[1], desc:"মিষ্টি ও মচমচে তাজা গাজর, পুষ্টি ও সালাদে অত্যন্ত চমৎকার উপাদেয়।", img:V[1], gallery:g(V,1), badge:"মচমচে" },
  { id:214, title:"সবুজ তাজা ক্যাপসিকাম", price:210, unit:"কেজি", cat:"vege", farmer:VF[2], farmerId:VFI[2], desc:"চাইনিজ ও সালাদ রান্নায় দেওয়ার জন্য প্রিমিয়াম সবুজ ক্যাপসিকাম।", img:V[2], gallery:g(V,2), badge:"প্রিমিয়াম" },

  // ── ফল (215–229) ──
  { id:215, title:"রাজশাহী গোপালভোগ আম", price:110, unit:"কেজি", cat:"fruit", farmer:FFN[0], farmerId:FFI[0], desc:"রাজশাহীর বিখ্যাত বাঘার সুমিষ্ট আশহীন ও সুস্বাদু গোপালভোগ আম। সরাসরি বাগান থেকে প্যাকড।", img:FR[0], gallery:g(FR,0), badge:"আশহীন", bestSeller:true },
  { id:216, title:"দিনাজপুরের রসালো লিচু", price:380, unit:"১০০ পিস", cat:"fruit", farmer:FFN[1], farmerId:FFI[1], desc:"দিনাজপুরের ঐতিহ্যবাহী বেদানা ও বোম্বাই লাল টসটসে মিষ্টি ও কচি লিচু।", img:FR[1], gallery:g(FR,1), badge:"রসালো" },
  { id:217, title:"রাঙ্গামাটির মিষ্টি আনারস", price:45, unit:"পিস", cat:"fruit", farmer:FFN[0], farmerId:FFI[0], desc:"পাহাড়ি রৌদ্রোজ্জ্বল টিলা থেকে সংগৃহীত কড়া সুমিষ্ট ও অত্যন্ত রসালো আনারস।", img:FR[2], gallery:g(FR,2), badge:"পাহাড়ি" },
  { id:218, title:"নরসিংদীর সুমিষ্ট সাগর কলা", price:36, unit:"ডজন", cat:"fruit", farmer:FFN[1], farmerId:FFI[1], desc:"সম্পূর্ণ কেমিক্যাল ও কার্বাইড মুক্ত প্রাকৃতিকভাবে পাকানো পুষ্টিকর কড়া মিষ্টি কলা।", img:FR[3], gallery:g(FR,3), badge:"কার্বাইডমুক্ত" },
  { id:219, title:"সিলেটের বড় কাগজি লেবু", price:24, unit:"জোড়া", cat:"fruit", farmer:FFN[0], farmerId:FFI[0], desc:"তীব্র মনকাড়া সুঘ্রাণযুক্ত ও রসে টইটম্বুর কচি কাগজি লেবুর খাঁটি আস্ত জোড়া।", img:FR[0], gallery:g(FR,0), badge:"সুগন্ধি" },
  { id:220, title:"বাগেরহাটের কচি মিষ্ট ডাব", price:75, unit:"পিস", cat:"fruit", farmer:FFN[1], farmerId:FFI[1], desc:"প্রাকৃতিক স্যালাইন সমৃদ্ধ জাদুকরী পুষ্টির মিষ্টি জলের বড় আকৃতির কচি ডাব।", img:FR[1], gallery:g(FR,1), badge:"স্যালাইন" },
  { id:221, title:"বরিশালের তাজা পেয়ারা", price:65, unit:"কেজি", cat:"fruit", farmer:FFN[0], farmerId:FFI[0], desc:"বরিশালের বিখ্যাত মিষ্টি ও মচমচে ছাঁকা পুষ্টিকর কড়া তাজা সবুজ পেয়ারা।", img:FR[2], gallery:g(FR,2), badge:"মচমচে" },
  { id:222, title:"দিনাজপুরের সুমিষ্ট বড় কাঁঠাল", price:240, unit:"পিস", cat:"fruit", farmer:FFN[1], farmerId:FFI[1], desc:"প্রকৃতির ঐতিহ্যবাহী কড়া মিষ্টি রসে ভরা মাঝারি আকৃতির কড়া লালচে কাঁঠাল।", img:FR[3], gallery:g(FR,3), badge:"মিষ্টি" },
  { id:223, title:"রংপুরের লাল হাড়িভাঙ্গা আম", price:130, unit:"কেজি", cat:"fruit", farmer:FFN[0], farmerId:FFI[0], desc:"আঁশহীন সুমিষ্ট বিখ্যাত হাড়িভাঙ্গা আম, যা মুখে দিলেই মিলিয়ে যায়।", img:FR[0], gallery:g(FR,0), badge:"হাড়িভাঙ্গা" },
  { id:224, title:"শ্রীমঙ্গলের সুমিষ্ট ড্রাগন ফল", price:280, unit:"কেজি", cat:"fruit", farmer:FFN[1], farmerId:FFI[1], desc:"অ্যান্টিঅক্সিডেন্ট ও পুষ্টিতে ভরপুর কড়া লাল টসটসে কচি ড্রাগন ফল।", img:FR[1], gallery:g(FR,1), badge:"অ্যান্টিঅক্সিডেন্ট" },
  { id:225, title:"সুমিষ্ট লাল বেদানা প্রিমিয়াম", price:320, unit:"কেজি", cat:"fruit", farmer:FFN[0], farmerId:FFI[0], desc:"অত্যন্ত রসালো ও রক্ত লাল দানাদার পুষ্টিকর ও মিষ্টি বেদানা বা ডালিম।", img:FR[2], gallery:g(FR,2), badge:"প্রিমিয়াম" },
  { id:226, title:"কক্সবাজারের সুমিষ্ট পেঁপে", price:70, unit:"কেজি", cat:"fruit", farmer:FFN[1], farmerId:FFI[1], desc:"গাছে পাকা সুমিষ্ট কড়া লালচে মিষ্টি পেঁপে, হজমের জন্য সর্বোত্তম উপাদেয়।", img:FR[3], gallery:g(FR,3), badge:"হজমকারী" },
  { id:227, title:"সুমিষ্ট কচি বাঙ্গি আস্ত", price:60, unit:"পিস", cat:"fruit", farmer:FFN[0], farmerId:FFI[0], desc:"গ্রীষ্মের গরমে শরীর জুড়ানো আঁশযুক্ত ও সুমিষ্ট তাজা বাঙ্গি ফল আস্ত।", img:FR[0], gallery:g(FR,0), badge:"সতেজ" },
  { id:228, title:"পাহাড়ি কচি সবুজ মাল্টা", price:160, unit:"কেজি", cat:"fruit", farmer:FFN[1], farmerId:FFI[1], desc:"পার্বত্য অঞ্চলের তীব্র মিষ্টি ও সতেজ কচি রসালো সবুজ মাল্টা।", img:FR[1], gallery:g(FR,1), badge:"পাহাড়ি" },
  { id:229, title:"নওগাঁর সুমিষ্ট আম্রপালি আম", price:120, unit:"কেজি", cat:"fruit", farmer:FFN[0], farmerId:FFI[0], desc:"নওগাঁর বিখ্যাত কড়া মিষ্টি ও সুবাস ছড়ানো প্রিমিয়াম আম্রপালি আম।", img:FR[2], gallery:g(FR,2), badge:"আম্রপালি" },

  // ── চাল (230–244) ──
  { id:230, title:"তাজা কুঁড়ো মুক্ত মিনিকেট চাল", price:74, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"ক্ষেত থেকে তোলা নতুন ধানের সরু মিনিকেট চাল যা রান্নার পর অত্যন্ত লম্বা ও সুস্বাদু দেখায়।", img:RI[0], gallery:g(RI,0), badge:"তাজা" },
  { id:231, title:"নাজিরশাইল প্রিমিয়াম চিকন চাল", price:80, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"চিকন ঝরঝরে প্রিমিয়াম নাজিরশাইল চাল, সম্পূর্ণ পাথর কণা ও ভুসি মুক্ত।", img:RI[1], gallery:g(RI,1), badge:"প্রিমিয়াম" },
  { id:232, title:"চিনিগুঁড়া সুগন্ধি পোলাও চাল", price:145, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"পুরাতন আমনের সুবাস ছড়ানো কড়া সুগন্ধি কালোজিরা ও চিনিগুঁড়া উৎসবের চাল।", img:RI[2], gallery:g(RI,2), badge:"সুগন্ধি", bestSeller:true },
  { id:233, title:"দিনাজপুরের কাটারিভোগ আতপ চাল", price:115, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"দিনাজপুরের খাঁটি চিকন কাটারিভোগ আতপ চাল, বিরিয়ানি ও পায়েসের রাজা।", img:RI[3], gallery:g(RI,3), badge:"কাটারিভোগ" },
  { id:234, title:"ঢেঁকি ছাঁটা অর্গানিক লাল চাল", price:98, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"আঁশযুক্ত ফাইবার ও প্রোটিন সমৃদ্ধ ডায়াবেটিক বান্ধব লাল ঢেঁকি ছাঁটা চাল।", img:RI[0], gallery:g(RI,0), badge:"ডায়াবেটিকবান্ধব" },
  { id:235, title:"বাসমতী সুগন্ধি লাহোরি চাল", price:195, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"বিলাসবহুল বিরিয়ানি রান্নার কড়া লম্বা সুবাসিত চিকন বাসমতী চাল।", img:RI[1], gallery:g(RI,1), badge:"বিরিয়ানির জন্য" },
  { id:236, title:"অর্গানিক বুনো কালা ভাত চাল", price:320, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"অ্যান্টিঅক্সিডেন্ট ও লৌহসমৃদ্ধ অত্যন্ত দুর্লভ ও পুষ্টিকর কুচকুচে কাল চাল।", img:RI[2], gallery:g(RI,2), badge:"দুর্লভ" },
  { id:237, title:"দেশি আমন বালাম চাল", price:70, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"অর্গানিক উপায়ে প্রস্তুত বালাম চাল যা অত্যন্ত সহজপাচ্য ও প্রোটিন সমৃদ্ধ।", img:RI[3], gallery:g(RI,3), badge:"সহজপাচ্য" },
  { id:238, title:"পাইজাম সেদ্ধ ঐতিহ্যবাহী চাল", price:65, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"বাঙালি মধ্যবিত্ত পরিবারের নিয়মিত খাওয়ার পুষ্টিকর সেদ্ধ পাইজাম চাল।", img:RI[0], gallery:g(RI,0), badge:"পাইজাম" },
  { id:239, title:"বিআর-২৮ পুষ্টি সমৃদ্ধ সেদ্ধ চাল", price:66, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"নরম ও দ্রুত সুসিদ্ধ হওয়া বিআর-২৮ তাজা মাঝারি চিকন চাল।", img:RI[1], gallery:g(RI,1), badge:"বিআর-২৮" },
  { id:240, title:"বিআর-২৯ ঝরঝরে কড়া চাল", price:64, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"অত্যন্ত সুলভ ও রান্নার পর দারুণ ঝরঝরে থাকা পুষ্টিকর বিআর-২৯ চাল।", img:RI[2], gallery:g(RI,2), badge:"ঝরঝরে" },
  { id:241, title:"পারিজাত হাইব্রিড চাল ১ম গ্রেড", price:62, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"পুষ্টিগুণে ভরপুর কড়া পরিষ্কার করা সাদা চিকন ফাইবার সমৃদ্ধ চাল।", img:RI[3], gallery:g(RI,3), badge:"হাইব্রিড" },
  { id:242, title:"সুগন্ধি তুলসীমালা ঐতিহ্যবাহী চাল", price:150, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"শেরপুরের বিখ্যাত সুগন্ধি তুলসীমালা চাল, যার ছোট দানা রান্নায় মিষ্টি সুঘ্রাণ দেয়।", img:RI[0], gallery:g(RI,0), badge:"তুলসীমালা" },
  { id:243, title:"জিরাশাইল চিকন বালাম চাল", price:78, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"কড়া চড়া রোদে শুকানো চিকন দানাদার পুষ্টিকর ও সুস্বাদু জিরাশাইল চাল।", img:RI[1], gallery:g(RI,1), badge:"জিরাশাইল" },
  { id:244, title:"অর্গানিক ওটস ও ভাঙা চাল কুড়ি", price:110, unit:"কেজি", cat:"rice", farmer:"ধান গবেষণা কেন্দ্র", farmerId:21, desc:"সকালের সুষম পুষ্টি ডায়েটের জন্য উপযুক্ত ভাঙা লাল চালের মণ্ড।", img:RI[2], gallery:g(RI,2), badge:"ডায়েট" },

  // ── মাছ (245–259) ──
  { id:245, title:"চাঁদপুরের পদ্মার রূপালী ইলিশ", price:1480, unit:"কেজি", cat:"fish", farmer:FIN[0], farmerId:FII[0], desc:"বাঙালিদের প্রিয় চাঁদপুরের খাঁটি পদ্মার রূপালী ইলিশ মাছ, অপরূপ স্বাদ ও তেলসমৃদ্ধ।", img:FI[0], gallery:g(FI,0), badge:"পদ্মার", bestSeller:true },
  { id:246, title:"দিঘির তাজা জ্যান্ত বড় রুই", price:390, unit:"কেজি", cat:"fish", farmer:FIN[1], farmerId:FII[1], desc:"নিজেদের বড় দিঘি থেকে জ্যান্ত ধরা রুই মাছ। আঁশ ছাড়ানো কড়া ফ্রেশ।", img:FI[1], gallery:g(FI,1), badge:"জ্যান্ত" },
  { id:247, title:"হাওরের বিলের চকচকে বড় কাতলা", price:420, unit:"কেজি", cat:"fish", farmer:FIN[0], farmerId:FII[0], desc:"বিলের প্রাকৃতিক শ্যাওলা খেয়ে বড় হওয়া ও অত্যন্ত সুস্বাদু কচি কাতলা মাছ।", img:FI[2], gallery:g(FI,2), badge:"হাওরের" },
  { id:248, title:"খুলনার মিষ্টি জলের বাগদা চিংড়ি", price:880, unit:"কেজি", cat:"fish", farmer:FIN[1], farmerId:FII[1], desc:"খুলনার লোনা জলের ঘের থেকে সংগৃহীত বড় মাথাওয়ালা চকচকে বাগদা চিংড়ি।", img:FI[3], gallery:g(FI,3), badge:"বাগদা" },
  { id:249, title:"নদীর বড় পুরুষ গলদা চিংড়ি", price:1150, unit:"কেজি", cat:"fish", farmer:FIN[0], farmerId:FII[0], desc:"বড় আকারের নীল দাড়া যুক্ত সুস্বাদু পুরুষ গলদা চিংড়ি। অত্যন্ত রসালো মাংস।", img:FI[0], gallery:g(FI,0), badge:"গলদা" },
  { id:250, title:"হাওরের কালো কুচকুচে শিং মাছ", price:660, unit:"কেজি", cat:"fish", farmer:FIN[1], farmerId:FII[1], desc:"সম্পূর্ণ প্রাকৃতিক জলাশয়ের পুষ্টিকর ও লৌহ সমৃদ্ধ বিলের শিং মাছ।", img:FI[1], gallery:g(FI,1), badge:"লৌহ সমৃদ্ধ" },
  { id:251, title:"দেশী জ্যান্ত মাগুর মাছ লোকাল", price:720, unit:"কেজি", cat:"fish", farmer:FIN[0], farmerId:FII[0], desc:"শারীরিক দুর্বলতা কাটাতে সেরা নদী ও জলাশয়ের হৃষ্টপুষ্ট দেশী মাগুর মাছ।", img:FI[2], gallery:g(FI,2), badge:"দেশী" },
  { id:252, title:"নদী থেকে সদ্য ধৃত পাবদা মাছ", price:490, unit:"কেজি", cat:"fish", farmer:FIN[1], farmerId:FII[1], desc:"পরিষ্কার নদীর জলের অত্যন্ত নরম মাছ যা ধনেপাতা ভাঁজিতে অসাধারণ লাগে।", img:FI[3], gallery:g(FI,3), badge:"নরম" },
  { id:253, title:"মেঘনা নদীর তাজা বড় আইড় মাছ", price:980, unit:"কেজি", cat:"fish", farmer:FIN[0], farmerId:FII[0], desc:"আইড় মাছ নদীর গভীর জলের খাঁটি স্বাদ চর্বিসমৃদ্ধ ও সম্পূর্ণ আশহীন।", img:FI[0], gallery:g(FI,0), badge:"আশহীন" },
  { id:254, title:"চলনবিলের বড় তাজা বোয়াল মাছ", price:830, unit:"কেজি", cat:"fish", farmer:FIN[1], farmerId:FII[1], desc:"বিল থেকে আস্ত ধৃত চর্বিযুক্ত কড়া তাজা বোয়াল মাছের কারি কাট পিস।", img:FI[1], gallery:g(FI,1), badge:"বিলের" },
  { id:255, title:"মিষ্টি জলের পুকুরের তেলাপিয়া", price:215, unit:"কেজি", cat:"fish", farmer:FIN[0], farmerId:FII[0], desc:"সবচেয়ে সুলভ অথচ পুষ্টিকর তাজা ভেষজ ফিড খাওয়ানো সুস্বাদু তেলাপিয়া।", img:FI[2], gallery:g(FI,2), badge:"সুলভ" },
  { id:256, title:"হাওরের কচি টেংরা মাছ কারি", price:560, unit:"কেজি", cat:"fish", farmer:FIN[1], farmerId:FII[1], desc:"ছোট দেশী টেংরা মাছ, পেঁয়াজ ও টমেটো দিয়ে চচ্চড়ি রান্নার রাজকীয় সুবাস।", img:FI[3], gallery:g(FI,3), badge:"ছোট দেশী" },
  { id:257, title:"সমুদ্রের তাজা রূপালী রূপচাঁদা মাছ", price:1250, unit:"কেজি", cat:"fish", farmer:FIN[0], farmerId:FII[0], desc:"কক্সবাজার সমুদ্র থেকে ধৃত ফ্রেশ হিমায়িত রূপচাঁদা ফ্রাই করার জন্য চমৎকার।", img:FI[0], gallery:g(FI,0), badge:"রূপচাঁদা" },
  { id:258, title:"বিলের জ্যান্ত কালো বড় শোল মাছ", price:590, unit:"কেজি", cat:"fish", farmer:FIN[1], farmerId:FII[1], desc:"লাফানো তাজা কালো কুচকুচে বিলের বড় শোল মাছ। কষা ভুনার জন্য সেরা।", img:FI[1], gallery:g(FI,1), badge:"শোল" },
  { id:259, title:"নদীর নরম সুস্বাদু কাচকি মাছ", price:380, unit:"কেজি", cat:"fish", farmer:FIN[0], farmerId:FII[0], desc:"ছোট চকচকে রূপালী কাচকি মাছ আলু পেঁয়াজ মিক্স চচ্চড়ির জন্য অতুলনীয়।", img:FI[2], gallery:g(FI,2), badge:"কাচকি" },

  // ── মাংস (260–274) ──
  { id:260, title:"বাড়ির উঠোনে চরা দেশী মুরগি", price:460, unit:"কেজি", cat:"meat", farmer:MFN[0], farmerId:MFI[0], desc:"ইনজেকশন বা সাদা ফিড ছাড়া বাড়ির উঠানে চড়ে বেড়ানো আসল সুস্বাদু মিষ্টি দেশী মুরগি।", img:ME[0], gallery:g(ME,0), badge:"ইনজেকশনমুক্ত" },
  { id:261, title:"কচি ছাগলের নরম খাসির মাংস", price:1080, unit:"কেজি", cat:"meat", farmer:MFN[1], farmerId:MFI[1], desc:"তরুণ কচি খাসির গন্ধহীন নরম সুস্বাদু ও পুষ্টিকর তাজা খাসির মাংস।", img:ME[1], gallery:g(ME,1), badge:"গন্ধহীন", bestSeller:true },
  { id:262, title:"হাড় চর্বিমুক্ত গরুর সলিড মাংস", price:865, unit:"কেজি", cat:"meat", farmer:MFN[0], farmerId:MFI[0], desc:"অতিরিক্ত হাড় ও পর্দা ছাড়া ১০০% সলিড গরুর তাজা লাল তাজা মাংস।", img:ME[2], gallery:g(ME,2), badge:"সলিড" },
  { id:263, title:"ক্যালসিয়াম সমৃদ্ধ গরুর নেহারী পায়া", price:410, unit:"কেজি", cat:"meat", farmer:MFN[1], farmerId:MFI[1], desc:"সুপ বা নেহারী রান্নার জন্য উপযুক্ত আস্ত পায়ের হাড় ও নরম জয়েন্ট।", img:ME[3], gallery:g(ME,3), badge:"নেহারী" },
  { id:264, title:"ড্রেসড কোয়েল পাখির পুষ্টিকর মাংস", price:85, unit:"পিস", cat:"meat", farmer:MFN[0], farmerId:MFI[0], desc:"অত্যন্ত পুষ্টিকর ও সুস্বাদু বাচ্চাদের প্রিয় কচি কোয়েল পাখির ড্রেসড মাংস।", img:ME[0], gallery:g(ME,0), badge:"কোয়েল" },
  { id:265, title:"শীতকালীন তাজা বিলে চরা পাতিহাঁস", price:560, unit:"পিস", cat:"meat", farmer:MFN[1], farmerId:MFI[1], desc:"শীতকালে বিলে ধান খেয়ে চর্বিসমৃদ্ধ হওয়া বড় আকারের নরম পাতিহাঁস আস্ত।", img:ME[1], gallery:g(ME,1), badge:"হাঁস" },
  { id:266, title:"বড় মাংসল সুস্বাদু চিনা হাঁস আস্ত", price:760, unit:"পিস", cat:"meat", farmer:MFN[0], farmerId:MFI[0], desc:"কালো ও সাদা পালকের বড় ওজনের নরম মিষ্টি মাংসল সুস্বাদু চিনা হাঁস।", img:ME[2], gallery:g(ME,2), badge:"চিনা হাঁস" },
  { id:267, title:"রক্তবর্ধক গরুর লাল তাজা কলিজা", price:820, unit:"কেজি", cat:"meat", farmer:MFN[1], farmerId:MFI[1], desc:"সকালে রুটি ও পরোটার সাথে রান্নার জন্য নরম লোহা সমৃদ্ধ গরুর লাল কলিজা।", img:ME[3], gallery:g(ME,3), badge:"কলিজা" },
  { id:268, title:"রোস্টের জন্য উপযুক্ত সোনালী মুরগি", price:285, unit:"পিস", cat:"meat", farmer:MFN[0], farmerId:MFI[0], desc:"৮০০ গ্রাম ওজনের সোনালী মুরগি, বিয়ে বাড়ীর মনকাড়া রোস্ট তৈরির জন্য সেরা।", img:ME[0], gallery:g(ME,0), badge:"রোস্ট" },
  { id:269, title:"বড় সুস্বাদু চর্বিযুক্ত রাজহাঁস আস্ত", price:1650, unit:"পিস", cat:"meat", farmer:MFN[1], farmerId:MFI[1], desc:"বড় আকারের অত্যন্ত তেলসমৃদ্ধ ঐতিহ্যবাহী রাজকীয় স্বাদের দেশী রাজহাঁস।", img:ME[1], gallery:g(ME,1), badge:"রাজহাঁস" },
  { id:270, title:"চর্বিহীন পাহাড়ি মহিষের লাল মাংস", price:730, unit:"কেজি", cat:"meat", farmer:MFN[0], farmerId:MFI[0], desc:"প্রাকৃতিক ও জৈব উপায়ে বড় হওয়া গাড়ো লাল মহিষের তাজা সুস্বাদু মাংস।", img:ME[2], gallery:g(ME,2), badge:"মহিষ" },
  { id:271, title:"খাসির নরম মাথা ও মগজ সেট", price:360, unit:"পিস", cat:"meat", farmer:MFN[1], farmerId:MFI[1], desc:"রান্নার জন্য জুতসই ফ্রেশ কড়কড়ে খাসির নরম সুস্বাদু আস্ত মগজ ও মাথা।", img:ME[3], gallery:g(ME,3), badge:"খাসির" },
  { id:272, title:"কচি কবুতরের রানিং বাচ্চার জোড়া", price:360, unit:"জোড়া", cat:"meat", farmer:MFN[0], farmerId:MFI[0], desc:"শারীরিক জোর ও বার্ধক্যজনিত ক্লান্তি সারাতে উপযোগী নরম কচি কবুতরের বাচ্চা।", img:ME[0], gallery:g(ME,0), badge:"কবুতর" },
  { id:273, title:"দেশী রাজহাঁসের কচি মাংস", price:950, unit:"কেজি", cat:"meat", farmer:MFN[1], farmerId:MFI[1], desc:"তাজা ও পরিষ্কার করে কাটা রাজহাঁসের চামড়া সহ নরম ও চর্বিযুক্ত কড়া সুস্বাদু মাংস।", img:ME[1], gallery:g(ME,1), badge:"দেশী" },
  { id:274, title:"গরুর মগজ নরম ও পুষ্টিকর", price:420, unit:"পিস", cat:"meat", farmer:MFN[0], farmerId:MFI[0], desc:"তাজা কচি গরুর নরম অত্যন্ত সুস্বাদু মগজ যা মসলা দিয়ে ভাজি করলে অসাধারণ লাগে।", img:ME[2], gallery:g(ME,2), badge:"মগজ" },

  // ── রেডি-টু-কুক (275–289) ──
  { id:275, title:"খোসা ফেলে কাটা গোল সাইজ লাউ প্যাক", price:46, unit:"৫০০ গ্রাম", cat:"ready", farmer:RFN[0], farmerId:RFI[0], desc:"রান্নার জন্য রেডি, খোসা ও বিচি ফেলে গোল সাইজ কুচানো তাজা লাউ প্যাক।", img:RC[0], gallery:g(RC,0), badge:"প্রস্তুত" },
  { id:276, title:"কুচানো আলুর ভাজি চমৎকার সাইজ", price:36, unit:"৫০০ গ্রাম", cat:"ready", farmer:RFN[1], farmerId:RFI[1], desc:"পরিষ্কার পানিতে ধোয়া ও সমান সাইজে কুচানো আলু, সরাসরি মচমচে ভাজির জন্য প্রস্তুত।", img:RC[1], gallery:g(RC,1), badge:"কুচানো" },
  { id:277, title:"দুই মাথা ছাঁটা কচি পটল ফালি প্যাক", price:42, unit:"৫০০ গ্রাম", cat:"ready", farmer:RFN[0], farmerId:RFI[0], desc:"দুই মাথা কাটা ও হালকা খোসা ছাড়ানো তাজা কচি পটলের আস্ত ফালি প্যাক।", img:RC[2], gallery:g(RC,2), badge:"কচি" },
  { id:278, title:"ধোয়া ও কাটা দেশী মুরগির রান্নার সেট", price:265, unit:"৫০০ গ্রাম", cat:"ready", farmer:RFN[1], farmerId:RFI[1], desc:"সম্পূর্ণ ড্রেসড ও কারি সাইজ টুকরো করে ধুয়ে জিপলক প্যাকে ভরা দেশী মুরগি।", img:RC[3], gallery:g(RC,3), badge:"ড্রেসড", bestSeller:true },
  { id:279, title:"আঁশ ছাড়ানো ও কাটা রুই মাছের পিস", price:225, unit:"৫০০ গ্রাম", cat:"ready", farmer:RFN[0], farmerId:RFI[0], desc:"ভালো পিস করা ও লবণ দিয়ে ধুয়ে পরিচ্ছন্ন করা তাজা রুই মাছের কারি মিক্স পিস।", img:RC[0], gallery:g(RC,0), badge:"ফ্রেশ কাট" },
  { id:280, title:"মিক্স চাইনিজ ভেজিটেবল প্যাক", price:58, unit:"৫০০ গ্রাম", cat:"ready", farmer:RFN[1], farmerId:RFI[1], desc:"গাজর, পেঁপে, বরবটি ও কপির কাটা স্লাইস যা চাইনিজ রান্নায় সরাসরি কড়াইয়ে দেয়া যায়।", img:RC[1], gallery:g(RC,1), badge:"চাইনিজ" },
  { id:281, title:"ছুলে পরিষ্কার করে কুচি করা পেঁয়াজ", price:62, unit:"৫০০ গ্রাম", cat:"ready", farmer:RFN[0], farmerId:RFI[0], desc:"ছুলে পরিষ্কার করে কুচি করা পেঁয়াজ যা রান্নার কাজকে অর্ধেক সহজ করে দেয়।", img:RC[2], gallery:g(RC,2), badge:"কুচি" },
  { id:282, title:"হাত বাটায় পেষা রসুনের কড়া পেস্ট", price:92, unit:"২৫০ গ্রাম", cat:"ready", farmer:RFN[1], farmerId:RFI[1], desc:"হাত বাটায় পেষা সুগন্ধি তাজা রসুনের পেস্ট, কোনো কড়া কেমিক্যাল প্রিজারভেটিভ নেই।", img:RC[3], gallery:g(RC,3), badge:"হাত বাটা" },
  { id:283, title:"দেশী কড়া আদা পেস্ট জিপলক প্যাক", price:98, unit:"২৫০ গ্রাম", cat:"ready", farmer:RFN[0], farmerId:RFI[0], desc:"তাজা আদা ও মসলা ব্লেন্ড করা খাঁটি ঘরোয়া আদার কড়া ঝাঁঝালো পেস্ট।", img:RC[0], gallery:g(RC,0), badge:"ঝাঁঝালো" },
  { id:284, title:"পেঁয়াজু মিক্স ডাল বাটা মন্ড", price:62, unit:"৪০০ গ্রাম", cat:"ready", farmer:RFN[1], farmerId:RFI[1], desc:"খেসারী ও মসুর ডাল পেঁয়াজ মরিচ দিয়ে বেটে রাখা ফ্রোজেন মন্ড, তেলে ছাড়লেই মচমচে পেঁয়াজু।", img:RC[1], gallery:g(RC,1), badge:"পেঁয়াজু" },
  { id:285, title:"চিনিগুঁড়া চাল ও মুগ ডাল খিচুড়ি মিক্স", price:78, unit:"৫০০ গ্রাম", cat:"ready", farmer:RFN[0], farmerId:RFI[0], desc:"চিনিগুঁড়া চাল ও ভাজা মুগ ডাল সঠিক অনুপাতে মেশানো রেডি খিচুড়ি প্যাক।", img:RC[2], gallery:g(RC,2), badge:"খিচুড়ি" },
  { id:286, title:"বেগুনী ভাজার পারফেক্ট বেগুন স্লাইস", price:36, unit:"২৫০ গ্রাম", cat:"ready", farmer:RFN[1], farmerId:RFI[1], desc:"পারফেক্ট পাতলা ডিম্বাকৃতির স্লাইসে কাটা বেগুন, বেসন গোলার সাথে মেলাবার জন্য তৈরি।", img:RC[3], gallery:g(RC,3), badge:"বেগুনী" },
  { id:287, title:"রান্নার কচি ফুলকপি টুকরো প্যাক", price:42, unit:"৩৫০ গ্রাম", cat:"ready", farmer:RFN[0], farmerId:RFI[0], desc:"পোকামুক্ত ফ্রেশ মাঝারি সাইজে টুকরো করা কড়া সাদা ফুলকপি প্যাক।", img:RC[0], gallery:g(RC,0), badge:"পোকামুক্ত" },
  { id:288, title:"ভেজিটেবল স্যুপ প্রিমিয়াম মিক্স বক্স", price:72, unit:"৩০০ গ্রাম", cat:"ready", farmer:RFN[1], farmerId:RFI[1], desc:"মাশরুম কড়া কর্ন ও কুচানো কচি পাতা মিক্স যা স্যুপ বানানোর জন্য স্পেশাল।", img:RC[1], gallery:g(RC,1), badge:"স্যুপ" },
  { id:289, title:"সালাদ কারি মিক্সড প্রিমিয়াম বক্স", price:48, unit:"বক্স", cat:"ready", farmer:RFN[0], farmerId:RFI[0], desc:"সব সালাদ ধুয়ে নিখুঁত পাতলা কুচি করে লেবুর টুকরোসহ প্যাকিং করা ইনস্ট্যান্ট সালাদ।", img:RC[2], gallery:g(RC,2), badge:"সালাদ" },

  // ── ডিম/দুগ্ধ (290–304) ──
  { id:290, title:"লাল কুসুমযুক্ত স্পেশাল বাতির ডিম", price:210, unit:"১০ পিস", cat:"dairy", farmer:EFN[0], farmerId:EFI[0], desc:"প্রতিটি ডিমে জোড়া লাল কুসুম সমৃদ্ধ অত্যন্ত বিরল ও চমৎকার কড়া ডিম।", img:EG[0], gallery:g(EG,0), badge:"বিরল" },
  { id:291, title:"পাহাড়ি চারণ কড়া লাল বুনো ডিম", price:165, unit:"ডজন", cat:"dairy", farmer:EFN[1], farmerId:EFI[1], desc:"পাহাড়ের খাঁচার বাইরে ছেড়ে দেওয়া মুরগির অর্গানিক পুষ্টিকর সেরা ডিম।", img:EG[1], gallery:g(EG,1), badge:"পাহাড়ি" },
  { id:292, title:"সোনালী মুরগির কচি লাল ডিম", price:140, unit:"ডজন", cat:"dairy", farmer:EFN[0], farmerId:EFI[0], desc:"তাজা সোনালী জাতের মুরগির কড়া কুসুমযুক্ত মাঝারী আকৃতির ডিম।", img:EG[2], gallery:g(EG,2), badge:"সোনালী" },
  { id:293, title:"দেশী রাজহাঁসের বিশাল সাদা ডিম", price:80, unit:"২ পিস", cat:"dairy", farmer:EFN[1], farmerId:EFI[1], desc:"বিশাল আকারের ক্যালসিয়ামের খনি দেশী রাজহাঁসের ধবধবে সাদা ডিম।", img:EG[3], gallery:g(EG,3), badge:"রাজহাঁস" },
  { id:294, title:"কৃষি খামারের ফার্টিলাইজড ডিম", price:175, unit:"ডজন", cat:"dairy", farmer:EFN[0], farmerId:EFI[0], desc:"রানির জাতের প্রাকৃতিক ব্রিডিং থেকে সংগৃহীত অত্যন্ত পুষ্টিকর ডিম।", img:EG[0], gallery:g(EG,0), badge:"ফার্টিলাইজড" },
  { id:295, title:"অর্গানিক মুরগির ওমেগা ফ্যাট ডিম", price:190, unit:"ডজন", cat:"dairy", farmer:EFN[1], farmerId:EFI[1], desc:"ডায়েট ও বডি বিল্ডিংয়ের জন্য সুপারচার্জড ভিটামিন এ সমৃদ্ধ উন্নত ডিম।", img:EG[1], gallery:g(EG,1), badge:"ওমেগা" },
  { id:296, title:"কচি কোয়েল ডিম ট্রিপল প্যাক", price:120, unit:"৩০ পিস", cat:"dairy", farmer:EFN[0], farmerId:EFI[0], desc:"পরিবারের বাচ্চাদের নাশতার জন্য পুষ্টিকর ও সুস্বাদু কচি কোয়েল ডিম।", img:EG[2], gallery:g(EG,2), badge:"কোয়েল" },
  { id:297, title:"ক্যালসিয়াম সমৃদ্ধ সাদা বড় ডিম", price:130, unit:"ডজন", cat:"dairy", farmer:EFN[1], farmerId:EFI[1], desc:"হাড় মজবুত করার উপাদান বুস্টেড বড় আকারের সাদা সেল ডেকোরেটিভ ডিম।", img:EG[3], gallery:g(EG,3), badge:"ক্যালসিয়াম" },
  { id:298, title:"দেশী অর্গানিক হাঁস-মুরগি মিক্সড ডিম", price:160, unit:"ডজন", cat:"dairy", farmer:EFN[0], farmerId:EFI[0], desc:"অর্ধেক হাঁসের এবং অর্ধেক খাঁটি দেশী মুরগির মিক্সড পুষ্টির প্যাকেজিং।", img:EG[0], gallery:g(EG,0), badge:"মিক্সড" },
  { id:299, title:"সাভারের তাজা দেশী হাঁসের ডিম", price:170, unit:"ডজন", cat:"dairy", farmer:EFN[1], farmerId:EFI[1], desc:"সাভারের বড় বিলের হাঁসের তাজা লাল কুসুমের পুষ্টিকর ও বড় ডিমের সেরা সেট।", img:EG[1], gallery:g(EG,1), badge:"হাঁসের" },
  { id:300, title:"দেশী কচি কবুতরের পুষ্টিকর ডিম", price:110, unit:"জোড়া", cat:"dairy", farmer:EFN[0], farmerId:EFI[0], desc:"বাচ্চাদের হাঁপানি ও শারীরিক বিকাশের জন্য অত্যন্ত প্রয়োজনীয় ওষুধি কবুতর ডিম।", img:EG[2], gallery:g(EG,2), badge:"কবুতর" },
  { id:301, title:"হাঁসের ডিম ও ডিমের সাদা কুসুম", price:155, unit:"ডজন", cat:"dairy", farmer:EFN[1], farmerId:EFI[1], desc:"তাজা চারণযোগ্য হাঁসের ওষুধি কুসুমহীন খাঁটি অর্গানিক চকচকে ডিম।", img:EG[3], gallery:g(EG,3), badge:"ওষুধি" },
  { id:302, title:"কচি কোয়েল ডিম মাঝারি প্যাক", price:95, unit:"পিস", cat:"dairy", farmer:EFN[0], farmerId:EFI[0], desc:"বাচ্চাদের নিয়মিত সুষম সকালের নাশতার জন্য ২৫টি পুষ্টিকর কচি ডিমের প্যাক।", img:EG[0], gallery:g(EG,0), badge:"কোয়েল" },
  { id:303, title:"খামারের তাজা সোনালী ডিম সেট", price:135, unit:"ডজন", cat:"dairy", farmer:EFN[1], farmerId:EFI[1], desc:"শতভাগ ফিট্রাইড মুরগির সোনালী খোলসের প্রোটিন বুস্টেড সুস্থ ডিম।", img:EG[1], gallery:g(EG,1), badge:"সোনালী" },
  { id:304, title:"বাতি ও সাধারণ মুরগির মিক্সড লাল ডিম", price:145, unit:"ডজন", cat:"dairy", farmer:EFN[0], farmerId:EFI[0], desc:"সুপার শপের চেয়ে ফ্রেশ সাধারণ খাঁটি খামারের পুষ্টিকর লাল ডিম।", img:EG[2], gallery:g(EG,2), badge:"লাল ডিম" },

  // ── মধু (305–319) ──
  { id:305, title:"সুন্দরবনের খাঁটি খলিসা মধু", price:1220, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"সুন্দরবনের বিখ্যাত খলিসা ফুলের চাক কাটা বসন্তের তরল খাঁটি সাদাটে সোনালী মধু।", img:HO[0], gallery:g(HO,0), badge:"খলিসা", bestSeller:true },
  { id:306, title:"দিনাজপুরের লিচু ফুলের মধু", price:650, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"লিচু বাগান থেকে মৌমাছি দ্বারা সংগৃহীত সুঘ্রাণযুক্ত ও পাতলা মিষ্টি মধু।", img:HO[1], gallery:g(HO,1), badge:"লিচু ফুলের" },
  { id:307, title:"যশোরের সরিষা ফুলের জমা মধু", price:560, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"সরিষা ক্ষেতের মৌচাক থেকে সংগৃহীত গ্লুকোজ সমৃদ্ধ মাখনের মতো জমে যাওয়া মধু।", img:HO[2], gallery:g(HO,2), badge:"সরিষা" },
  { id:308, title:"কালোজিরা ফুলের ওষুধি ঘন মধু", price:960, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"সকল রোগের মহৌষধ কালোজিরা ক্ষেত থেকে চাক কাটা অত্যন্ত ঘন সুস্বাদু মধু।", img:HO[3], gallery:g(HO,3), badge:"কালোজিরা" },
  { id:309, title:"বিলের বুনো বড় চাক কাটা মধু", price:1150, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"গ্রামবাংলার বুনো নিম ও কড়ই গাছ থেকে বড় চাকে নিজে দাঁড়িয়ে কাটা তরল মধু।", img:HO[0], gallery:g(HO,0), badge:"বুনো চাক" },
  { id:310, title:"বান্দরবানের পাহাড়ি বুনো ডার্ক মধু", price:1420, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"বান্দরবান পাহাড়ের গভীর বনের চাকে জমানো কড়া ঝাঁঝালো ও ঔষধি পাহাড়ি মধু।", img:HO[1], gallery:g(HO,1), badge:"পাহাড়ি" },
  { id:311, title:"পদ্ম ফুলের বিরল খাঁটি মধু", price:1650, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"মধুমতি ও বিলের লাল পদ্ম ফুলের ছোঁয়াযুক্ত দুর্লভ ও ওষুধি অত্যন্ত লাইট মধু।", img:HO[2], gallery:g(HO,2), badge:"দুর্লভ" },
  { id:312, title:"বরই ফুলের কড়া ক্ষীর সোনালী মধু", price:620, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"রাজশাহীর বরই বাগান থেকে সংগৃহীত লালচে সোনালী রঙের অত্যন্ত মিষ্টি মধু।", img:HO[3], gallery:g(HO,3), badge:"বরই" },
  { id:313, title:"মিশ্র পাহাড়ি গাছগাছালির বুনো মধু", price:760, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"বহুমুখী ওষুধি গুণের মিশ্র বুনো গাছের ফুলের নিংড়ানো মধু যা শতভাগ ন্যাচারাল।", img:HO[0], gallery:g(HO,0), badge:"বুনো" },
  { id:314, title:"ইউক্যালিপটাস কড়া ওষুধি মধু", price:690, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"উত্তরবঙ্গের ইউক্যালিপটাস ফুল থেকে সংগৃহীত কাশি ও ঠান্ডার জন্য সেরা ওষুধি মধু।", img:HO[1], gallery:g(HO,1), badge:"ইউক্যালিপটাস" },
  { id:315, title:"রাণী মৌমাছির রয়েল জেলি মধু", price:2600, unit:"৫০০ গ্রাম", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"অ্যান্টি-এজিং ও বুস্ট সমৃদ্ধ রাণী মৌমাছির জেলি মিশ্রিত প্রিমিয়াম ডার্ক মধু।", img:HO[2], gallery:g(HO,2), badge:"রয়েল জেলি" },
  { id:316, title:"খাঁটি সুন্দরবনের গেওয়া মিষ্টি মধু", price:970, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"গেওয়া ফুলের কড়া আঠা গন্ধযুক্ত নোনতা ও লাইট হালকা সোনালী রঙের মধু।", img:HO[3], gallery:g(HO,3), badge:"গেওয়া" },
  { id:317, title:"হিমালয়ের গভীর বনের ট্রাইবাল মধু", price:1550, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"পাহাড়ী উপজাতিদের দ্বারা ঝুঁকিপূর্ণ উঁচু পাহাড়ের চাক থেকে সংগৃহীত কড়া বুনো মধু।", img:HO[0], gallery:g(HO,0), badge:"ট্রাইবাল" },
  { id:318, title:"সুন্দরবনের গরান ফুলের কড়া মধু", price:1350, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"অত্যন্ত আঠালো ও গাঢ় লাল রঙের সুন্দরবনের ঐতিহ্যবাহী খাঁটি গরান মধু।", img:HO[1], gallery:g(HO,1), badge:"গরান" },
  { id:319, title:"বুনো বাবলা ফুলের সোনালী মধু", price:860, unit:"কেজি", cat:"honey", farmer:"সুন্দরবন মধু", farmerId:22, desc:"হালকা মিষ্টি সুবাস যুক্ত প্রিমিয়াম চাক কাটা অপরিশোধিত র সুস্বাদু মধু।", img:HO[2], gallery:g(HO,2), badge:"র মধু" },

  // ── মশলা (320–334) ──
  { id:320, title:"কাঠের ঘানিতে গুঁড়ো তাজা হলুদ", price:290, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"কোনো কৃত্রিম রঙ ছাড়াই দেশি হলুদের কড়া সুন্দর সোনালী রঙ ও সুঘ্রাণ গুঁড়ো।", img:SP[0], gallery:g(SP,0), badge:"প্রাকৃতিক" },
  { id:321, title:"বগুড়ার কড়া ঝাল লাল মরিচ গুঁড়ো", price:330, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"ঝাঁঝ ও কড়া লাল রঙে সেরা বগুড়ার শুকনো মরিচ ধুয়ে ভাঙানো লাল গুঁড়ো।", img:SP[1], gallery:g(SP,1), badge:"বগুড়ার" },
  { id:322, title:"ভেজে গুঁড়ো করা সুগন্ধি জিরে", price:660, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"হালকা আঁচে নিখুঁত ভেজে গুঁড়ো করা দেশী জিরে যা তরকারিতে দেবে রাজকীয় ঘ্রাণ।", img:SP[2], gallery:g(SP,2), badge:"সুগন্ধি" },
  { id:323, title:"দেশী সুঘ্রাণযুক্ত গোল ধনে গুঁড়ো", price:230, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"আস্ত ধনে পরিষ্কার করে শুকিয়ে মিল থেকে ভাঙানো তাজা সোনালী ধনে গুঁড়ো।", img:SP[3], gallery:g(SP,3), badge:"ধনে" },
  { id:324, title:"ঐতিহ্যবাহী কড়া পাঁচফোড়ন আস্ত", price:250, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"মেথি, মৌরি, কালোজিরা, রাঁধুনি এবং জিরার চমৎকার ঐতিহ্যবাহী মশলা।", img:SP[0], gallery:g(SP,0), badge:"পাঁচফোড়ন" },
  { id:325, title:"চট্টগ্রামের মেজবানি মাংসের মশলা", price:990, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"১৫টিরও বেশি প্রিমিয়াম আস্ত মশলার নিখুঁত চড়া ব্লেন্ড যা মেজবানির স্বাদ বাড়ায়।", img:SP[1], gallery:g(SP,1), badge:"মেজবানি", bestSeller:true },
  { id:326, title:"দারুচিনি স্টিকস সিংগাপুর গ্রেড", price:490, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"মিষ্টি সুবাসিত ও মসৃণ কড়া মিষ্টি গন্ধের সেরা কোয়ালিটির আসল দারুচিনি ছাল।", img:SP[2], gallery:g(SP,2), badge:"দারুচিনি" },
  { id:327, title:"সবুজ কচি কড়া এলাচ গোল দানা", price:3450, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"কড়া সুগন্ধযুক্ত এবং দানাভরা মিষ্টি সবুজ এলাচের খাঁটি আস্ত পড।", img:SP[3], gallery:g(SP,3), badge:"এলাচ" },
  { id:328, title:"দেশী কড়া ঝাঁঝালো কালো গোলমরিচ", price:920, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"ঝাঁঝ ও স্যুপে কড়া ঝাল দেওয়ার জন্য মাটির চরের কালো গোলমরিচ দানা।", img:SP[0], gallery:g(SP,0), badge:"গোলমরিচ" },
  { id:329, title:"শুকনো সুগন্ধি পাহাড়ি তেজপাতা", price:160, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"ক্ষেতের বড় আকারের ওষুধি তেজপাতা, তরকারিতে দেবে মন জুড়ানো মিষ্টি গন্ধ।", img:SP[1], gallery:g(SP,1), badge:"তেজপাতা" },
  { id:330, title:"কক্সবাজারের ধুলাবালি মুক্ত কালোজিরা", price:330, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"কালোজিরার ওষুধি নির্যাস জমানো খাঁটি চকচকে ধুলাবালি মুক্ত কালো দানা।", img:SP[2], gallery:g(SP,2), badge:"কালোজিরা" },
  { id:331, title:"শাহী জয়ফল আস্ত বড় সাইজ", price:860, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"মাংস ও পোলাও রান্নায় মিষ্টি রাজকীয় সুবাস আনার জন্য বড় সাইজ জয়ফল আস্ত।", img:SP[3], gallery:g(SP,3), badge:"জয়ফল" },
  { id:332, title:"সুঘ্রাণযুক্ত শুষ্ক জয়ত্রী ছাল", price:2850, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"পোলাও ও কোরমাতে শাহী উজ্জ্বল ঘ্রাণ ও সোনালী রঙ আনতে ব্যবহৃত আসল জয়ত্রী।", img:SP[0], gallery:g(SP,0), badge:"জয়ত্রী" },
  { id:333, title:"দাঁতের ব্যথা উপশমকারী কড়া লবঙ্গ", price:1420, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"কড়া সুবাস ও ঔষধি গুণে সেরা চকচকে বড় ফুলওয়ালা আসল লবঙ্গ।", img:SP[1], gallery:g(SP,1), badge:"লবঙ্গ" },
  { id:334, title:"জৈব ও অর্গানিক মেথি শুকনো দানা", price:260, unit:"কেজি", cat:"spice", farmer:"ছালাম মিয়া", farmerId:3, desc:"ডায়াবেটিক নিয়ন্ত্রণে ও তরকারির ফোড়নে ব্যবহৃত তেতো মিষ্টি মেথি দানা।", img:SP[2], gallery:g(SP,2), badge:"মেথি" },

  // ── অর্গানিক (335–349) ──
  { id:335, title:"কাঠের ঘানিতে ফার্স্ট প্রেসড সরিষার তেল", price:245, unit:"লিটার", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"প্রথম চাপের কড়া ঝাঁঝালো কাঠের ঘানি ভাঙা শতভাগ খাঁটি সোনালী সরিষার তেল।", img:OR[0], gallery:g(OR,0), badge:"ঘানির তেল", bestSeller:true },
  { id:336, title:"পাবনার স্পেশাল গাওয়া ঘি খাঁটি", price:1420, unit:"কেজি", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"খাঁটি মাখনের মনকাড়া ঘ্রাণযুক্ত ঐতিহ্যবাহী গাওয়া ঘি যা সব খাবারের স্বাদ বাড়াবে।", img:OR[1], gallery:g(OR,1), badge:"গাওয়া ঘি" },
  { id:337, title:"হালকা মিষ্টি আখের লাল দানা চিনি", price:148, unit:"কেজি", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"রাসায়নিক ব্লিচ ছাড়া দেশী আখের প্রাকৃতিক লালচে পুষ্টিকর নন-রিফাইন্ড চিনি।", img:OR[2], gallery:g(OR,2), badge:"নন-রিফাইন্ড" },
  { id:338, title:"রাসায়নিক মুক্ত আখের লাল গুড়", price:165, unit:"কেজি", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"কোনো কেমিক্যাল বা সোডা ছাড়া জ্বাল দেওয়া আখ ক্ষীরের সুস্বাদু লাল শক্ত গুড়।", img:OR[3], gallery:g(OR,3), badge:"কেমিক্যালমুক্ত" },
  { id:339, title:"ওমেগা ফাইবার সমৃদ্ধ চিয়া সিড", price:490, unit:"কেজি", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"ওমেগা-৩ ও প্রচুর ডায়েটারি ফাইবার সমৃদ্ধ প্রিমিয়াম গ্রেড খাঁটি চিয়া বীজ।", img:OR[0], gallery:g(OR,0), badge:"চিয়া সিড" },
  { id:340, title:"খনিজ উপাদান সমৃদ্ধ হিমালয়ের গোলাপী লবণ", price:185, unit:"কেজি", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"সাধারণ লবণের বদলে ব্যবহারযোগ্য খনিজ উপাদান সমৃদ্ধ আসল গোলাপী পিঙ্ক সল্ট।", img:OR[1], gallery:g(OR,1), badge:"পিঙ্ক সল্ট" },
  { id:341, title:"ঘানির প্রথম চাপ সাদা তিল তেল", price:390, unit:"লিটার", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"ত্বকের সুরক্ষায় ও রান্নায় ব্যবহার উপযোগী কোল্ডপ্রেসড সাদা তিল তেল।", img:OR[2], gallery:g(OR,2), badge:"তিল তেল" },
  { id:342, title:"কাঠের ঘানিতে কোল্ডপ্রেসড নারিকেল তেল", price:460, unit:"লিটার", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"অর্গানিক কোপরা রোদে শুকিয়ে কাঠের ঘানিতে ভাঙানো প্রথম চাপ ভোজ্য তেল।", img:OR[3], gallery:g(OR,3), badge:"নারিকেল তেল" },
  { id:343, title:"সজনে পাতার গুঁড়ো মোরিঙ্গা সুপারপাউডার", price:360, unit:"কেজি", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"সুপারফুড সজনে পাতার শক্তিশালী ওষুধি অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ সবুজ চূর্ণ।", img:OR[0], gallery:g(OR,0), badge:"মোরিঙ্গা" },
  { id:344, title:"শুকনো ওষুধি অয়েস্টার মাশরুম গুঁড়ো", price:495, unit:"২৫০ গ্রাম", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"অর্গানিক মাশরুমের পাউডার যা স্যুপ ও ডালের স্বাদ ১০ গুণ বৃদ্ধি করবে।", img:OR[1], gallery:g(OR,1), badge:"মাশরুম" },
  { id:345, title:"যশোরের নলেন খেজুরের তরল গুড়", price:230, unit:"কেজি", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"গাছীদের ভোরের খেজুর রস জ্বাল দিয়ে তৈরি অতুলনীয় সুঘ্রাণের লালচে তরল গুড়।", img:OR[2], gallery:g(OR,2), badge:"নলেন গুড়" },
  { id:346, title:"হার্ট সুস্থ রাখার অর্গানিক ওটস ফ্ল্যাক্স", price:345, unit:"কেজি", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"শরীরের ওজন কমাতে এবং কোলেস্টেরল নিয়ন্ত্রণে উপকারী ফাইবার সুদ্ধ ওটস।", img:OR[3], gallery:g(OR,3), badge:"ওটস" },
  { id:347, title:"পেটের জন্য মহৌষধ ত্রিফলা কড়া চূর্ণ", price:290, unit:"৩০০ গ্রাম", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"আমলকী, হরিতকী ও বহেরা ছাঁকা কড়া গ্যাস্ট্রিক হরন ওষুধি ঘরোয়া গুঁড়ো।", img:OR[0], gallery:g(OR,0), badge:"ত্রিফলা" },
  { id:348, title:"ঐতিহ্যবাহী তালের রসা তালমিছরি", price:330, unit:"কেজি", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"বাচ্চাদের কফ ও গলা খুসখুস সারাতে অতুলনীয় তালের রস থেকে জমানো মিছরি।", img:OR[1], gallery:g(OR,1), badge:"তালমিছরি" },
  { id:349, title:"কাঠের ঘানির মিষ্টি কাঠবাদাম তেল", price:850, unit:"২৫০ মিলি", cat:"organic", farmer:"অর্গানিক খামার", farmerId:23, desc:"চুল ও শিশুদের ত্বকের যত্নে ঘানিতে ভাঙানো ১০০% খাঁটি কাঠবাদাম তেল।", img:OR[2], gallery:g(OR,2), badge:"কাঠবাদাম তেল" },

  // ── শাকপাতা (350–364) ──
  { id:350, title:"ক্ষেতের কচি লাল শাক তাজা আঁটি", price:18, unit:"আঁটি", cat:"leafy", farmer:LFN[0], farmerId:LFI[0], desc:"রক্ত তৈরিতে উপকারী আয়রন ও ক্যালসিয়ামে ভরপুর ক্ষেতের লাল কচি টসটসে শাক।", img:LE[0], gallery:g(LE,0), badge:"আয়রন" },
  { id:351, title:"সবুজ নরম কচি পালং শাক আঁটি", price:22, unit:"আঁটি", cat:"leafy", farmer:LFN[1], farmerId:LFI[1], desc:"ভিটামিন এ সমৃদ্ধ সতেজ কচি পাতার পালং শাক, চিংড়ি ও আলুর তরকারিতে সেরা।", img:LE[1], gallery:g(LE,1), badge:"ভিটামিন এ" },
  { id:352, title:"কচি পুই শাক মোটা ডগা আঁটি", price:25, unit:"আঁটি", cat:"leafy", farmer:LFN[0], farmerId:LFI[0], desc:"চর্বিহীন পুষ্টির আঁটি ভরা মিষ্টি কচি পুই শাক যা ইলিশের মাথা দিয়ে অসাধারণ রাঁধা যায়।", img:LE[2], gallery:g(LE,2), badge:"কচি" },
  { id:353, title:"সুঘ্রাণযুক্ত কচি ধনেপাতা আঁটি", price:15, unit:"আঁটি", cat:"leafy", farmer:LFN[1], farmerId:LFI[1], desc:"সালাদ ও তরকারির ডেকোরেশনে চমৎকার মন জুড়ানো সুবাসের কচি ধনেপাতা।", img:LE[3], gallery:g(LE,3), badge:"সুগন্ধি" },
  { id:354, title:"সহজপাচ্য কচি ডাটা শাক আঁটি", price:20, unit:"আঁটি", cat:"leafy", farmer:LFN[0], farmerId:LFI[0], desc:"নরম ডগা ও মিষ্টি পাতা বিশিষ্ট অত্যন্ত সুস্বাদু ডাটা শাকের বড় আঁটি।", img:LE[0], gallery:g(LE,0), badge:"সহজপাচ্য" },
  { id:355, title:"জলাশয়ের সতেজ নরম কলমি শাক", price:16, unit:"আঁটি", cat:"leafy", farmer:LFN[1], farmerId:LFI[1], desc:"ভিটামিন ও আয়রনের সস্তা উৎস নদী বিলের ধার থেকে তোলা তাজা কলমি শাক।", img:LE[1], gallery:g(LE,1), badge:"কলমি" },
  { id:356, title:"মুখরোচক তেতো কচি পাট শাক আঁটি", price:18, unit:"আঁটি", cat:"leafy", farmer:LFN[0], farmerId:LFI[0], desc:"গরমের দিনে দুপুরের ভাতে রুচি ফেরাতে সেরা হালকা তেতো নরম পাট শাক।", img:LE[2], gallery:g(LE,2), badge:"পাট শাক" },
  { id:357, title:"সুঘ্রাণযুক্ত সতেজ কচি পুদিনা পাতা", price:12, unit:"আঁটি", cat:"leafy", farmer:LFN[1], farmerId:LFI[1], desc:"বোরহানি ও লেবুর শরবতে সতেজ সুঘ্রাণ ছড়াতে উপযোগী তাজা পুদিনা পাতা।", img:LE[3], gallery:g(LE,3), badge:"পুদিনা" },
  { id:358, title:"তাজা সর্ষে শাক কচি মিষ্টি ডগা", price:24, unit:"আঁটি", cat:"leafy", farmer:LFN[0], farmerId:LFI[0], desc:"শীতকালীন ঝাঁঝালো স্বাদের কচি সর্ষে শাক যা খাঁটি সরিষার তেলে ভাজিতে দারুণ।", img:LE[0], gallery:g(LE,0), badge:"সর্ষে" },
  { id:359, title:"কচি লাউ শাক এবং পাতা ডগা আঁটি", price:30, unit:"আঁটি", cat:"leafy", farmer:LFN[1], farmerId:LFI[1], desc:"কচি লাউ গাছের সতেজ ডগা ও মিষ্টি পাতাসমেত লাউ শাকের রাজকীয় আঁটি।", img:LE[1], gallery:g(LE,1), badge:"লাউ শাক" },
  { id:360, title:"মিষ্টি কুমড়ো শাক ও কচি নরম ডগা", price:28, unit:"আঁটি", cat:"leafy", farmer:LFN[0], farmerId:LFI[0], desc:"হলুদ ফুল ও কচি লতাযুক্ত কুমড়োর পাতা ও ডগার স্বাস্থ্যকর মিক্স আঁটি।", img:LE[2], gallery:g(LE,2), badge:"কুমড়ো শাক" },
  { id:361, title:"ওষুধি গুণসম্পন্ন হেলেঞ্চা শাক তাজা", price:20, unit:"আঁটি", cat:"leafy", farmer:LFN[1], farmerId:LFI[1], desc:"হজম শক্তি বাড়াতে সাহায্যকারী হালকা তেতো ওষুধি জলাভূমির হেলেঞ্চা শাক।", img:LE[3], gallery:g(LE,3), badge:"ওষুধি" },
  { id:362, title:"পেটের রোগ নিরাময়ক থানকুনি পাতা", price:15, unit:"আঁটি", cat:"leafy", farmer:LFN[0], farmerId:LFI[0], desc:"গ্রামবাংলার প্রাচীন ওষুধি থানকুনি পাতা আলু দিয়ে নরম বাটা খাওয়ার উপযোগী।", img:LE[0], gallery:g(LE,0), badge:"থানকুনি" },
  { id:363, title:"পুষ্টির খনি সজনে কচি পাতা ডগা", price:25, unit:"আঁটি", cat:"leafy", farmer:LFN[1], farmerId:LFI[1], desc:"হাজারো গুণের সজনে গাছের তাজা সবুজ কচি কচি ডগাপাতা ডায়েট সালাদ।", img:LE[1], gallery:g(LE,1), badge:"সজনে" },
  { id:364, title:"তেতো মিষ্টি মেথি শাক আঁটি", price:22, unit:"আঁটি", cat:"leafy", farmer:LFN[0], farmerId:LFI[0], desc:"ডায়াবেটিক ও কোলেস্টেরল বান্ধব কড়া সুঘ্রাণ ও তেতো স্বাদের মেথি পাতা।", img:LE[2], gallery:g(LE,2), badge:"মেথি শাক" },
];
