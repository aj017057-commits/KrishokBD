import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "@/constants/colors";
import { Product } from "@/constants/data";
import { useApp } from "@/context/AppContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart, cart } = useApp();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = cart.find((i) => i.id === product.id);

  const handleAddToCart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.img }} style={styles.image} resizeMode="cover" />
        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
        {inCart && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{inCart.qty}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
        <Text style={styles.farmer} numberOfLines={1}>
          <Feather name="user" size={9} color={colors.light.mutedForeground} /> {product.farmer}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>{product.desc}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>৳{product.price}</Text>
          <Text style={styles.unit}>/{product.unit}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, justAdded && styles.addBtnSuccess]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          {justAdded ? (
            <>
              <Feather name="check" size={13} color="#fff" />
              <Text style={styles.addBtnText}>যোগ হয়েছে!</Text>
            </>
          ) : (
            <>
              <Feather name="shopping-cart" size={13} color="#fff" />
              <Text style={styles.addBtnText}>কার্টে যোগ করুন</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: { position: "relative" },
  image: { width: "100%", aspectRatio: 1, backgroundColor: colors.light.muted },
  badge: {
    position: "absolute", top: 6, left: 6,
    backgroundColor: colors.light.primary,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 9, color: "#fff", fontWeight: "600" as const },
  cartBadge: {
    position: "absolute", top: 6, right: 6,
    backgroundColor: "#e53935",
    width: 20, height: 20, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  cartBadgeText: { fontSize: 10, color: "#fff", fontWeight: "700" as const },
  info: { padding: 10, gap: 4 },
  title: { fontSize: 13, fontWeight: "700" as const, color: colors.light.text },
  farmer: { fontSize: 10, color: colors.light.mutedForeground },
  desc: { fontSize: 10, color: colors.light.mutedForeground, lineHeight: 15 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 2, marginTop: 2 },
  price: { fontSize: 16, fontWeight: "800" as const, color: colors.light.primary },
  unit: { fontSize: 11, color: colors.light.mutedForeground },
  addBtn: {
    backgroundColor: colors.light.primary,
    borderRadius: 22, paddingVertical: 8,
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 5, marginTop: 4,
  },
  addBtnSuccess: { backgroundColor: "#16a34a" },
  addBtnText: { color: "#fff", fontSize: 11, fontWeight: "700" as const },
});
