import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
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

const ORDER_STEPS: { key: Order["status"]; label: string; icon: string; desc: string }[] = [
  { key: "pending",          label: "অপেক্ষমাণ",    icon: "clock",        desc: "অর্ডার পাওয়া হয়েছে, প্রক্রিয়াকরণ শুরু হবে।" },
  { key: "confirmed",        label: "নিশ্চিত",       icon: "check-circle", desc: "অর্ডার নিশ্চিত করা হয়েছে।" },
  { key: "processing",       label: "প্রস্তুতি",     icon: "package",      desc: "কৃষক পণ্য প্রস্তুত করছেন।" },
  { key: "packed",           label: "প্যাক করা",    icon: "archive",      desc: "পণ্য প্যাক করা হয়েছে।" },
  { key: "shipped",          label: "শিপড",         icon: "truck",        desc: "পণ্য ডেলিভারি সার্ভিসে গেছে।" },
  { key: "out_for_delivery", label: "ডেলিভারিতে",  icon: "navigation",   desc: "ডেলিভারি ম্যান আপনার দিকে আসছেন।" },
  { key: "delivered",        label: "ডেলিভারড",     icon: "home",         desc: "পণ্য সফলভাবে পৌঁছে গেছে! 🎉" },
];

const STEP_COLORS: Record<string, string> = {
  pending:          "#f59e0b",
  confirmed:        "#3b82f6",
  processing:       "#8b5cf6",
  packed:           "#06b6d4",
  shipped:          "#f97316",
  out_for_delivery: "#ec4899",
  delivered:        "#22c55e",
};

function getEstimatedDelivery(status: Order["status"], createdAt: number): string {
  const base = new Date(createdAt);
  const daysMap: Record<string, number> = {
    pending: 3, confirmed: 3, processing: 2, packed: 2, shipped: 1, out_for_delivery: 0, delivered: 0,
  };
  const days = daysMap[status] ?? 2;
  if (days === 0 && status === "delivered") return "ডেলিভারড";
  if (days === 0) return "আজকের মধ্যে";
  base.setDate(base.getDate() + days);
  return `${base.getDate()}/${base.getMonth() + 1}/${base.getFullYear()} এর মধ্যে`;
}

