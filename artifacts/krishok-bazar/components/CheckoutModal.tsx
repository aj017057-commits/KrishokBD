import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "form" | "success";

export default function CheckoutModal({ visible, onClose, onSuccess }: Props) {
  const insets = useSafeAreaInsets();
  const { cart, currentCustomer, checkout, products } = useApp();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"dhaka" | "outside">("dhaka");
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ grandTotal: number; deliveryCharge: number; orderId: string } | null>(null);

  useEffect(() => {
    if (visible) {
      setStep("form");
      setName(currentCustomer?.name ?? "");
      setPhone(currentCustomer?.phone ?? "");
      setAddress(currentCustomer?.address ?? "");
    }
  }, [visible, currentCustomer]);

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

  const handleConfirm = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("তথ্য অসম্পূর্ণ", "নাম, ফোন নম্বর ও ঠিকানা অবশ্যই পূরণ করুন।");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(phone.trim())) {
      Alert.alert("ভুল নম্বর", "সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = checkout(deliveryArea, name.trim(), phone.trim(), address.trim());
    setLoading(false);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLastOrder({ grandTotal: result.grandTotal, deliveryCharge: result.deliveryCharge, orderId: result.orderId });
      setStep("success");
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {step === "form" ? (
          <>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
              <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                <Feather name="arrow-left" size={22} color={colors.light.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>চেকআউট</Text>
              <View style={{ width: 38 }} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
              keyboardShouldPersistTaps="handled"
            >
              {/* Delivery Info */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Feather name="map-pin" size={16} color={colors.light.primary} />
                  <Text style={styles.sectionTitle}>ডেলিভারি ঠিকানা</Text>
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>সম্পূর্ণ নাম</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="আপনার পূর্ণ নাম"
                    placeholderTextColor={colors.light.mutedForeground}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>মোবাইল নম্বর</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="01XXXXXXXXX"
                    keyboardType="phone-pad"
                    placeholderTextColor={colors.light.mutedForeground}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>সম্পূর্ণ ঠিকানা</Text>
                  <TextInput
                    style={[styles.input, styles.inputMulti]}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="বাড়ি নং, রাস্তা, থানা, জেলা"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    placeholderTextColor={colors.light.mutedForeground}
                  />
                </View>
              </View>

              {/* Delivery Area */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Feather name="truck" size={16} color={colors.light.primary} />
                  <Text style={styles.sectionTitle}>ডেলিভারি এলাকা</Text>
                </View>
                <View style={styles.deliveryOptions}>
                  <TouchableOpacity
                    style={[styles.deliveryOpt, deliveryArea === "dhaka" && styles.deliveryOptActive]}
                    onPress={() => setDeliveryArea("dhaka")}
                  >
                    <View style={[styles.radio, deliveryArea === "dhaka" && styles.radioActive]}>
                      {deliveryArea === "dhaka" && <View style={styles.radioDot} />}
                    </View>
                    <View>
                      <Text style={[styles.deliveryOptTitle, deliveryArea === "dhaka" && styles.deliveryOptTitleActive]}>ঢাকা সিটি</Text>
                      <Text style={styles.deliveryOptSub}>৳৬০ (৫ কেজি পর্যন্ত)</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.deliveryOpt, deliveryArea === "outside" && styles.deliveryOptActive]}
                    onPress={() => setDeliveryArea("outside")}
                  >
                    <View style={[styles.radio, deliveryArea === "outside" && styles.radioActive]}>
                      {deliveryArea === "outside" && <View style={styles.radioDot} />}
                    </View>
                    <View>
                      <Text style={[styles.deliveryOptTitle, deliveryArea === "outside" && styles.deliveryOptTitleActive]}>ঢাকার বাইরে</Text>
                      <Text style={styles.deliveryOptSub}>৳১২০ (৫ কেজি পর্যন্ত)</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {weight > 5 && (
                  <View style={styles.extraInfo}>
                    <Feather name="info" size={12} color={colors.light.primary} />
                    <Text style={styles.extraInfoText}>
                      {weight.toFixed(1)} কেজি পণ্য — অতিরিক্ত ৳{extra} যোগ হয়েছে
                    </Text>
                  </View>
                )}
              </View>

              {/* Order Summary */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Feather name="shopping-bag" size={16} color={colors.light.primary} />
                  <Text style={styles.sectionTitle}>অর্ডার সারসংক্ষেপ ({cart.length}টি পণ্য)</Text>
                </View>
                {cart.map((item) => (
                  <View key={item.id} style={styles.orderItem}>
                    <Text style={styles.orderItemName} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.orderItemQty}>{item.qty} {item.unit}</Text>
                    <Text style={styles.orderItemPrice}>৳{item.price * item.qty}</Text>
                  </View>
                ))}
              </View>

              {/* Price Breakdown */}
              <View style={[styles.section, styles.priceSection]}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>পণ্যের মূল্য</Text>
                  <Text style={styles.priceValue}>৳{subtotal}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>ডেলিভারি চার্জ</Text>
                  <Text style={styles.priceValue}>৳{deliveryCharge}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.priceRow}>
                  <Text style={styles.totalLabel}>সর্বমোট পরিশোধ</Text>
                  <Text style={styles.totalValue}>৳{grandTotal}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
              <View style={styles.totalPreview}>
                <Text style={styles.totalPreviewLabel}>সর্বমোট</Text>
                <Text style={styles.totalPreviewValue}>৳{grandTotal}</Text>
              </View>
              <TouchableOpacity
                style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
                onPress={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Feather name="check-circle" size={18} color="#fff" />
                    <Text style={styles.confirmBtnText}>অর্ডার কনফার্ম করুন</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Success Screen
          <View style={[styles.successContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.successIcon}>
              <Feather name="check-circle" size={64} color={colors.light.primary} />
            </View>
            <Text style={styles.successTitle}>অর্ডার সফল হয়েছে!</Text>
            <Text style={styles.successSub}>আপনার অর্ডারটি গ্রহণ করা হয়েছে</Text>
            <View style={styles.orderIdBox}>
              <Text style={styles.orderIdLabel}>অর্ডার আইডি</Text>
              <Text style={styles.orderIdValue}>#{lastOrder?.orderId?.slice(-8).toUpperCase()}</Text>
            </View>
            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>মোট পরিশোধ</Text>
                <Text style={styles.successDetailValue}>৳{lastOrder?.grandTotal}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>ডেলিভারি চার্জ</Text>
                <Text style={styles.successDetailValue}>৳{lastOrder?.deliveryCharge}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>ঠিকানা</Text>
                <Text style={styles.successDetailValue} numberOfLines={2}>{address}</Text>
              </View>
            </View>
            <Text style={styles.successNote}>
              ✓ ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি দেওয়া হবে{"\n"}
              ✓ অর্ডার ট্র্যাক করুন "অ্যাকাউন্ট" ট্যাবে
            </Text>
            <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
              <Text style={styles.doneBtnText}>শপিং চালিয়ে যান</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: "#fff",
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.light.muted,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" as const, color: colors.light.text },
  scroll: { padding: 20, gap: 4 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700" as const, color: colors.light.text },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: "600" as const, color: colors.light.mutedForeground, textTransform: "uppercase" as const, letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.light.muted,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.light.text,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  inputMulti: { height: 80, paddingTop: 12 },
  deliveryOptions: { gap: 10 },
  deliveryOpt: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.light.border,
    backgroundColor: "#fff",
  },
  deliveryOptActive: {
    borderColor: colors.light.primary,
    backgroundColor: colors.light.primarySoft,
  },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: colors.light.border,
    alignItems: "center", justifyContent: "center",
  },
  radioActive: { borderColor: colors.light.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.light.primary },
  deliveryOptTitle: { fontSize: 14, fontWeight: "600" as const, color: colors.light.text },
  deliveryOptTitleActive: { color: colors.light.primary },
  deliveryOptSub: { fontSize: 11, color: colors.light.mutedForeground, marginTop: 1 },
  extraInfo: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.light.primarySoft, borderRadius: 8,
    padding: 8,
  },
  extraInfoText: { fontSize: 12, color: colors.light.primary, fontWeight: "500" as const },
  orderItem: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 6, gap: 8,
    borderBottomWidth: 1, borderBottomColor: colors.light.border,
  },
  orderItemName: { flex: 1, fontSize: 13, color: colors.light.text, fontWeight: "500" as const },
  orderItemQty: { fontSize: 12, color: colors.light.mutedForeground, width: 56 },
  orderItemPrice: { fontSize: 13, fontWeight: "700" as const, color: colors.light.primary, textAlign: "right" as const, width: 60 },
  priceSection: { gap: 10 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  priceLabel: { fontSize: 14, color: colors.light.mutedForeground },
  priceValue: { fontSize: 14, fontWeight: "600" as const, color: colors.light.text },
  divider: { height: 1, backgroundColor: colors.light.border },
  totalLabel: { fontSize: 16, fontWeight: "700" as const, color: colors.light.text },
  totalValue: { fontSize: 20, fontWeight: "800" as const, color: colors.light.primary },
  bottomBar: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: colors.light.border,
    backgroundColor: "#fff",
  },
  totalPreview: { gap: 1 },
  totalPreviewLabel: { fontSize: 11, color: colors.light.mutedForeground },
  totalPreviewValue: { fontSize: 18, fontWeight: "800" as const, color: colors.light.primary },
  confirmBtn: {
    flex: 1, backgroundColor: colors.light.primary,
    borderRadius: 16, paddingVertical: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" as const },
  successContainer: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 28, gap: 14,
  },
  successIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.light.primarySoft,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  successTitle: { fontSize: 26, fontWeight: "800" as const, color: colors.light.text },
  successSub: { fontSize: 14, color: colors.light.mutedForeground, textAlign: "center" as const },
  orderIdBox: {
    backgroundColor: colors.light.primarySoft,
    borderRadius: 14, padding: 16,
    alignItems: "center", gap: 4,
    width: "100%",
  },
  orderIdLabel: { fontSize: 11, color: colors.light.mutedForeground, textTransform: "uppercase" as const, letterSpacing: 1 },
  orderIdValue: { fontSize: 22, fontWeight: "800" as const, color: colors.light.primary },
  successDetails: {
    backgroundColor: colors.light.muted, borderRadius: 14, padding: 16,
    width: "100%", gap: 10,
  },
  successDetailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  successDetailLabel: { fontSize: 13, color: colors.light.mutedForeground },
  successDetailValue: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text, textAlign: "right" as const, flex: 1, marginLeft: 12 },
  successNote: {
    fontSize: 13, color: colors.light.primary,
    lineHeight: 22, textAlign: "center" as const,
    backgroundColor: colors.light.primarySoft,
    borderRadius: 12, padding: 14, width: "100%",
  },
  doneBtn: {
    backgroundColor: colors.light.primary,
    borderRadius: 16, paddingVertical: 14, paddingHorizontal: 40,
    width: "100%", alignItems: "center",
  },
  doneBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
});
