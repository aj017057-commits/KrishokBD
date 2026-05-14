import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "@/constants/colors";
import { CATEGORIES } from "@/constants/data";
import { useApp } from "@/context/AppContext";

export default function CategoryFilter() {
  const { activeCategory, setActiveCategory } = useApp();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          style={[styles.tab, activeCategory === cat.key && styles.tabActive]}
          onPress={() => setActiveCategory(cat.key)}
        >
          <Text style={[styles.label, activeCategory === cat.key && styles.labelActive]}>
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: "row",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: "#fff",
  },
  tabActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: colors.light.mutedForeground,
  },
  labelActive: {
    color: "#fff",
    fontWeight: "700" as const,
  },
});
