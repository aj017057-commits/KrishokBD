import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDb, isFirebaseConfigured, COLLECTIONS } from "./firebase";

export type ReviewDoc = {
  id: string;
  productId: number;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  createdAt: number;
};

export type WithdrawalDoc = {
  id: string;
  farmerId: number;
  farmerName: string;
  amount: number;
  method: "bKash" | "Nagad" | "Rocket";
  accountNumber: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
  processedAt?: number;
  note?: string;
};

export type NotificationDoc = {
  id: string;
  recipientId: string;
  recipientType: "customer" | "farmer" | "admin";
  title: string;
  body: string;
  type: "new_order" | "order_update" | "withdrawal" | "system";
  orderId?: string;
  read: boolean;
  createdAt: number;
};

const REVIEWS_KEY = "krishok_reviews_v1";
const WITHDRAWALS_KEY = "krishok_withdrawals_v1";
const NOTIFICATIONS_KEY = "krishok_notifications_v1";

async function getLocal<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveLocal<T>(key: string, data: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export const ReviewsService = {
  async getByProduct(productId: number): Promise<ReviewDoc[]> {
    if (isFirebaseConfigured) {
      try {
        const db = await getDb();
        if (db) {
          const { collection, query, where, getDocs, orderBy } = await import("firebase/firestore");
          const q = query(
            collection(db, COLLECTIONS.REVIEWS),
            where("productId", "==", productId),
            orderBy("createdAt", "desc")
          );
          const snap = await getDocs(q);
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ReviewDoc));
        }
      } catch { /* fallback */ }
    }
    const all = await getLocal<ReviewDoc>(REVIEWS_KEY);
    return all.filter((r) => r.productId === productId).sort((a, b) => b.createdAt - a.createdAt);
  },

  async add(review: Omit<ReviewDoc, "id" | "createdAt">): Promise<ReviewDoc> {
    const doc: ReviewDoc = { ...review, id: Date.now().toString(), createdAt: Date.now() };
    if (isFirebaseConfigured) {
      try {
        const db = await getDb();
        if (db) {
          const { collection, addDoc } = await import("firebase/firestore");
          const ref = await addDoc(collection(db, COLLECTIONS.REVIEWS), doc);
          return { ...doc, id: ref.id };
        }
      } catch { /* fallback */ }
    }
    const all = await getLocal<ReviewDoc>(REVIEWS_KEY);
    await saveLocal(REVIEWS_KEY, [doc, ...all]);
    return doc;
  },

  async getAvgRating(productId: number): Promise<{ avg: number; count: number }> {
    const reviews = await ReviewsService.getByProduct(productId);
    if (!reviews.length) return { avg: 0, count: 0 };
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return { avg: Math.round(avg * 10) / 10, count: reviews.length };
  },
};

export const WithdrawalsService = {
  async getAll(): Promise<WithdrawalDoc[]> {
    if (isFirebaseConfigured) {
      try {
        const db = await getDb();
        if (db) {
          const { collection, getDocs, orderBy, query } = await import("firebase/firestore");
          const q = query(collection(db, COLLECTIONS.WITHDRAWALS), orderBy("createdAt", "desc"));
          const snap = await getDocs(q);
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WithdrawalDoc));
        }
      } catch { /* fallback */ }
    }
    const all = await getLocal<WithdrawalDoc>(WITHDRAWALS_KEY);
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },

  async getByFarmer(farmerId: number): Promise<WithdrawalDoc[]> {
    const all = await WithdrawalsService.getAll();
    return all.filter((w) => w.farmerId === farmerId);
  },

  async request(req: Omit<WithdrawalDoc, "id" | "createdAt" | "status">): Promise<WithdrawalDoc> {
    const doc: WithdrawalDoc = { ...req, id: Date.now().toString(), createdAt: Date.now(), status: "pending" };
    if (isFirebaseConfigured) {
      try {
        const db = await getDb();
        if (db) {
          const { collection, addDoc } = await import("firebase/firestore");
          const ref = await addDoc(collection(db, COLLECTIONS.WITHDRAWALS), doc);
          return { ...doc, id: ref.id };
        }
      } catch { /* fallback */ }
    }
    const all = await getLocal<WithdrawalDoc>(WITHDRAWALS_KEY);
    await saveLocal(WITHDRAWALS_KEY, [doc, ...all]);
    return doc;
  },

  async updateStatus(id: string, status: WithdrawalDoc["status"], note?: string): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        const db = await getDb();
        if (db) {
          const { doc, updateDoc } = await import("firebase/firestore");
          await updateDoc(doc(db, COLLECTIONS.WITHDRAWALS, id), { status, processedAt: Date.now(), note });
          return;
        }
      } catch { /* fallback */ }
    }
    const all = await getLocal<WithdrawalDoc>(WITHDRAWALS_KEY);
    const updated = all.map((w) => w.id === id ? { ...w, status, processedAt: Date.now(), note } : w);
    await saveLocal(WITHDRAWALS_KEY, updated);
  },
};

export const NotificationsService = {
  async getForRecipient(recipientId: string): Promise<NotificationDoc[]> {
    if (isFirebaseConfigured) {
      try {
        const db = await getDb();
        if (db) {
          const { collection, query, where, getDocs, orderBy } = await import("firebase/firestore");
          const q = query(
            collection(db, COLLECTIONS.NOTIFICATIONS),
            where("recipientId", "==", recipientId),
            orderBy("createdAt", "desc")
          );
          const snap = await getDocs(q);
          return snap.docs.map((d) => ({ id: d.id, ...d.data() } as NotificationDoc));
        }
      } catch { /* fallback */ }
    }
    const all = await getLocal<NotificationDoc>(NOTIFICATIONS_KEY);
    return all.filter((n) => n.recipientId === recipientId).sort((a, b) => b.createdAt - a.createdAt);
  },

  async send(notif: Omit<NotificationDoc, "id" | "createdAt" | "read">): Promise<void> {
    const doc: NotificationDoc = { ...notif, id: Date.now().toString(), createdAt: Date.now(), read: false };
    if (isFirebaseConfigured) {
      try {
        const db = await getDb();
        if (db) {
          const { collection, addDoc } = await import("firebase/firestore");
          await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), doc);
          return;
        }
      } catch { /* fallback */ }
    }
    const all = await getLocal<NotificationDoc>(NOTIFICATIONS_KEY);
    await saveLocal(NOTIFICATIONS_KEY, [doc, ...all]);
  },

  async markRead(id: string): Promise<void> {
    if (isFirebaseConfigured) {
      try {
        const db = await getDb();
        if (db) {
          const { doc, updateDoc } = await import("firebase/firestore");
          await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { read: true });
          return;
        }
      } catch { /* fallback */ }
    }
    const all = await getLocal<NotificationDoc>(NOTIFICATIONS_KEY);
    await saveLocal(NOTIFICATIONS_KEY, all.map((n) => n.id === id ? { ...n, read: true } : n));
  },
};
