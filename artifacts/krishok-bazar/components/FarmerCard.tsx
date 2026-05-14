import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import colors from "@/constants/colors";
import { Farmer } from "@/constants/data";

const MALE_LOGO = require("@/assets/images/farmer-male.png");
const FEMALE_LOGO = require("@/assets/images/farmer-female.png");

interface Props {
  farmer: Farmer;
}

export default function FarmerCard({ farmer }: Props) {
  const avatar = farmer.gender === "female" ? FEMALE_LOGO : MALE_LOGO;

  return (
    <View style={[styles.card, farmer.verified && styles.cardVerified]}>
      <View style={styles.avatarRow}>
        <Image source={avatar} style={styles.avatar} resizeMode="cover" />
        {farmer.verified && (
          <View style={styles.verifiedBadge}>
            <Feather name="check" size={10} color="#fff" />
          </View>
        )}
      </View>
      <Text style={styles.name}>{farmer.name}</Text>
      <View style={styles.locationRow}>
        <Feather name="map-pin" size={10} color={colors.light.mutedForeground} />
        <Text style={styles.address}>{farmer.address}</Text>
      </View>
      <View style={styles.ratingRow}>
        <Feather name="star" size={11} color="#f59e0b" />
        <Text style={styles.rating}>{farmer.rating}</Text>
        <Text style={styles.sales}>· {farmer.sales} বিক্রি</Text>
      </View>
      <Text style={styles.products} numberOfLines={2}>{farmer.products}</Text>
      <View style={styles.verifiedTag}>
        <Feather name="shield" size={10} color={colors.light.primary} />
        <Text style={styles.verifiedTagText}>
          {farmer.verified ? "যাচাইকৃত কৃষক" : "নতুন কৃষক"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    gap: 4,
  },
  cardVerified: { borderColor: colors.light.primary, borderWidth: 1.5 },
  avatarRow: { position: "relative", marginBottom: 4 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.light.muted,
  },
  verifiedBadge: {
    position: "absolute", bottom: 2, right: 2,
    backgroundColor: colors.light.primary,
    borderRadius: 10, width: 20, height: 20,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  name: { fontSize: 13, fontWeight: "700" as const, color: colors.light.text, textAlign: "center" as const },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  address: { fontSize: 10, color: colors.light.mutedForeground },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  rating: { fontSize: 11, fontWeight: "600" as const, color: colors.light.text },
  sales: { fontSize: 10, color: colors.light.mutedForeground },
  products: { fontSize: 10, color: colors.light.mutedForeground, textAlign: "center" as const },
  verifiedTag: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: colors.light.primarySoft,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20,
    marginTop: 4,
  },
  verifiedTagText: { fontSize: 10, color: colors.light.primary, fontWeight: "600" as const },
});
