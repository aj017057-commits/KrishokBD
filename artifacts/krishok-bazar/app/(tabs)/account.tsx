import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomerModal from "@/components/CustomerModal";
import FarmerModal from "@/components/FarmerModal";
import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { currentCustomer, currentFarmer, getCustomerOrders, getFarmerOrders, products } = useApp();
  const [showCustomer, setShowCustomer] = useState(false);
  const [showFarmer, setShowFarmer] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const customerOrders = currentCustomer ? getCustomerOrders(currentCustomer.id) : [];
  const farmerOrders = currentFarmer ? getFarmerOrders(currentFarmer.id) : [];

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>অ্যাকাউন্ট</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: bottomPad + 80 }}>
        {/* Customer Section */}
        <TouchableOpacity style={styles.panelCard} onPress={() => setShowCustomer(true)} activeOpacity={0.85}>
          <View style={styles.panelIcon}>
            <Feather name="user" size={24} color={colors.light.primary} />
          </View>
          <View style={styles.panelInfo}>
            {currentCustomer ? (
              <>
                <Text style={styles.panelTitle}>{currentCustomer.name}</Text>
                <Text style={styles.panelSub}>{currentCustomer.phone}</Text>
                <View style={styles.panelBadge}>
                  <Text style={styles.panelBadgeText}>{customerOrders.length}টি অর্ডার</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.panelTitle}>গ্রাহক প্যানেল</Text>
                <Text style={styles.panelSub}>লগইন বা রেজিস্ট্রেশন করুন</Text>
              </>
            )}
          </View>
          <Feather name="chevron-right" size={20} color={colors.light.mutedForeground} />
        </TouchableOpacity>

        {/* Farmer Section */}
        <TouchableOpacity style={styles.panelCard} onPress={() => setShowFarmer(true)} activeOpacity={0.85}>
          <View style={[styles.panelIcon, { backgroundColor: "#fef3c7" }]}>
            <Feather name="truck" size={24} color="#d97706" />
          </View>
          <View style={styles.panelInfo}>
            {currentFarmer ? (
              <>
                <Text style={styles.panelTitle}>{currentFarmer.name}</Text>
                <Text style={styles.panelSub}>{currentFarmer.address}</Text>
                <View style={[styles.panelBadge, { backgroundColor: "#fef3c7" }]}>
                  <Text style={[styles.panelBadgeText, { color: "#d97706" }]}>{farmerOrders.length}টি অর্ডার</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.panelTitle}>কৃষক প্যানেল</Text>
                <Text style={styles.panelSub}>পণ্য যোগ করুন ও অর্ডার দেখুন</Text>
                <View style={styles.demoHint}>
                  <Text style={styles.demoText}>ডেমো: 01700000001 / 1234</Text>
                </View>
              </>
            )}
          </View>
          <Feather name="chevron-right" size={20} color={colors.light.mutedForeground} />
        </TouchableOpacity>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Feather name="truck" size={20} color={colors.light.primary} />
            <Text style={styles.infoTitle}>ডেলিভারি</Text>
            <Text style={styles.infoText}>ঢাকা সিটি: ৳৬০{"\n"}ঢাকার বাইরে: ৳১২০{"\n"}৫ কেজি+ : অতিরিক্ত ৳৩০/কেজি</Text>
          </View>
          <View style={styles.infoCard}>
            <Feather name="phone" size={20} color={colors.light.primary} />
            <Text style={styles.infoTitle}>সাপোর্ট</Text>
            <Text style={styles.infoText}>01931-355398{"\n"}WhatsApp: +8801931355398{"\n"}সকাল ৮টা - রাত ১০টা</Text>
          </View>
        </View>

        {/* AI Feature Highlight */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Feather name="cpu" size={18} color={colors.light.primary} />
            <Text style={styles.aiTitle}>AI সহায়তা সক্রিয়</Text>
          </View>
          <Text style={styles.aiDesc}>
            রিক্তাজ AI চ্যাটবট — কৃষি, রেসিপি ও পারিবারিক সবজি পরিকল্পনায় সাহায্য করে।{"\n"}
            হোম স্ক্রিনে সবুজ বাটনে ক্লিক করুন।
          </Text>
        </View>

        {/* Recent Orders for Customer */}
        {currentCustomer && customerOrders.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>সাম্প্রতিক অর্ডার</Text>
            {customerOrders.slice(-3).reverse().map((o) => (
              <View key={o.id} style={styles.recentOrder}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recentProduct}>{o.productName}</Text>
                  <Text style={styles.recentMeta}>{o.qty} {o.unit} · {new Date(o.date).toLocaleDateString("bn-BD")}</Text>
                </View>
                <Text style={styles.recentAmount}>৳{o.grandTotal}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.viewAllBtn} onPress={() => setShowCustomer(true)}>
              <Text style={styles.viewAllText}>সব অর্ডার দেখুন</Text>
              <Feather name="arrow-right" size={14} color={colors.light.primary} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <CustomerModal visible={showCustomer} onClose={() => setShowCustomer(false)} />
      <FarmerModal visible={showFarmer} onClose={() => setShowFarmer(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: { fontSize: 22, fontWeight: "800" as const, color: colors.light.text },
  panelCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  panelIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.light.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  panelInfo: { flex: 1, gap: 2 },
  panelTitle: { fontSize: 16, fontWeight: "700" as const, color: colors.light.text },
  panelSub: { fontSize: 12, color: colors.light.mutedForeground },
  panelBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.light.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },
  panelBadgeText: { fontSize: 11, color: colors.light.primary, fontWeight: "600" as const },
  demoHint: {
    alignSelf: "flex-start",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  demoText: { fontSize: 10, color: "#92400e" },
  infoGrid: { flexDirection: "row", gap: 12 },
  infoCard: {
    flex: 1,
    backgroundColor: colors.light.primarySoft,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  infoTitle: { fontSize: 14, fontWeight: "700" as const, color: colors.light.primary },
  infoText: { fontSize: 11, color: colors.light.text, lineHeight: 18 },
  aiCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.light.primaryLight,
    gap: 8,
  },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  aiTitle: { fontSize: 15, fontWeight: "700" as const, color: colors.light.primary },
  aiDesc: { fontSize: 13, color: colors.light.text, lineHeight: 20 },
  recentSection: { gap: 10 },
  recentTitle: { fontSize: 16, fontWeight: "700" as const, color: colors.light.text },
  recentOrder: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.muted,
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  recentProduct: { fontSize: 14, fontWeight: "600" as const, color: colors.light.text },
  recentMeta: { fontSize: 11, color: colors.light.mutedForeground },
  recentAmount: { fontSize: 16, fontWeight: "800" as const, color: colors.light.primary },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.primary,
  },
  viewAllText: { fontSize: 14, color: colors.light.primary, fontWeight: "600" as const },
});
