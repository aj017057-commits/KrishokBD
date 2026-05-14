import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ChatBotModal from "@/components/ChatBotModal";
import CustomerModal from "@/components/CustomerModal";
import FarmerCard from "@/components/FarmerCard";
import FarmerModal from "@/components/FarmerModal";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import colors from "@/constants/colors";
import { BEST_SELLERS, CATEGORIES, Product, VIDEO_IDS } from "@/constants/data";
import { useApp } from "@/context/AppContext";

const MALE_LOGO = require("@/assets/images/farmer-male.png");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { products, farmers, searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useApp();
  const [showCustomer, setShowCustomer] = useState(false);
  const [showFarmer, setShowFarmer] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") list = list.filter((p) => p.cat === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.farmer.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, activeCategory, searchQuery]);

  const bestSellers = useMemo(() => {
    return BEST_SELLERS.map((bs) => {
      const prod = products.find((p) => p.cat === bs.cat && p.bestSeller);
      return prod ? { ...bs, product: prod } : null;
    }).filter(Boolean) as Array<(typeof BEST_SELLERS)[number] & { product: Product }>;
  }, [products]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.logoArea}>
          <Image source={require("@/assets/images/icon.png")} style={styles.logoImg} />
          <View>
            <Text style={styles.brandName}>কৃষক বাজার</Text>
            <Text style={styles.brandTagline}>সরাসরি কৃষকের কাছ থেকে</Text>
          </View>
        </View>
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowCustomer(true)}>
            <Image source={MALE_LOGO} style={styles.headerIconImg} resizeMode="cover" />
            <Text style={styles.headerIconLabel}>গ্রাহক</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerIconBtn, styles.headerIconBtnFarmer]} onPress={() => setShowFarmer(true)}>
            <Image source={MALE_LOGO} style={styles.headerIconImg} resizeMode="cover" />
            <Text style={[styles.headerIconLabel, styles.headerIconLabelFarmer]}>কৃষক</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={colors.light.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder="পণ্য, কৃষক বা বিবরণ খুঁজুন..."
            placeholderTextColor={colors.light.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x-circle" size={16} color={colors.light.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 110 : 90 }}
      >
        {/* ── Hero Carousel (only when not searching) ── */}
        {!isSearching && <HeroCarousel onOrderPress={() => {}} />}

        {/* ── Category Tabs ── */}
        <CategoryTabs />

        {/* ── BEST SELLERS (only on "all" tab, not searching) ── */}
        {!isSearching && activeCategory === "all" && bestSellers.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>সেরা বিক্রিত</Text>
                <View style={styles.hotBadge}>
                  <Text style={styles.hotBadgeText}>🔥 TOP</Text>
                </View>
              </View>
              <Text style={styles.sectionSub}>ক্যাটাগরি অনুযায়ী</Text>
            </View>
            <FlatList
              data={bestSellers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.cat}
              contentContainerStyle={styles.bestSellerList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.bsCard}
                  onPress={() => setActiveCategory(item.cat)}
                  activeOpacity={0.88}
                >
                  <View style={styles.bsImgWrap}>
                    <Image
                      source={{ uri: item.product.img }}
                      style={styles.bsImg}
                      resizeMode="cover"
                    />
                    <View style={styles.bsEmojiWrap}>
                      <Text style={styles.bsEmoji}>{item.emoji}</Text>
                    </View>
                    <View style={styles.bsTopBadge}>
                      <Text style={styles.bsTopBadgeText}>সেরা</Text>
                    </View>
                  </View>
                  <View style={styles.bsInfo}>
                    <Text style={styles.bsCatLabel}>{item.label}</Text>
                    <Text style={styles.bsProductName} numberOfLines={1}>
                      {item.product.title}
                    </Text>
                    <Text style={styles.bsPrice}>
                      ৳{item.product.price}
                      <Text style={styles.bsUnit}>/{item.product.unit}</Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ── Product Grid ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>
                {isSearching
                  ? `"${searchQuery}" খোঁজার ফলাফল`
                  : activeCategory === "all"
                  ? "সব পণ্য"
                  : CATEGORIES.find((c) => c.key === activeCategory)?.label ?? activeCategory}
              </Text>
            </View>
            <Text style={styles.sectionSub}>{filtered.length}টি পণ্য</Text>
          </View>

          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>কোনো পণ্য পাওয়া যায়নি</Text>
              <TouchableOpacity
                onPress={() => { setSearchQuery(""); setActiveCategory("all"); }}
              >
                <Text style={styles.emptyLink}>সব পণ্য দেখুন</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.grid}>
              {filtered.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <ProductCard product={item} />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Farmers ── */}
        {!isSearching && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>যাচাইকৃত কৃষক</Text>
              </View>
              <Text style={styles.sectionSub}>{farmers.length}+ কৃষক</Text>
            </View>
            <FlatList
              data={farmers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => <FarmerCard farmer={item} />}
            />
          </View>
        )}

        {/* ── YouTube Videos ── */}
        {!isSearching && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>খেত থেকে লাইভ</Text>
              </View>
              <Text style={styles.sectionSub}>ভিডিও গাইড</Text>
            </View>
            <FlatList
              data={VIDEO_IDS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(id) => id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.videoCard}
                  onPress={() => Linking.openURL(`https://www.youtube.com/shorts/${item}`)}
                >
                  <Image
                    source={{ uri: `https://img.youtube.com/vi/${item}/hqdefault.jpg` }}
                    style={styles.videoThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.playOverlay}>
                    <View style={styles.playBtn}>
                      <Feather name="play" size={18} color="#fff" />
                    </View>
                  </View>
                  <View style={styles.videoLabel}>
                    <Text style={styles.videoLabelText}>Shorts</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ── Story ── */}
        {!isSearching && (
          <View style={styles.storyCard}>
            <Text style={styles.storyTitle}>আমাদের লক্ষ্য</Text>
            <Text style={styles.storyText}>
              বাংলাদেশের কোটি কৃষক প্রতিদিন অক্লান্ত পরিশ্রম করেন — অথচ দালালদের কারণে ন্যায্য মূল্য পান না।
              {"\n\n"}
              <Text style={{ fontWeight: "700", color: colors.light.primary }}>কৃষক বাজার</Text>
              {" "}সেই মধ্যস্বত্তাভোগীদের বাদ দিয়ে সরাসরি কৃষকের হাত থেকে আপনার দরজায় টাটকা পণ্য পৌঁছে দেয়।
              {"\n\n"}ন্যায্য দাম। টাটকা পণ্য। সম্মানিত কৃষক।
            </Text>
            <View style={styles.storyStats}>
              {[["২৫+", "পণ্য"], ["১৩+", "কৃষক"], ["৮টি", "ক্যাটাগরি"], ["৯৯%", "সন্তুষ্ট"]].map(
                ([num, label]) => (
                  <View key={label} style={styles.storyStat}>
                    <Text style={styles.storyStatNum}>{num}</Text>
                    <Text style={styles.storyStatLabel}>{label}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        )}

        {/* ── Footer ── */}
        {!isSearching && (
          <View style={styles.footer}>
            <Image source={require("@/assets/images/icon.png")} style={styles.footerLogo} />
            <Text style={styles.footerBrand}>কৃষক বাজার</Text>
            <Text style={styles.footerTagline}>সরাসরি কৃষকের কাছ থেকে টাটকা পণ্য</Text>
            <View style={styles.footerDivider} />
            <Text style={styles.footerPolicy}>
              ঢাকা সিটি ডেলিভারি: ৳৬০ · ঢাকার বাইরে: ৳১২০{"\n"}
              ৫ কেজির বেশি: অতিরিক্ত ৳৩০/কেজি
            </Text>
            <View style={styles.catGrid}>
              {CATEGORIES.filter((c) => c.key !== "all").map((c) => (
                <TouchableOpacity
                  key={c.key}
                  style={styles.footerCat}
                  onPress={() => setActiveCategory(c.key)}
                >
                  <Text style={styles.footerCatEmoji}>{c.emoji}</Text>
                  <Text style={styles.footerCatLabel}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.copyright}>© ২০২৫ কৃষক বাজার · বাংলাদেশ</Text>
          </View>
        )}
      </ScrollView>

      {/* ── Riktaj FAB ── */}
      <TouchableOpacity
        style={[
          styles.chatFab,
          { bottom: (Platform.OS === "web" ? 34 : insets.bottom) + 76 },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setShowChat(true);
        }}
      >
        <Image source={require("@/assets/images/icon.png")} style={styles.chatFabIcon} />
        <Text style={styles.chatFabText}>রিক্তাজ AI</Text>
      </TouchableOpacity>

      <CustomerModal visible={showCustomer} onClose={() => setShowCustomer(false)} />
      <FarmerModal visible={showFarmer} onClose={() => setShowFarmer(false)} />
      <ChatBotModal visible={showChat} onClose={() => setShowChat(false)} />
    </View>
  );
}

/* ─── Category Tabs ─── */
function CategoryTabs() {
  const { activeCategory, setActiveCategory } = useApp();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={catStyles.row}
    >
      {CATEGORIES.map((c) => {
        const active = activeCategory === c.key;
        return (
          <TouchableOpacity
            key={c.key}
            style={[catStyles.tab, active && catStyles.tabActive]}
            onPress={() => setActiveCategory(c.key)}
          >
            <Text style={catStyles.emoji}>{c.emoji}</Text>
            <Text style={[catStyles.label, active && catStyles.labelActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const catStyles = StyleSheet.create({
  row: { paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  tab: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 24,
    borderWidth: 1, borderColor: colors.light.border, backgroundColor: "#fff",
  },
  tabActive: { backgroundColor: colors.light.primary, borderColor: colors.light.primary },
  emoji: { fontSize: 14 },
  label: { fontSize: 12, color: colors.light.mutedForeground, fontWeight: "500" as const },
  labelActive: { color: "#fff", fontWeight: "700" as const },
});

const styles = StyleSheet.create({
  /* Header */
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 10,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: colors.light.border,
  },
  logoArea: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoImg: { width: 40, height: 40, borderRadius: 20 },
  brandName: { fontSize: 20, fontWeight: "800" as const, color: colors.light.primary },
  brandTagline: { fontSize: 10, color: colors.light.mutedForeground },
  headerBtns: { flexDirection: "row", gap: 8 },
  headerIconBtn: {
    alignItems: "center", justifyContent: "center", gap: 2,
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 14, borderWidth: 1, borderColor: colors.light.border,
    backgroundColor: colors.light.primarySoft,
  },
  headerIconBtnFarmer: { backgroundColor: "#fef3c7", borderColor: "#fde68a" },
  headerIconImg: { width: 30, height: 30, borderRadius: 15 },
  headerIconLabel: { fontSize: 9, color: colors.light.primary, fontWeight: "700" as const },
  headerIconLabelFarmer: { color: "#92400e" },

  /* Search */
  searchWrap: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#fff" },
  searchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.light.muted, borderRadius: 24,
    paddingHorizontal: 14, paddingVertical: 10, gap: 8,
    borderWidth: 1, borderColor: colors.light.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.light.text },

  /* Section */
  section: { marginBottom: 6, paddingTop: 8 },
  sectionHeaderRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, marginBottom: 12,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionAccent: { width: 4, height: 20, backgroundColor: colors.light.primary, borderRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "700" as const, color: colors.light.text },
  sectionSub: { fontSize: 12, color: colors.light.mutedForeground },
  hotBadge: {
    backgroundColor: "#fef3c7", paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 20, borderWidth: 1, borderColor: "#fde68a",
  },
  hotBadgeText: { fontSize: 10, color: "#92400e", fontWeight: "700" as const },

  /* Best Sellers */
  bestSellerList: { paddingHorizontal: 16, gap: 12 },
  bsCard: {
    width: 140, backgroundColor: "#fff",
    borderRadius: 18, overflow: "hidden",
    borderWidth: 1, borderColor: colors.light.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  bsImgWrap: { position: "relative" },
  bsImg: { width: "100%", height: 100 },
  bsEmojiWrap: {
    position: "absolute", bottom: 6, right: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 30, height: 30, borderRadius: 15,
    alignItems: "center", justifyContent: "center",
  },
  bsEmoji: { fontSize: 16 },
  bsTopBadge: {
    position: "absolute", top: 8, left: 8,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  bsTopBadgeText: { fontSize: 9, color: "#fff", fontWeight: "700" as const },
  bsInfo: { padding: 10, gap: 2 },
  bsCatLabel: { fontSize: 10, color: colors.light.mutedForeground, fontWeight: "600" as const, textTransform: "uppercase" as const, letterSpacing: 0.4 },
  bsProductName: { fontSize: 13, fontWeight: "700" as const, color: colors.light.text },
  bsPrice: { fontSize: 15, fontWeight: "800" as const, color: colors.light.primary, marginTop: 2 },
  bsUnit: { fontSize: 10, color: colors.light.mutedForeground, fontWeight: "400" as const },

  /* Product Grid */
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 10 },
  gridItem: { width: "47%", marginLeft: "1.5%" },

  /* Horizontal lists */
  horizontalList: { paddingHorizontal: 16, gap: 12 },

  /* Empty */
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyIcon: { fontSize: 42 },
  emptyTitle: { fontSize: 15, color: colors.light.mutedForeground },
  emptyLink: { fontSize: 14, color: colors.light.primary, fontWeight: "600" as const },

  /* Video */
  videoCard: { width: 180, height: 110, borderRadius: 14, overflow: "hidden" },
  videoThumb: { width: "100%", height: "100%", backgroundColor: "#111" },
  playOverlay: {
    ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  playBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(220,0,0,0.88)", alignItems: "center", justifyContent: "center",
  },
  videoLabel: {
    position: "absolute", top: 8, right: 8,
    backgroundColor: "rgba(220,0,0,0.85)",
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  videoLabelText: { fontSize: 9, color: "#fff", fontWeight: "700" as const },

  /* Story */
  storyCard: {
    margin: 16, backgroundColor: "#fff",
    borderRadius: 22, padding: 22,
    borderWidth: 1, borderColor: colors.light.border,
  },
  storyTitle: { fontSize: 20, fontWeight: "800" as const, color: colors.light.primary, marginBottom: 10 },
  storyText: { fontSize: 14, color: colors.light.text, lineHeight: 23 },
  storyStats: {
    flexDirection: "row", justifyContent: "space-around",
    marginTop: 20, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: colors.light.border,
  },
  storyStat: { alignItems: "center" },
  storyStatNum: { fontSize: 22, fontWeight: "800" as const, color: colors.light.primary },
  storyStatLabel: { fontSize: 11, color: colors.light.mutedForeground, marginTop: 2 },

  /* Footer */
  footer: {
    backgroundColor: colors.light.primary, padding: 28, alignItems: "center", gap: 6,
  },
  footerLogo: { width: 52, height: 52, borderRadius: 26, marginBottom: 4 },
  footerBrand: { fontSize: 20, fontWeight: "800" as const, color: "#fff" },
  footerTagline: { fontSize: 12, color: "rgba(255,255,255,0.75)", textAlign: "center" as const },
  footerDivider: { width: 60, height: 1, backgroundColor: "rgba(255,255,255,0.25)", marginVertical: 6 },
  footerPolicy: { fontSize: 11, color: "rgba(255,255,255,0.6)", textAlign: "center" as const, lineHeight: 18 },
  catGrid: {
    flexDirection: "row", flexWrap: "wrap", justifyContent: "center",
    gap: 8, marginTop: 10,
  },
  footerCat: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  footerCatEmoji: { fontSize: 14 },
  footerCatLabel: { fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: "600" as const },
  copyright: { fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 6 },

  /* Chat FAB */
  chatFab: {
    position: "absolute", right: 18,
    backgroundColor: colors.light.primary,
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 32,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22, shadowRadius: 10, elevation: 8,
  },
  chatFabIcon: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.5)" },
  chatFabText: { color: "#fff", fontWeight: "700" as const, fontSize: 13 },
});
