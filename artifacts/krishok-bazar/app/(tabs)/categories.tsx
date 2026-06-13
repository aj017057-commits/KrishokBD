import { router } from "expo-router";
import React from "react";
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
import { CATEGORIES } from "@/constants/data";
import { useApp } from "@/context/AppContext";

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { products, setActiveCategory } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const cats = CATEGORIES.filter((c) => c.key !== "all");

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={styles.headerTitle}>ক্যাটাগরি</Text>
        <Text style={styles.headerSub}>তাজা পণ্যের সব বিভাগ</Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: Platform.OS === "web" ? 110 : 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {cats.map((c, i) => {
          const count = products.filter((p) => p.cat === c.key).length;
          const colors2 = CAT_COLORS[i % CAT_COLORS.length];
          return (
            <TouchableOpacity
              key={c.key}
              style={[styles.card, { backgroundColor: colors2.bg }]}
              activeOpacity={0.82}
              onPress={() => {
                setActiveCategory(c.key);
                router.push("/");
              }}
            >
              <Text style={styles.cardEmoji}>{c.emoji}</Text>
              <Text style={[styles.cardLabel, { color: colors2.text }]}>
                {c.label}
              </Text>
              <View style={[styles.countBadge, { backgroundColor: colors2.badge }]}>
                <Text style={[styles.countText, { color: colors2.text }]}>
                  {count} পণ্য
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const CAT_COLORS = [
  { bg: "#ecfdf5", text: "#065f46", badge: "#d1fae5" },
  { bg: "#fef3c7", text: "#92400e", badge: "#fde68a" },
  { bg: "#eff6ff", text: "#1e40af", badge: "#dbeafe" },
  { bg: "#fdf2f8", text: "#831843", badge: "#fce7f3" },
  { bg: "#fff7ed", text: "#9a3412", badge: "#fed7aa" },
  { bg: "#f0fdf4", text: "#14532d", badge: "#bbf7d0" },
  { bg: "#fefce8", text: "#713f12", badge: "#fef08a" },
  { bg: "#f5f3ff", text: "#4c1d95", badge: "#e9d5ff" },
  { bg: "#fef2f2", text: "#7f1d1d", badge: "#fecaca" },
  { bg: "#ecfeff", text: "#164e63", badge: "#cffafe" },
  { bg: "#f7fee7", text: "#3f6212", badge: "#d9f99d" },
];

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: colors.light.primary,
  },
  headerSub: {
    fontSize: 13,
    color: colors.light.mutedForeground,
    marginTop: 2,
  },
  grid: {
    padding: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardEmoji: { fontSize: 40 },
  cardLabel: { fontSize: 16, fontWeight: "700" as const, textAlign: "center" as const },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 2,
  },
  countText: { fontSize: 12, fontWeight: "600" as const },
});
