import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

interface NotifItem {
  id: string;
  type: "order" | "promo" | "system" | "farmer";
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
  color: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘন্টা আগে`;
  const days = Math.floor(hrs / 24);
  return `${days} দিন আগে`;
}

export default function NotificationsModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { orders, currentCustomer, currentFarmer, products } = useApp();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const notifications: NotifItem[] = [];

  // Order-based notifications for customer
  if (currentCustomer) {
    const myOrders = orders.filter((o) => o.customerId === currentCustomer.id);
    myOrders.slice(-5).reverse().forEach((o) => {
      const statusLabels: Record<string, string> = {
        confirmed: "আপনার অর্ডার নিশ্চিত হয়েছে",
        processing: "আপনার অর্ডার প্রস্তুত হচ্ছে",
        packed: "আপনার অর্ডার প্যাক করা হয়েছে",
        shipped: "আপনার অর্ডার পাঠানো হয়েছে",
        out_for_delivery: "ডেলিভারি ম্যান পৌঁছে যাচ্ছেন",
        delivered: "অর্ডার সফলভাবে ডেলিভারি হয়েছে 🎉",
        pending: "অর্ডারের জন্য অপেক্ষা করা হচ্ছে",
      };
      const statusColors: Record<string, string> = {
        confirmed: "#3b82f6", processing: "#8b5cf6", packed: "#06b6d4",
        shipped: "#f97316", out_for_delivery: "#ec4899", delivered: "#10b981", pending: "#f59e0b",
      };
      notifications.push({
        id: `order-${o.id}`,
        type: "order",
        title: statusLabels[o.status] ?? "অর্ডার আপডেট",
        body: `অর্ডার #${o.id.slice(-6).toUpperCase()} · ৳${o.grandTotal.toLocaleString()}`,
        time: o.date,
        read: readIds.has(`order-${o.id}`),
        icon: "package",
        color: statusColors[o.status] ?? colors.light.primary,
      });
    });
  }

  // Farmer-based notifications
  if (currentFarmer) {
    const myOrders = orders.filter((o) => o.farmerName === currentFarmer.name || o.farmerId === currentFarmer.id);
    if (myOrders.length > 0) {
      notifications.push({
        id: "farmer-orders",
        type: "farmer",
        title: `${myOrders.length}টি নতুন অর্ডার আপনার পণ্যে`,
        body: `মোট আয়: ৳${myOrders.reduce((s, o) => s + o.subtotal, 0).toLocaleString()}`,
        time: myOrders[myOrders.length - 1]?.date ?? new Date().toISOString(),
        read: readIds.has("farmer-orders"),
        icon: "trending-up",
        color: "#d97706",
      });
    }
  }

  // Static promos / system notifications
  notifications.push(
    {
      id: "promo-1",
      type: "promo",
      title: "🎉 ঢাকায় বিশেষ ছাড়! আজ ডেলিভারি মাত্র ৳৪০",
      body: "আজ রাত ১২টা পর্যন্ত ঢাকা সিটিতে ডেলিভারি ছাড়",
      time: new Date(Date.now() - 3 * 3600000).toISOString(),
      read: readIds.has("promo-1"),
      icon: "tag",
      color: "#16a34a",
    },
    {
      id: "promo-2",
      type: "promo",
      title: "নতুন কৃষক যোগ দিয়েছেন",
      body: `${products.slice(-2).map(p => p.title).join(", ")} সহ নতুন পণ্য এসেছে`,
      time: new Date(Date.now() - 24 * 3600000).toISOString(),
      read: readIds.has("promo-2"),
      icon: "sun",
      color: "#d97706",
    },
    {
      id: "system-1",
      type: "system",
      title: "কৃষক বাজারে স্বাগতম!",
      body: "সরাসরি কৃষকের কাছ থেকে তাজা পণ্য কিনুন। AI চ্যাট দিয়ে পরামর্শ নিন।",
      time: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
      read: readIds.has("system-1"),
      icon: "bell",
      color: colors.light.primary,
    }
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>নোটিফিকেশন</Text>
              {unreadCount > 0 && (
                <Text style={styles.headerSub}>{unreadCount}টি অপঠিত</Text>
              )}
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
                <Feather name="check-circle" size={14} color={colors.light.primary} />
                <Text style={styles.markAllText}>সব পড়া হয়েছে</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Feather name="x" size={20} color={colors.light.mutedForeground} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            ListEmptyComponent={() => (
              <View style={styles.empty}>
                <Feather name="bell-off" size={40} color={colors.light.mutedForeground} />
                <Text style={styles.emptyText}>কোনো নোটিফিকেশন নেই</Text>
              </View>
            )}
            renderItem={({ item }) => {
              const isRead = readIds.has(item.id);
              return (
                <TouchableOpacity
                  style={[styles.notifItem, !isRead && styles.notifUnread]}
                  onPress={() => markRead(item.id)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.iconBox, { backgroundColor: item.color + "18" }]}>
                    <Feather name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <Text style={[styles.notifTitle, !isRead && styles.notifTitleUnread]} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
                    <Text style={styles.notifTime}>{timeAgo(item.time)}</Text>
                  </View>
                  {!isRead && <View style={[styles.unreadDot, { backgroundColor: item.color }]} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: "88%", paddingTop: 8,
  },
  handle: {
    width: 42, height: 4, backgroundColor: "#e5e7eb",
    borderRadius: 2, alignSelf: "center", marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 20, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: "#f3f4f6",
  },
  headerTitle: { fontSize: 20, fontWeight: "800" as const, color: colors.light.text },
  headerSub: { fontSize: 12, color: colors.light.primary, marginTop: 2 },
  markAllBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: colors.light.primarySoft, borderRadius: 16,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  markAllText: { fontSize: 11, color: colors.light.primary, fontWeight: "600" as const },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center",
  },
  list: { paddingVertical: 4 },
  divider: { height: 1, backgroundColor: "#f9fafb" },
  notifItem: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: "#fff",
  },
  notifUnread: { backgroundColor: "#f0fdf4" },
  iconBox: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  notifContent: { flex: 1, gap: 2 },
  notifTitle: { fontSize: 14, fontWeight: "600" as const, color: colors.light.text, lineHeight: 20 },
  notifTitleUnread: { fontWeight: "700" as const, color: colors.light.text },
  notifBody: { fontSize: 12, color: colors.light.mutedForeground, lineHeight: 18 },
  notifTime: { fontSize: 10, color: colors.light.mutedForeground, marginTop: 4 },
  unreadDot: { width: 9, height: 9, borderRadius: 5, marginTop: 5, flexShrink: 0 },
  empty: { alignItems: "center", justifyContent: "center", padding: 48, gap: 12 },
  emptyText: { fontSize: 14, color: colors.light.mutedForeground },
});
