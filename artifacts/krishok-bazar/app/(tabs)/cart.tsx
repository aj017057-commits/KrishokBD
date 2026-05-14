import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomerModal from "@/components/CustomerModal";
import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { cart, updateQty, removeFromCart, checkout, currentCustomer, products, cartCount } = useApp();
  const [deliveryArea, setDeliveryArea] = useState<"dhaka" | "outside">("dhaka");
  const [showCustomer, setShowCustomer] = useState(false);

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
  const base = deliveryArea === "dhaka" ? 60 : 120;
  const extra = weight > 5 ? Math.round((weight - 5) * 30) : 0;
  const deliveryCharge = base + extra;
  const grandTotal = subtotal + deliveryCharge;

  const handleCheckout = () => {
    if (!currentCustomer) {
      Alert.alert("লগইন প্রয়োজন", "অর্ডার করতে প্রথমে গ্রাহক হিসেবে লগইন করুন", [
        { text: "লগইন করুন", onPress: () => setShowCustomer(true) },
        { text: "বাতিল", style: "cancel" },
      ]);
      return;
    }
    Alert.alert(
      "অর্ডার নিশ্চিত করুন",
      `মোট: ৳${grandTotal}\nডেলিভারি: ৳${deliveryCharge}\nগ্রাহক: ${currentCustomer.name}`,
      [
        { text: "বাতিল", style: "cancel" },
        {
          text: "কনফার্ম",
          onPress: () => {
            const result = checkout(deliveryArea);
            if (result.success) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("অর্ডার সম্পন্ন!", `মোট: ৳${result.grandTotal}\nডেলিভারি চার্জ: ৳${result.deliveryCharge}`);
            }
          },
        },
      ]
    );
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (cart.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>শপিং কার্ট</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Feather name="shopping-cart" size={64} color={colors.light.border} />
          <Text style={styles.emptyTitle}>কার্ট খালি</Text>
          <Text style={styles.emptySubtitle}>পণ্য যোগ করুন এবং অর্ডার করুন</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>শপিং কার্ট</Text>
        <Text style={styles.cartCount}>{cartCount}টি পণ্য</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 240 }}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.img }} style={styles.itemImg} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemFarmer}>{item.farmer}</Text>
              <Text style={styles.itemPrice}>৳{item.price}/{item.unit}</Text>
              <Text style={styles.itemSubtotal}>= ৳{item.price * item.qty}</Text>
            </View>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQty(item.id, -1); }}
              >
                <Feather name="minus" size={14} color={colors.light.text} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); updateQty(item.id, 1); }}
              >
                <Feather name="plus" size={14} color={colors.light.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFromCart(item.id)}
              >
                <Feather name="x" size={14} color={colors.light.destructive} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Summary Panel */}
      <View style={[styles.summary, { paddingBottom: bottomPad + 12 }]}>
        {/* Delivery Area */}
        <View style={styles.deliveryRow}>
          <Text style={styles.deliveryLabel}>ডেলিভারি এলাকা:</Text>
          <View style={styles.deliveryOptions}>
            {([["dhaka", "ঢাকা সিটি"], ["outside", "ঢাকার বাইরে"]] as [string, string][]).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.deliveryOpt, deliveryArea === key && styles.deliveryOptActive]}
                onPress={() => setDeliveryArea(key as "dhaka" | "outside")}
              >
                <Text style={[styles.deliveryOptText, deliveryArea === key && styles.deliveryOptTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.priceRows}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>পণ্যের মূল্য</Text>
            <Text style={styles.priceValue}>৳{subtotal}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>ডেলিভারি চার্জ</Text>
            <Text style={styles.priceValue}>৳{deliveryCharge}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>সর্বমোট</Text>
            <Text style={styles.totalValue}>৳{grandTotal}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Feather name="check-circle" size={18} color="#fff" />
          <Text style={styles.checkoutBtnText}>অর্ডার কনফার্ম করুন</Text>
        </TouchableOpacity>

        {!currentCustomer && (
          <TouchableOpacity style={styles.loginPrompt} onPress={() => setShowCustomer(true)}>
            <Feather name="info" size={14} color={colors.light.primary} />
            <Text style={styles.loginPromptText}>অর্ডার করতে লগইন করুন</Text>
          </TouchableOpacity>
        )}
      </View>

      <CustomerModal visible={showCustomer} onClose={() => setShowCustomer(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: { fontSize: 22, fontWeight: "800" as const, color: colors.light.text },
  cartCount: { fontSize: 13, color: colors.light.mutedForeground },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "700" as const, color: colors.light.text },
  emptySubtitle: { fontSize: 14, color: colors.light.mutedForeground },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: "hidden",
    alignItems: "center",
    gap: 12,
    padding: 10,
  },
  itemImg: { width: 70, height: 70, borderRadius: 10, backgroundColor: colors.light.muted },
  itemInfo: { flex: 1, gap: 2 },
  itemTitle: { fontSize: 14, fontWeight: "700" as const, color: colors.light.text },
  itemFarmer: { fontSize: 10, color: colors.light.mutedForeground },
  itemPrice: { fontSize: 13, color: colors.light.mutedForeground },
  itemSubtotal: { fontSize: 15, fontWeight: "800" as const, color: colors.light.primary },
  qtyControls: { alignItems: "center", gap: 6 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.light.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 16, fontWeight: "700" as const, color: colors.light.text },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  summary: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  deliveryRow: { gap: 6 },
  deliveryLabel: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text },
  deliveryOptions: { flexDirection: "row", gap: 8 },
  deliveryOpt: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    alignItems: "center",
  },
  deliveryOptActive: { borderColor: colors.light.primary, backgroundColor: colors.light.primarySoft },
  deliveryOptText: { fontSize: 12, fontWeight: "600" as const, color: colors.light.mutedForeground },
  deliveryOptTextActive: { color: colors.light.primary },
  priceRows: { gap: 4 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  priceLabel: { fontSize: 13, color: colors.light.mutedForeground },
  priceValue: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.light.border, paddingTop: 8, marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: "700" as const, color: colors.light.text },
  totalValue: { fontSize: 20, fontWeight: "800" as const, color: colors.light.primary },
  checkoutBtn: {
    backgroundColor: colors.light.primary,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  checkoutBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
  loginPrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  loginPromptText: { fontSize: 13, color: colors.light.primary, fontWeight: "600" as const },
});
