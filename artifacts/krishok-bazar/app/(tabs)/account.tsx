import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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
import FarmerModal from "@/components/FarmerModal";
import WithdrawalModal from "@/components/WithdrawalModal";
import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { currentCustomer, currentFarmer, getCustomerOrders, getFarmerOrders, getFarmerProducts } = useApp();
  const [showCustomer, setShowCustomer] = useState(false);
  const [showFarmer, setShowFarmer] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const customerOrders = currentCustomer ? getCustomerOrders(currentCustomer.id) : [];
  const farmerOrders = currentFarmer ? getFarmerOrders(currentFarmer.id) : [];
  const farmerProducts = currentFarmer ? getFarmerProducts(currentFarmer.id) : [];
  const totalRevenue = farmerOrders.reduce((s, o) => s + o.subtotal, 0);
  const totalCustomerSpent = customerOrders.reduce((s, o) => s + o.grandTotal, 0);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>অ্যাকাউন্ট</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: bottomPad + 80 }}>

        {/* Customer Panel Card */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>গ্রাহক প্যানেল</Text>
        </View>
        <TouchableOpacity
          style={[styles.panelCard, currentCustomer && styles.panelCardActive]}
          onPress={() => setShowCustomer(true)}
          activeOpacity={0.88}
        >
          <View style={styles.panelIconBox}>
            <Feather name="user" size={22} color={colors.light.primary} />
          </View>
          {currentCustomer ? (
            <View style={styles.panelContent}>
              <Text style={styles.panelName}>{currentCustomer.name}</Text>
              <Text style={styles.panelSub}>{currentCustomer.phone}</Text>
              <View style={styles.miniStats}>
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatNum}>{customerOrders.length}</Text>
                  <Text style={styles.miniStatLabel}>অর্ডার</Text>
                </View>
                <View style={styles.miniStatDiv} />
                <View style={styles.miniStat}>
                  <Text style={styles.miniStatNum}>৳{totalCustomerSpent}</Text>
                  <Text style={styles.miniStatLabel}>ব্যয়</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.panelContent}>
              <Text style={styles.panelName}>গ্রাহক হিসেবে লগইন করুন</Text>
              <Text style={styles.panelSub}>অর্ডার ট্র্যাক করুন, ইতিহাস দেখুন</Text>
            </View>
          )}
          <Feather name="chevron-right" size={20} color={colors.light.mutedForeground} />
        </TouchableOpacity>

        {/* Farmer Panel Card */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>কৃষক প্যানেল</Text>
        </View>
        <TouchableOpacity
          style={[styles.panelCard, styles.farmerCard, currentFarmer && styles.panelCardActive]}
          onPress={() => setShowFarmer(true)}
          activeOpacity={0.88}
        >
          <View style={[styles.panelIconBox, styles.farmerIconBox]}>
            <Feather name="sun" size={22} color="#d97706" />
          </View>
          {currentFarmer ? (
            <View style={styles.panelContent}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={styles.panelName}>{currentFarmer.name}</Text>
                {currentFarmer.verified && <Feather name="check-circle" size={14} color={colors.light.primary} />}
              </View>
              <Text style={styles.panelSub}>{currentFarmer.address}</Text>
              <View style={styles.miniStats}>
                <View style={styles.miniStat}>
                  <Text style={[styles.miniStatNum, { color: "#d97706" }]}>{farmerProducts.length}</Text>
                  <Text style={styles.miniStatLabel}>পণ্য</Text>
                </View>
                <View style={styles.miniStatDiv} />
                <View style={styles.miniStat}>
                  <Text style={[styles.miniStatNum, { color: "#d97706" }]}>{farmerOrders.length}</Text>
                  <Text style={styles.miniStatLabel}>অর্ডার</Text>
                </View>
                <View style={styles.miniStatDiv} />
                <View style={styles.miniStat}>
                  <Text style={[styles.miniStatNum, { color: "#d97706" }]}>৳{totalRevenue}</Text>
                  <Text style={styles.miniStatLabel}>আয়</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.panelContent}>
              <Text style={styles.panelName}>কৃষক হিসেবে যোগ দিন</Text>
              <Text style={styles.panelSub}>পণ্য লিস্ট করুন, AI দিয়ে আপলোড করুন</Text>
              <View style={styles.demoTag}>
                <Text style={styles.demoTagText}>ডেমো: 01700000001 / পাসওয়ার্ড: 1234</Text>
              </View>
            </View>
          )}
          <Feather name="chevron-right" size={20} color={colors.light.mutedForeground} />
        </TouchableOpacity>

        {/* Farmer Withdrawal Button */}
        {currentFarmer && (
          <TouchableOpacity
            style={styles.withdrawalBtn}
            onPress={() => setShowWithdrawal(true)}
            activeOpacity={0.88}
          >
            <View style={styles.withdrawalBtnIcon}>
              <Feather name="credit-card" size={20} color="#16a34a" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.withdrawalBtnTitle}>উপার্জন উত্তোলন করুন</Text>
              <Text style={styles.withdrawalBtnSub}>
                মোট আয়: ৳{totalRevenue.toLocaleString()} · bKash / Nagad / Rocket
              </Text>
            </View>
            <Feather name="arrow-right" size={18} color="#16a34a" />
          </TouchableOpacity>
        )}

        {/* Recent Orders */}
        {currentCustomer && customerOrders.length > 0 && (
          <>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>সাম্প্রতিক অর্ডার</Text>
            </View>
            {customerOrders.slice(-3).reverse().map((o) => (
              <View key={o.id} style={styles.recentOrder}>
                <View style={styles.recentOrderLeft}>
                  <Text style={styles.recentOrderId}>#{o.id.slice(-6).toUpperCase()}</Text>
                  <Text style={styles.recentOrderItems} numberOfLines={1}>
                    {o.items.map(i => i.title).join(", ")}
                  </Text>
                  <Text style={styles.recentOrderDate}>{new Date(o.date).toLocaleDateString("bn-BD")}</Text>
                </View>
                <View style={styles.recentOrderRight}>
                  <Text style={styles.recentOrderAmount}>৳{o.grandTotal}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>কনফার্ম</Text>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.viewAllBtn} onPress={() => setShowCustomer(true)}>
              <Text style={styles.viewAllBtnText}>সব অর্ডার দেখুন</Text>
              <Feather name="arrow-right" size={14} color={colors.light.primary} />
            </TouchableOpacity>
          </>
        )}

        {/* Info Cards */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>তথ্য</Text>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Feather name="truck" size={18} color={colors.light.primary} />
            <Text style={styles.infoTitle}>ডেলিভারি নীতি</Text>
            <Text style={styles.infoBody}>ঢাকা সিটি: ৳৬০{"\n"}ঢাকার বাইরে: ৳১২০{"\n"}৫ কেজি+: ৳৩০/কেজি</Text>
          </View>
          <View style={styles.infoCard}>
            <Feather name="package" size={18} color={colors.light.primary} />
            <Text style={styles.infoTitle}>পেমেন্ট পদ্ধতি</Text>
            <Text style={styles.infoBody}>ক্যাশ অন ডেলিভারি{"\n"}বিকাশ{"\n"}নগদ</Text>
          </View>
        </View>

        {/* AI Feature Banner */}
        <View style={styles.aiBanner}>
          <Image source={require("@/assets/images/icon.png")} style={styles.aiBannerIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.aiBannerTitle}>রিক্তাজ AI সহায়ক</Text>
            <Text style={styles.aiBannerBody}>
              পরিবারের সাইজ বললে সাপ্তাহিক সবজির তালিকা তৈরি করে দেবে। রেসিপি ও পুষ্টিতথ্যও জানতে পারবেন।
            </Text>
          </View>
        </View>
      </ScrollView>

      <CustomerModal visible={showCustomer} onClose={() => setShowCustomer(false)} />
      <FarmerModal visible={showFarmer} onClose={() => setShowFarmer(false)} />
      {currentFarmer && (
        <WithdrawalModal
          visible={showWithdrawal}
          onClose={() => setShowWithdrawal(false)}
          farmerId={currentFarmer.id}
          farmerName={currentFarmer.name}
          availableBalance={totalRevenue}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerRow: {
    paddingHorizontal: 20, paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: colors.light.border,
  },
  headerTitle: { fontSize: 22, fontWeight: "800" as const, color: colors.light.text },
  sectionLabel: { flexDirection: "row", alignItems: "center" },
  sectionLabelText: {
    fontSize: 12, fontWeight: "700" as const,
    color: colors.light.mutedForeground, textTransform: "uppercase" as const, letterSpacing: 0.8,
  },
  panelCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#fff", borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: colors.light.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  farmerCard: { borderColor: "#fde68a" },
  panelCardActive: { borderColor: colors.light.primary, borderWidth: 1.5 },
  panelIconBox: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.light.primarySoft, alignItems: "center", justifyContent: "center",
  },
  farmerIconBox: { backgroundColor: "#fef3c7" },
  panelContent: { flex: 1, gap: 3 },
  panelName: { fontSize: 15, fontWeight: "700" as const, color: colors.light.text },
  panelSub: { fontSize: 12, color: colors.light.mutedForeground },
  miniStats: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  miniStat: { alignItems: "center" },
  miniStatDiv: { width: 1, height: 18, backgroundColor: colors.light.border },
  miniStatNum: { fontSize: 14, fontWeight: "800" as const, color: colors.light.primary },
  miniStatLabel: { fontSize: 9, color: colors.light.mutedForeground },
  demoTag: {
    alignSelf: "flex-start", backgroundColor: "#fef3c7",
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 4,
  },
  demoTagText: { fontSize: 10, color: "#92400e" },
  withdrawalBtn: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: "#f0fdf4", borderRadius: 18, padding: 16,
    borderWidth: 1.5, borderColor: "#86efac",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  withdrawalBtnIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#dcfce7", alignItems: "center", justifyContent: "center",
  },
  withdrawalBtnTitle: { fontSize: 15, fontWeight: "700" as const, color: "#166534" },
  withdrawalBtnSub: { fontSize: 12, color: "#16a34a", marginTop: 2 },
  recentOrder: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: colors.light.border,
  },
  recentOrderLeft: { flex: 1, gap: 2 },
  recentOrderId: { fontSize: 11, fontWeight: "700" as const, color: colors.light.primary },
  recentOrderItems: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text },
  recentOrderDate: { fontSize: 10, color: colors.light.mutedForeground },
  recentOrderRight: { alignItems: "flex-end", gap: 6 },
  recentOrderAmount: { fontSize: 16, fontWeight: "800" as const, color: colors.light.primary },
  statusBadge: { backgroundColor: colors.light.primarySoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  statusBadgeText: { fontSize: 10, color: colors.light.primary, fontWeight: "600" as const },
  viewAllBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: 11, borderRadius: 14,
    borderWidth: 1, borderColor: colors.light.primary,
    backgroundColor: colors.light.primarySoft,
  },
  viewAllBtnText: { fontSize: 13, color: colors.light.primary, fontWeight: "700" as const },
  infoGrid: { flexDirection: "row", gap: 12 },
  infoCard: {
    flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 14, gap: 6,
    borderWidth: 1, borderColor: colors.light.border,
  },
  infoTitle: { fontSize: 13, fontWeight: "700" as const, color: colors.light.text },
  infoBody: { fontSize: 12, color: colors.light.mutedForeground, lineHeight: 19 },
  aiBanner: {
    flexDirection: "row", alignItems: "flex-start", gap: 14,
    backgroundColor: colors.light.primarySoft, borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: colors.light.primaryLight,
  },
  aiBannerIcon: { width: 44, height: 44, borderRadius: 22 },
  aiBannerTitle: { fontSize: 15, fontWeight: "700" as const, color: colors.light.primary, marginBottom: 4 },
  aiBannerBody: { fontSize: 12, color: colors.light.text, lineHeight: 18 },
});
