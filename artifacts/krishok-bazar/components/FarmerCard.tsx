import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "@/constants/colors";
import { Farmer, SUPPORT_PHONE } from "@/constants/data";

interface Props {
  farmer: Farmer;
}

export default function FarmerCard({ farmer }: Props) {
  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`হ্যালো, আমি ${farmer.name} এর সাথে কথা বলতে চাই।`);
    Linking.openURL(`https://wa.me/${SUPPORT_PHONE}?text=${msg}`);
  };

  return (
    <View style={[styles.card, farmer.verified && styles.cardVerified]}>
      <View style={styles.avatarRow}>
        <Image source={{ uri: farmer.avatar }} style={styles.avatar} />
        {farmer.verified && (
          <View style={styles.verifiedBadge}>
            <Feather name="check-circle" size={12} color="#fff" />
          </View>
        )}
      </View>
      <Text style={styles.name}>{farmer.name}</Text>
      <Text style={styles.address}>{farmer.address}</Text>
      <View style={styles.ratingRow}>
        <Feather name="star" size={11} color="#f59e0b" />
        <Text style={styles.rating}>{farmer.rating}</Text>
        <Text style={styles.sales}>· {farmer.sales} বিক্রি</Text>
      </View>
      <Text style={styles.products} numberOfLines={2}>{farmer.products}</Text>
      <TouchableOpacity style={styles.waBtn} onPress={handleWhatsApp}>
        <Feather name="message-circle" size={12} color="#fff" />
        <Text style={styles.waBtnText}>WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardVerified: { borderColor: colors.light.primary, borderWidth: 2 },
  avatarRow: { position: "relative", marginBottom: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.light.muted },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.light.primary,
    borderRadius: 10,
    padding: 2,
  },
  name: { fontSize: 13, fontWeight: "700" as const, color: colors.light.text, textAlign: "center" },
  address: { fontSize: 10, color: colors.light.mutedForeground, marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3, marginBottom: 4 },
  rating: { fontSize: 11, fontWeight: "600" as const, color: colors.light.text },
  sales: { fontSize: 10, color: colors.light.mutedForeground },
  products: { fontSize: 10, color: colors.light.mutedForeground, textAlign: "center", marginBottom: 8 },
  waBtn: {
    backgroundColor: colors.light.whatsapp,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
    borderRadius: 20,
    width: "100%",
  },
  waBtnText: { color: "#fff", fontSize: 11, fontWeight: "600" as const },
});
