import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CheckoutModal from "@/components/CheckoutModal";
import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useRouter } from "expo-router";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { cart, updateQty, removeFromCart, products, cartCount } = useApp();
  const [showCheckout, setShowCheckout] = useState(false);

  const getWeight = () => {
    let total = 0;
    cart.forEach((item) => {
      const p = products.find((pr) => pr.id === item.id);
      if (!p) return;
      if (p.unit === "কেজি") total += item.qty;
      else if (p.unit === "পিস") total += item.qty * 0.5;
      else if (p.unit === "ডজন") total += item.qty * 1.5;
      else total += item.qty * 0.8;
    });
    return total;
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const weight = getWeight();
  const deliveryCharge = weight > 5 ? 60 + Math.round((weight - 5) * 30) : 60;
  const grandTotal = subtotal + deliveryCharge;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (cart.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>শপিং কার্ট</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Feather name="shopping-cart" size={52} color={colors.light.primary} />
          </View>
          <Text style={styles.emptyTitle}>আপনার কার্ট খালি</Text>
          <Text style={styles.emptySubtitle}>হোম স্ক্রিন থেকে তাজা পণ্য বেছে নিন</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.push("/")}>
            <Feather name="shopping-bag" size={16} color="#fff" />
            <Text style={styles.shopBtnText}>পণ্য দেখুন</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>শপিং কার্ট</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{cartCount}টি</Text>
        </View>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 200 }}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.img }} style={styles.itemImg} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemFarmer}>{item.farmer}</Text>
              <Text style={styles.itemUnitPrice}>৳{item.price}/{item.unit}</Text>
              <Text style={styles.itemSubtotal}>উপমোট: ৳{item.price * item.qty}</Text>
            </View>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQty(item.id, -1); }}
              >
                <Feather name="minus" size={14} color={colors.light.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQty(item.id, 1); }}
              >
                <Feather name="plus" size={14} color={colors.light.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFromCart(item.id)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Feather name="trash-2" size={14} color={colors.light.destructive} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Sticky Bottom Summary */}
      <View style={[styles.summary, { paddingBottom: bottomPad + 10 }]}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>পণ্যের মূল্য</Text>
            <Text style={styles.summaryValue}>৳{subtotal}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View>
            <Text style={styles.summaryLabel}>আনু. ডেলিভারি</Text>
            <Text style={styles.summaryValue}>৳{deliveryCharge}+</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View>
            <Text style={styles.summaryLabel}>আনু. মোট</Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>৳{grandTotal}+</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => setShowCheckout(true)}
        >
          <Feather name="credit-card" size={18} color="#fff" />
          <Text style={styles.checkoutBtnText}>চেকআউট করুন</Text>
          <Feather name="arrow-right" size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <Text style={styles.secureNote}>
          <Feather name="lock" size={11} color={colors.light.mutedForeground} /> সুরক্ষিত চেকআউট · নগদ অন ডেলিভারি
        </Text>
      </View>

      <CheckoutModal
        visible={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={() => setShowCheckout(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerRow: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 20, paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: colors.light.border,
  },
  headerTitle: { fontSize: 22, fontWeight: "800" as const, color: colors.light.text },
  countBadge: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20,
  },
  countBadgeText: { fontSize: 12, color: "#fff", fontWeight: "700" as const },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 40 },
  emptyIconBox: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.light.primarySoft,
    alignItems: "center", justifyContent: "center",
  },
  emptyTitle: { fontSize: 20, fontWeight: "700" as const, color: colors.light.text },
  emptySubtitle: { fontSize: 14, color: colors.light.mutedForeground, textAlign: "center" as const },
  shopBtn: {
    backgroundColor: colors.light.primary,
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14,
  },
  shopBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 14 },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1, borderColor: colors.light.border,
    overflow: "hidden",
    alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  itemImg: { width: 80, height: 80, backgroundColor: colors.light.muted },
  itemInfo: { flex: 1, padding: 10, gap: 2 },
  itemTitle: { fontSize: 14, fontWeight: "700" as const, color: colors.light.text },
  itemFarmer: { fontSize: 10, color: colors.light.mutedForeground },
  itemUnitPrice: { fontSize: 11, color: colors.light.mutedForeground },
  itemSubtotal: { fontSize: 14, fontWeight: "800" as const, color: colors.light.primary, marginTop: 4 },
  qtyControls: { alignItems: "center", paddingRight: 12, gap: 8 },
  qtyBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.light.primarySoft,
    borderWidth: 1, borderColor: colors.light.border,
    alignItems: "center", justifyContent: "center",
  },
  qtyText: { fontSize: 16, fontWeight: "700" as const, color: colors.light.text, minWidth: 24, textAlign: "center" as const },
  removeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#fee2e2",
    alignItems: "center", justifyContent: "center",
    marginTop: 2,
  },
  summary: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1, borderTopColor: colors.light.border,
    padding: 16, gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 8,
  },
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
  summaryLabel: { fontSize: 11, color: colors.light.mutedForeground, textAlign: "center" as const, marginBottom: 2 },
  summaryValue: { fontSize: 15, fontWeight: "700" as const, color: colors.light.text, textAlign: "center" as const },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.light.border },
  totalValue: { color: colors.light.primary },
  checkoutBtn: {
    backgroundColor: colors.light.primary,
    borderRadius: 16, paddingVertical: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  checkoutBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
  secureNote: { fontSize: 11, color: colors.light.mutedForeground, textAlign: "center" as const },
});
