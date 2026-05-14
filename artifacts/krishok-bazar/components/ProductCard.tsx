import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import { Product } from "@/constants/data";
import { SUPPORT_PHONE } from "@/constants/data";
import { useApp } from "@/context/AppContext";

interface Props {
  product: Product;
  onPress?: (product: Product) => void;
}

export default function ProductCard({ product, onPress }: Props) {
  const { addToCart } = useApp();

  const handleAddToCart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToCart(product);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `অর্ডার:\nপণ্য: ${product.title}\nদাম: ৳${product.price}/${product.unit}\nকৃষক: ${product.farmer}`
    );
    Linking.openURL(`https://wa.me/${SUPPORT_PHONE}?text=${msg}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(product)} activeOpacity={0.88}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.img }} style={styles.image} resizeMode="cover" />
        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
        <Text style={styles.farmer} numberOfLines={1}>{product.farmer}</Text>
        <Text style={styles.price}>
          ৳ {product.price}
          <Text style={styles.unit}>/{product.unit}</Text>
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
            <Feather name="shopping-cart" size={11} color="#fff" />
            <Text style={styles.cartBtnText}>কার্টে</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.waBtn} onPress={handleWhatsApp}>
            <Feather name="phone" size={11} color="#fff" />
            <Text style={styles.waBtnText}>অর্ডার</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: { position: "relative" },
  image: { width: "100%", aspectRatio: 1, backgroundColor: colors.light.muted },
  badge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: colors.light.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: { fontSize: 8, color: "#fff", fontWeight: "600" as const },
  info: { padding: 8 },
  title: { fontSize: 13, fontWeight: "700" as const, color: colors.light.text, marginBottom: 1 },
  farmer: { fontSize: 9, color: colors.light.mutedForeground, marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "800" as const, color: colors.light.primary, marginBottom: 6 },
  unit: { fontSize: 10, fontWeight: "400" as const, color: colors.light.mutedForeground },
  actions: { flexDirection: "row", gap: 5 },
  cartBtn: {
    flex: 1,
    backgroundColor: colors.light.primary,
    borderRadius: 20,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  cartBtnText: { color: "#fff", fontSize: 10, fontWeight: "600" as const },
  waBtn: {
    flex: 1,
    backgroundColor: colors.light.whatsapp,
    borderRadius: 20,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  waBtnText: { color: "#fff", fontSize: 10, fontWeight: "600" as const },
});
