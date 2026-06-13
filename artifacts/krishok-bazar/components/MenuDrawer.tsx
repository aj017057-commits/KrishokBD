import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import colors from "@/constants/colors";
import { CATEGORIES } from "@/constants/data";
import { useApp } from "@/context/AppContext";

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  onCustomer: () => void;
  onFarmer: () => void;
}

export default function MenuDrawer({
  visible,
  onClose,
  onCustomer,
  onFarmer,
}: MenuDrawerProps) {
  const { currentCustomer, currentFarmer, customerLogout, farmerLogout, setActiveCategory, products } = useApp();
  const adminPressCount = useRef(0);
  const adminPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleAdminTap() {
    adminPressCount.current += 1;
    if (adminPressTimer.current) clearTimeout(adminPressTimer.current);
    adminPressTimer.current = setTimeout(() => {
      adminPressCount.current = 0;
    }, 2000);
    if (adminPressCount.current >= 7) {
      adminPressCount.current = 0;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
      router.push("/admin");
    }
  }

  const cats = CATEGORIES.filter((c) => c.key !== "all");

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.drawer}>
        <View style={styles.drawerHandle} />

        {/* Brand */}
        <TouchableOpacity onPress={handleAdminTap} activeOpacity={0.9}>
          <View style={styles.brand}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.brandLogo}
            />
            <View>
              <Text style={styles.brandName}>কৃষক বাজার</Text>
              <Text style={styles.brandTagline}>সরাসরি কৃষকের কাছ থেকে</Text>
            </View>
          </View>
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Account section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>অ্যাকাউন্ট</Text>

            {currentCustomer ? (
              <View style={styles.loggedInCard}>
                <View style={styles.loggedInAvatar}>
                  <Feather name="user" size={20} color={colors.light.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.loggedInName}>{currentCustomer.name}</Text>
                  <Text style={styles.loggedInPhone}>{currentCustomer.phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={() => { customerLogout(); onClose(); }}
                >
                  <Feather name="log-out" size={14} color="#ef4444" />
                  <Text style={styles.logoutText}>লগআউট</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <MenuItem
                icon="user"
                label="গ্রাহক লগইন / রেজিস্ট্রেশন"
                color={colors.light.primary}
                onPress={() => { onClose(); onCustomer(); }}
              />
            )}

            {currentFarmer ? (
              <View style={[styles.loggedInCard, { backgroundColor: "#fef3c7", borderColor: "#fde68a" }]}>
                <View style={[styles.loggedInAvatar, { backgroundColor: "#fef3c7" }]}>
                  <Feather name="sun" size={20} color="#92400e" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.loggedInName, { color: "#92400e" }]}>{currentFarmer.name}</Text>
                  <Text style={styles.loggedInPhone}>কৃষক অ্যাকাউন্ট</Text>
                </View>
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={() => { farmerLogout(); onClose(); }}
                >
                  <Feather name="log-out" size={14} color="#ef4444" />
                  <Text style={styles.logoutText}>লগআউট</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <MenuItem
                icon="sun"
                label="কৃষক লগইন / রেজিস্ট্রেশন"
                color="#92400e"
                bgColor="#fef3c7"
                onPress={() => { onClose(); onFarmer(); }}
              />
            )}
          </View>

          {/* Quick nav */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>দ্রুত নেভিগেশন</Text>
            <MenuItem icon="home" label="হোম" onPress={() => { setActiveCategory("all"); onClose(); router.push("/"); }} />
            <MenuItem icon="grid" label="সব ক্যাটাগরি" onPress={() => { onClose(); router.push("/categories"); }} />
            <MenuItem icon="package" label="আমার অর্ডার" onPress={() => { onClose(); router.push("/orders"); }} />
            <MenuItem icon="shopping-cart" label="কার্ট" onPress={() => { onClose(); router.push("/cart"); }} />
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ক্যাটাগরি</Text>
            <View style={styles.catGrid}>
              {cats.map((c) => (
                <TouchableOpacity
                  key={c.key}
                  style={styles.catChip}
                  onPress={() => {
                    setActiveCategory(c.key);
                    onClose();
                    router.push("/");
                  }}
                >
                  <Text style={styles.catChipEmoji}>{c.emoji}</Text>
                  <Text style={styles.catChipLabel}>{c.label}</Text>
                  <Text style={styles.catChipCount}>
                    {products.filter((p) => p.cat === c.key).length}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Info */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>তথ্য</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoLine}>🚚 ঢাকা সিটি ডেলিভারি: ৳৬০</Text>
              <Text style={styles.infoLine}>📦 ঢাকার বাইরে: ৳১২০</Text>
              <Text style={styles.infoLine}>⚖️ ৫ কেজির বেশি: +৳৩০/কেজি</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

function MenuItem({
  icon,
  label,
  color = colors.light.text,
  bgColor = colors.light.primarySoft,
  onPress,
}: {
  icon: string;
  label: string;
  color?: string;
  bgColor?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.menuIconWrap, { backgroundColor: bgColor }]}>
        <Feather name={icon as any} size={16} color={color} />
      </View>
      <Text style={[styles.menuLabel, { color }]}>{label}</Text>
      <Feather name="chevron-right" size={15} color={colors.light.mutedForeground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: Platform.OS === "web" ? 360 : "82%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    paddingTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 20,
  },
  drawerHandle: {
    width: 36, height: 4,
    backgroundColor: colors.light.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    marginBottom: 8,
  },
  brandLogo: { width: 44, height: 44, borderRadius: 22 },
  brandName: { fontSize: 20, fontWeight: "800" as const, color: colors.light.primary },
  brandTagline: { fontSize: 11, color: colors.light.mutedForeground },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionLabel: {
    fontSize: 11, fontWeight: "700" as const, color: colors.light.mutedForeground,
    textTransform: "uppercase" as const, letterSpacing: 0.6,
    marginBottom: 8, marginTop: 8,
  },
  loggedInCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 12, borderRadius: 16,
    backgroundColor: colors.light.primarySoft,
    borderWidth: 1, borderColor: colors.light.border,
    marginBottom: 8,
  },
  loggedInAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
  },
  loggedInName: { fontSize: 14, fontWeight: "700" as const, color: colors.light.text },
  loggedInPhone: { fontSize: 12, color: colors.light.mutedForeground },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: "#fee2e2", borderRadius: 12,
  },
  logoutText: { fontSize: 11, color: "#ef4444", fontWeight: "700" as const },
  menuItem: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 10, paddingHorizontal: 4,
    borderBottomWidth: 1, borderBottomColor: colors.light.border,
  },
  menuIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: "600" as const },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: colors.light.border,
    backgroundColor: colors.light.muted,
  },
  catChipEmoji: { fontSize: 14 },
  catChipLabel: { fontSize: 12, color: colors.light.text, fontWeight: "600" as const },
  catChipCount: {
    fontSize: 10, color: colors.light.mutedForeground,
    backgroundColor: colors.light.border,
    paddingHorizontal: 5, paddingVertical: 1, borderRadius: 8,
  },
  infoBox: {
    backgroundColor: colors.light.muted, borderRadius: 14,
    padding: 14, gap: 6,
    borderWidth: 1, borderColor: colors.light.border,
  },
  infoLine: { fontSize: 13, color: colors.light.text, lineHeight: 22 },
});