export default function OrderTrackingScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, farmers } = useApp();

  const order = orders.find((o) => o.id === id);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  if (!order) {
    return (
      <View style={[styles.container, { paddingTop: (Platform.OS === "web" ? 67 : insets.top) + 12 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.light.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Feather name="alert-circle" size={40} color={colors.light.mutedForeground} />
          <Text style={styles.emptyText}>অর্ডার পাওয়া যায়নি</Text>
          <TouchableOpacity style={styles.goBackBtn} onPress={() => router.back()}>
            <Text style={styles.goBackBtnText}>ফিরে যান</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentStepIdx = ORDER_STEPS.findIndex((s) => s.key === order.status);
  const currentStep = ORDER_STEPS[currentStepIdx];
  const currentColor = STEP_COLORS[order.status] || colors.light.primary;
  const farmer = farmers.find((f) => String(f.id) === String(order.farmerId));
  const estimatedDelivery = getEstimatedDelivery(order.status, new Date(order.date).getTime());
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="arrow-left" size={20} color={colors.light.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>অর্ডার ট্র্যাকিং</Text>
          <Text style={styles.headerSub}>#{order.id.slice(-8).toUpperCase()}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Status Hero */}
        <View style={[styles.heroCard, { borderColor: currentColor + "40" }]}>
          <Animated.View style={[styles.heroIconWrap, { backgroundColor: currentColor + "20", transform: [{ scale: pulseAnim }] }]}>
            <Feather name={currentStep?.icon as any || "package"} size={36} color={currentColor} />
          </Animated.View>
          <Text style={[styles.heroStatus, { color: currentColor }]}>{currentStep?.label || order.status}</Text>
          <Text style={styles.heroDesc}>{currentStep?.desc || ""}</Text>

          {/* Info Pills */}
          <View style={styles.infoPillRow}>
            <View style={styles.infoPill}>
              <Feather name="hash" size={12} color={colors.light.mutedForeground} />
              <Text style={styles.infoPillText}>ট্র্যাকিং: {order.id.slice(-8).toUpperCase()}</Text>
            </View>
            <View style={styles.infoPill}>
              <Feather name="calendar" size={12} color={colors.light.mutedForeground} />
              <Text style={styles.infoPillText}>
                {new Date(order.date).toLocaleDateString("bn-BD")}
              </Text>
            </View>
          </View>
        </View>

        {/* Estimated Delivery */}
        {order.status !== "delivered" && (
          <View style={styles.estimateCard}>
            <Feather name="truck" size={18} color={colors.light.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.estimateLabel}>আনুমানিক ডেলিভারি</Text>
              <Text style={styles.estimateVal}>{estimatedDelivery}</Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>ট্র্যাকিং টাইমলাইন</Text>
          {ORDER_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const isPending = idx > currentStepIdx;
            const stepColor = isCurrent ? currentColor : isDone ? "#22c55e" : "#e5e7eb";
            const textColor = isPending ? colors.light.mutedForeground : colors.light.text;

            return (
              <View key={step.key} style={styles.timelineRow}>
                {/* Line */}
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: stepColor, borderColor: stepColor }]}>
                    {isDone && <Feather name="check" size={10} color="#fff" />}
                    {isCurrent && <Animated.View style={[styles.timelinePulse, { backgroundColor: currentColor, transform: [{ scale: pulseAnim }] }]} />}
                  </View>
                  {idx < ORDER_STEPS.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: idx < currentStepIdx ? "#22c55e" : "#e5e7eb" }]} />
                  )}
                </View>
                {/* Content */}
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, { color: textColor, fontWeight: isCurrent ? "700" : "500" }]}>
                    {step.label}
                    {isCurrent && <Text style={{ color: currentColor }}> ← এখন</Text>}
                  </Text>
                  {isCurrent && <Text style={styles.timelineDesc}>{step.desc}</Text>}
                </View>
              </View>
            );
          })}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>অর্ডার বিবরণ</Text>
          {order.items.map((item, i) => (
            <View key={i} style={styles.summaryRow}>
              <Text style={styles.summaryName}>{item.title}</Text>
              <Text style={styles.summaryQty}>{item.qty}× ৳{item.price}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>সাবটোটাল</Text>
            <Text style={styles.summaryVal}>৳{order.subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>ডেলিভারি</Text>
            <Text style={styles.summaryVal}>৳{order.deliveryCharge}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 4 }]}>
            <Text style={[styles.summaryKey, { fontWeight: "700", color: colors.light.text }]}>মোট</Text>
            <Text style={[styles.summaryVal, { fontWeight: "700", fontSize: 16, color: colors.light.primary }]}>৳{order.grandTotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>পেমেন্ট</Text>
            <Text style={styles.summaryVal}>{order.paymentMethod || "Cash on Delivery"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>ঠিকানা</Text>
            <Text style={[styles.summaryVal, { flex: 1, textAlign: "right" }]}>{order.customerAddress}</Text>
          </View>
        </View>

        {/* Farmer Info */}
        {farmer && (
          <View style={styles.farmerCard}>
            <Text style={styles.sectionTitle}>কৃষক তথ্য</Text>
            <View style={styles.farmerRow}>
              <View style={styles.farmerAvatar}>
                <Feather name="user" size={22} color={colors.light.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.farmerName}>{farmer.name}</Text>
                <Text style={styles.farmerLoc}>📍 {farmer.address}</Text>
                <Text style={styles.farmerProd}>🌾 {farmer.products}</Text>
              </View>
              <TouchableOpacity
                style={styles.waBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL(`https://wa.me/88${farmer.phone}?text=আমার অর্ডার ${order.id.slice(-8).toUpperCase()} সম্পর্কে জানতে চাই।`);
                }}
              >
                <Feather name="message-circle" size={14} color="#fff" />
                <Text style={styles.waBtnText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Help */}
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => Linking.openURL("https://wa.me/8801700000000?text=আমার অর্ডার %23" + order.id.slice(-8).toUpperCase() + " নিয়ে সাহায্য দরকার।")}
        >
          <Feather name="help-circle" size={16} color={colors.light.primary} />
          <Text style={styles.helpBtnText}>সাহায্য দরকার? WhatsApp করুন</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#f0f0f0",
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f0fdf4", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: colors.light.text, textAlign: "center" },
  headerSub: { fontSize: 12, color: colors.light.mutedForeground, textAlign: "center" },
  emptyText: { fontSize: 16, color: colors.light.mutedForeground },
  goBackBtn: { backgroundColor: colors.light.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  goBackBtnText: { color: "#fff", fontWeight: "700" },
  heroCard: {
    backgroundColor: "#fff", borderRadius: 20, padding: 24, alignItems: "center", gap: 8,
    marginBottom: 12, borderWidth: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8,
  },
  heroIconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  heroStatus: { fontSize: 22, fontWeight: "800" },
  heroDesc: { fontSize: 13, color: colors.light.mutedForeground, textAlign: "center" },
  infoPillRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  infoPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#f9fafb", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: "#e5e7eb",
  },
  infoPillText: { fontSize: 11, color: colors.light.mutedForeground },
  estimateCard: {
    backgroundColor: "#f0fdf4", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12,
    marginBottom: 12, borderWidth: 1, borderColor: "#bbf7d0",
  },
  estimateLabel: { fontSize: 12, color: colors.light.mutedForeground },
  estimateVal: { fontSize: 15, fontWeight: "700", color: colors.light.primary },
  timelineCard: { backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: colors.light.text, marginBottom: 14 },
  timelineRow: { flexDirection: "row", gap: 12 },
  timelineLeft: { alignItems: "center", width: 22 },
  timelineDot: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    alignItems: "center", justifyContent: "center",
  },
  timelinePulse: { width: 10, height: 10, borderRadius: 5 },
  timelineLine: { width: 2, flex: 1, minHeight: 24, marginTop: 2 },
  timelineContent: { flex: 1, paddingBottom: 20 },
  timelineLabel: { fontSize: 14 },
  timelineDesc: { fontSize: 12, color: colors.light.mutedForeground, marginTop: 2 },
  summaryCard: { backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  summaryName: { flex: 1, fontSize: 13, color: colors.light.text },
  summaryQty: { fontSize: 13, color: colors.light.mutedForeground },
  summaryKey: { fontSize: 13, color: colors.light.mutedForeground },
  summaryVal: { fontSize: 13, color: colors.light.text, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 6 },
  farmerCard: { backgroundColor: "#fff", borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6 },
  farmerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  farmerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#f0fdf4", alignItems: "center", justifyContent: "center" },
  farmerName: { fontSize: 15, fontWeight: "700", color: colors.light.text },
  farmerLoc: { fontSize: 12, color: colors.light.mutedForeground, marginTop: 2 },
  farmerProd: { fontSize: 12, color: colors.light.mutedForeground },
  waBtn: {
    backgroundColor: "#22c55e", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7,
    flexDirection: "row", alignItems: "center", gap: 4,
  },
  waBtnText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  helpBtn: {
    borderRadius: 14, paddingVertical: 14, alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 8, backgroundColor: "#fff",
    borderWidth: 1.5, borderColor: colors.light.primary + "40", marginBottom: 12,
  },
  helpBtnText: { fontSize: 14, color: colors.light.primary, fontWeight: "600" },
});
