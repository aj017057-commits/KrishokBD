import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMG_HEIGHT = Math.min(340, SCREEN_WIDTH * 0.9);

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { products, addToCart, cart } = useApp();
  const [activeImg, setActiveImg] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>পণ্য পাওয়া যায়নি</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← ফিরে যান</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const gallery: string[] =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.img, product.img, product.img, product.img, product.img];

  const cartItem = cart.find((c) => c.id === product.id);
  const inCart = !!cartItem;

  function handleAdd() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToCart(product);
  }

  const bottomPad = Platform.OS === "web" ? 110 : insets.bottom + 84;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      >
        {/* Gallery */}
        <View style={styles.gallerySection}>
          <Image
            source={{ uri: gallery[activeImg] }}
            style={[styles.mainImg, { height: IMG_HEIGHT }]}
            resizeMode="cover"
          />

          {/* Back button */}
          <TouchableOpacity
            style={[styles.backCircle, { top: (Platform.OS === "web" ? 67 : insets.top) + 12 }]}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={20} color={colors.light.text} />
          </TouchableOpacity>

          {/* Badge */}
          {product.badge && (
            <View style={styles.imgBadge}>
              <Text style={styles.imgBadgeText}>{product.badge}</Text>
            </View>
          )}

          {/* Thumbnail strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbRow}
          >
            {gallery.map((img, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.thumb, activeImg === i && styles.thumbActive]}
                onPress={() => setActiveImg(i)}
              >
                <Image source={{ uri: img }} style={styles.thumbImg} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View style={styles.infoCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            {product.bestSeller && (
              <View style={styles.topBadge}>
                <Text style={styles.topBadgeText}>🔥 সেরা বিক্রিত</Text>
              </View>
            )}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>৳{product.price.toLocaleString()}</Text>
            <Text style={styles.unit}>/{product.unit}</Text>
          </View>

          <View style={styles.farmerRow}>
            <View style={styles.farmerAvatar}>
              <Feather name="user" size={14} color={colors.light.primary} />
            </View>
            <Text style={styles.farmerName}>{product.farmer}</Text>
            {product.badge && (
              <View style={styles.catBadge}>
                <Text style={styles.catBadgeText}>{product.badge}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.descTitle}>বিবরণ</Text>
          <Text style={styles.desc}>{product.desc}</Text>

          <View style={styles.divider} />

          {/* Delivery info */}
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryItem}>
              <Feather name="truck" size={16} color={colors.light.primary} />
              <Text style={styles.deliveryText}>ঢাকা: ৳৬০ · সারাদেশ: ৳১২০</Text>
            </View>
            <View style={styles.deliveryItem}>
              <Feather name="shield" size={16} color="#10b981" />
              <Text style={styles.deliveryText}>১০০% টাটকা গ্যারান্টি</Text>
            </View>
            <View style={styles.deliveryItem}>
              <Feather name="clock" size={16} color="#f59e0b" />
              <Text style={styles.deliveryText}>২৪-৪৮ ঘন্টায় ডেলিভারি</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Bar */}
      <View style={[styles.cartBar, { paddingBottom: (Platform.OS === "web" ? 18 : insets.bottom) + 10 }]}>
        {inCart ? (
          <View style={styles.alreadyInCart}>
            <Feather name="check-circle" size={18} color="#10b981" />
            <Text style={styles.alreadyText}>কার্টে আছে ({cartItem?.qty}টি)</Text>
            <TouchableOpacity
              style={styles.goCartBtn}
              onPress={() => router.push("/cart")}
            >
              <Text style={styles.goCartText}>কার্ট দেখুন</Text>
              <Feather name="arrow-right" size={14} color={colors.light.primary} />
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAdd}
          activeOpacity={0.85}
        >
          <Feather name="shopping-cart" size={18} color="#fff" />
          <Text style={styles.addBtnText}>
            {inCart ? "আরো যোগ করুন" : "কার্টে যোগ করুন"}
          </Text>
          <Text style={styles.addBtnPrice}>৳{product.price}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  notFoundText: { fontSize: 16, color: colors.light.mutedForeground },
  backBtn: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.light.primarySoft, borderRadius: 20 },
  backBtnText: { color: colors.light.primary, fontWeight: "700" as const },

  gallerySection: { backgroundColor: "#fff" },
  mainImg: { width: "100%" },
  backCircle: {
    position: "absolute", left: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 4,
  },
  imgBadge: {
    position: "absolute", top: 16, right: 16,
    backgroundColor: colors.light.primary,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  imgBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" as const },
  thumbRow: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  thumb: {
    width: 64, height: 64, borderRadius: 12, overflow: "hidden",
    borderWidth: 2, borderColor: "transparent",
  },
  thumbActive: { borderColor: colors.light.primary },
  thumbImg: { width: "100%", height: "100%" },

  infoCard: {
    margin: 12, backgroundColor: "#fff",
    borderRadius: 22, padding: 20,
    borderWidth: 1, borderColor: colors.light.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  title: { flex: 1, fontSize: 22, fontWeight: "800" as const, color: colors.light.text, lineHeight: 30 },
  topBadge: {
    backgroundColor: "#fef3c7", paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1, borderColor: "#fde68a",
  },
  topBadgeText: { fontSize: 11, color: "#92400e", fontWeight: "700" as const },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 10 },
  price: { fontSize: 32, fontWeight: "800" as const, color: colors.light.primary },
  unit: { fontSize: 15, color: colors.light.mutedForeground },
  farmerRow: {
    flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.light.border,
  },
  farmerAvatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.light.primarySoft,
    alignItems: "center", justifyContent: "center",
  },
  farmerName: { flex: 1, fontSize: 14, fontWeight: "600" as const, color: colors.light.text },
  catBadge: {
    backgroundColor: colors.light.primarySoft,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  catBadgeText: { fontSize: 11, color: colors.light.primary, fontWeight: "700" as const },
  divider: { height: 1, backgroundColor: colors.light.border, marginVertical: 14 },
  descTitle: { fontSize: 15, fontWeight: "700" as const, color: colors.light.text, marginBottom: 8 },
  desc: { fontSize: 14, color: colors.light.mutedForeground, lineHeight: 24 },
  deliveryInfo: { gap: 10 },
  deliveryItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  deliveryText: { fontSize: 13, color: colors.light.text },

  cartBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1, borderTopColor: colors.light.border,
    paddingHorizontal: 16, paddingTop: 12, gap: 8,
    shadowColor: "#000", shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 10,
  },
  alreadyInCart: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#f0fdf4", borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: "#bbf7d0",
  },
  alreadyText: { flex: 1, fontSize: 13, color: "#065f46", fontWeight: "600" as const },
  goCartBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
  },
  goCartText: { fontSize: 13, color: colors.light.primary, fontWeight: "700" as const },
  addBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    backgroundColor: colors.light.primary,
    paddingVertical: 14, borderRadius: 20,
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" as const, flex: 1, textAlign: "center" as const },
  addBtnPrice: {
    color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: "700" as const,
    backgroundColor: "rgba(0,0,0,0.15)",
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12,
  },
});
