import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { Order } from "@/constants/data";
import { useApp } from "@/context/AppContext";

const STATUS_STEPS: { key: Order["status"]; label: string; icon: string }[] = [
  { key: "pending",          label: "অপেক্ষমাণ",      icon: "clock" },
  { key: "confirmed",        label: "নিশ্চিত",         icon: "check-circle" },
  { key: "processing",       label: "প্রস্তুতি",       icon: "package" },
  { key: "packed",           label: "প্যাকড",           icon: "box" },
  { key: "shipped",          label: "পাঠানো হয়েছে",   icon: "truck" },
  { key: "out_for_delivery", label: "পৌঁছানোর পথে",   icon: "navigation" },
  { key: "delivered",        label: "ডেলিভারি সম্পন্ন", icon: "home" },
];

const STATUS_COLOR: Record<string, string> = {
  pending:          "#f59e0b",
  confirmed:        "#3b82f6",
  processing:       "#8b5cf6",
  packed:           "#06b6d4",
  shipped:          "#f97316",
  out_for_delivery: "#ec4899",
  delivered:        "#10b981",
};

function StatusBadge({ status }: { status: Order["status"] }) {
  const step = STATUS_STEPS.find((s) => s.key === status);
  const color = STATUS_COLOR[status] ?? "#6b7280";
  return (
    <View style={[badgeStyles.badge, { backgroundColor: color + "22", borderColor: color + "55" }]}>
      <Feather name={step?.icon as any ?? "circle"} size={11} color={color} />
      <Text style={[badgeStyles.text, { color }]}>{step?.label ?? status}</Text>
    </View>
  );
}

function OrderProgressBar({ status }: { status: Order["status"] }) {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === status);
  return (
    <View style={progStyles.container}>
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const color = done ? STATUS_COLOR[status] ?? colors.light.primary : "#e5e7eb";
        return (
          <View key={step.key} style={progStyles.stepWrap}>
            <View style={[progStyles.dot, { backgroundColor: color }]}>
              {done && <Feather name="check" size={8} color="#fff" />}
            </View>
            {i < STATUS_STEPS.length - 1 && (
              <View style={[progStyles.line, { backgroundColor: i < currentIdx ? color : "#e5e7eb" }]} />
            )}
          </View>
        );
      })}
    </View>
  );
}

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { orders, currentCustomer } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const myOrders = useMemo(() => {
    if (!currentCustomer) return [];
    return [...orders]
      .filter((o) => o.customerId === currentCustomer.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, currentCustomer]);

  if (!currentCustomer) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
        <View style={[styles.header, { paddingTop: topPad + 8 }]}>
          <Text style={styles.headerTitle}>আমার অর্ডার</Text>
        </View>
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>লগইন করুন</Text>
          <Text style={styles.emptyBody}>আপনার অর্ডার দেখতে গ্রাহক হিসেবে লগইন করুন।</Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push("/")}
          >
            <Text style={styles.loginBtnText}>হোমে ফিরুন → লগইন করুন</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={styles.headerTitle}>আমার অর্ডার</Text>
        <Text style={styles.headerSub}>
          {currentCustomer.name} · {myOrders.length}টি অর্ডার
        </Text>
      </View>

      {myOrders.length === 0 ? (
        <View style={styles.emptyCenter}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>কোনো অর্ডার নেই</Text>
          <Text style={styles.emptyBody}>এখনো কোনো অর্ডার করা হয়নি। এখনই কিনুন!</Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push("/")}
          >
            <Text style={styles.loginBtnText}>পণ্য দেখুন</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 14, gap: 14, paddingBottom: Platform.OS === "web" ? 110 : 90 }}
          showsVerticalScrollIndicator={false}
        >
          {myOrders.map((order) => (
            <View key={order.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>অর্ডার #{order.id.slice(-6).toUpperCase()}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.date).toLocaleDateString("bn-BD", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </Text>
                </View>
                <StatusBadge status={order.status} />
              </View>

              <OrderProgressBar status={order.status} />

              <View style={styles.divider} />

              <View style={styles.itemsSection}>
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemQty}>×{item.qty}</Text>
                    <Text style={styles.itemPrice}>৳{(item.price * item.qty).toLocaleString()}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.deliveryArea}>
                    📍 {order.deliveryArea === "dhaka" ? "ঢাকা" : "ঢাকার বাইরে"} · ডেলিভারি ৳{order.deliveryCharge}
                  </Text>
                  {order.trackingNumber && (
                    <Text style={styles.tracking}>ট্র্যাকিং: {order.trackingNumber}</Text>
                  )}
                </View>
                <Text style={styles.grandTotal}>৳{order.grandTotal.toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1,
  },
  text: { fontSize: 11, fontWeight: "700" as const },
});

const progStyles = StyleSheet.create({
  container: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 4, marginVertical: 12,
  },
  stepWrap: { flexDirection: "row", alignItems: "center", flex: 1 },
  dot: {
    width: 18, height: 18, borderRadius: 9,
    alignItems: "center", justifyContent: "center",
  },
  line: { flex: 1, height: 2 },
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: { fontSize: 26, fontWeight: "800" as const, color: colors.light.primary },
  headerSub: { fontSize: 13, color: colors.light.mutedForeground, marginTop: 2 },
  emptyCenter: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 30 },
  emptyIcon: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: "700" as const, color: colors.light.text },
  emptyBody: { fontSize: 14, color: colors.light.mutedForeground, textAlign: "center" as const, lineHeight: 22 },
  loginBtn: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 24, marginTop: 8,
  },
  loginBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderId: { fontSize: 15, fontWeight: "700" as const, color: colors.light.text },
  orderDate: { fontSize: 12, color: colors.light.mutedForeground, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.light.border, marginVertical: 10 },
  itemsSection: { gap: 6 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemTitle: { flex: 1, fontSize: 13, color: colors.light.text },
  itemQty: { fontSize: 12, color: colors.light.mutedForeground, minWidth: 30 },
  itemPrice: { fontSize: 13, fontWeight: "600" as const, color: colors.light.primary },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  deliveryArea: { fontSize: 12, color: colors.light.mutedForeground },
  tracking: { fontSize: 11, color: colors.light.primary, marginTop: 2 },
  grandTotal: { fontSize: 20, fontWeight: "800" as const, color: colors.light.primary },
});
