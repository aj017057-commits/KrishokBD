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
import { VIDEO_IDS } from "@/constants/data";
import { useApp } from "@/context/AppContext";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { products, farmers, searchQuery, setSearchQuery, activeCategory, cartCount } = useApp();
  const [showCustomer, setShowCustomer] = useState(false);
  const [showFarmer, setShowFarmer] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") list = list.filter((p) => p.cat === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.farmer.toLowerCase().includes(q));
    }
    return list;
  }, [products, activeCategory, searchQuery]);

  const bestSellers = useMemo(() => products.slice(0, 6), [products]);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
        <View style={styles.logoArea}>
          <Image source={require("@/assets/images/icon.png")} style={styles.logoImg} />
          <Text style={styles.brandName}>কৃষক বাজার</Text>
        </View>
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowCustomer(true)}>
            <Feather name="user" size={18} color={colors.light.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowFarmer(true)}>
            <Feather name="truck" size={18} color={colors.light.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={colors.light.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder="পণ্য খুঁজুন..."
            placeholderTextColor={colors.light.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={14} color={colors.light.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 100 : 80 }}>
        {/* Hero Carousel */}
        <HeroCarousel onOrderPress={() => {}} />

        {/* Category Tabs */}
        <CategoryTabsInline />

        {/* Best Sellers */}
        {!searchQuery && activeCategory === "all" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>সেরা বিক্রিত পণ্য</Text>
              <Text style={styles.sectionSub}>বেশি জনপ্রিয়</Text>
            </View>
            <FlatList
              data={bestSellers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
              renderItem={({ item }) => (
                <View style={{ width: 160 }}>
                  <ProductCard product={item} />
                </View>
              )}
            />
          </View>
        )}

        {/* All Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeCategory === "all" ? "সব পণ্য" : getCatLabel(activeCategory)}
            </Text>
            <Text style={styles.sectionSub}>{filtered.length}টি পণ্য</Text>
          </View>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="package" size={40} color={colors.light.mutedForeground} />
              <Text style={styles.emptyText}>কোনো পণ্য পাওয়া যায়নি</Text>
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

        {/* Farmer Carousel */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>আমাদের কৃষক</Text>
            <Text style={styles.sectionSub}>যাচাইকৃত কৃষক</Text>
          </View>
          <FlatList
            data={farmers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
            renderItem={({ item }) => <FarmerCard farmer={item} />}
          />
        </View>

        {/* YouTube Videos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>খেত থেকে লাইভ</Text>
            <Text style={styles.sectionSub}>ভিডিও গাইড</Text>
          </View>
          <FlatList
            data={VIDEO_IDS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(id) => id}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.videoCard}
                onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${item}`)}
              >
                <Image
                  source={{ uri: `https://img.youtube.com/vi/${item}/0.jpg` }}
                  style={styles.videoThumb}
                />
                <View style={styles.playOverlay}>
                  <View style={styles.playBtn}>
                    <Feather name="play" size={20} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Story Section */}
        <View style={styles.storySection}>
          <Text style={styles.storyTitle}>আমাদের গল্প</Text>
          <Text style={styles.storyText}>
            বাংলাদেশ একটি কৃষি প্রধান দেশ। কৃষকরা অক্লান্ত পরিশ্রম করে উৎপাদন করেন খাঁটি ফসল।
            কিন্তু দালাল চক্রের কারণে তারা ন্যায্য মূল্য পান না।{"\n\n"}
            <Text style={{ fontWeight: "700" as const }}>"কৃষক আমাদের সম্পদ, দালাল নয়"</Text>
            {" "}— আমরা সরাসরি কৃষকের কাছ থেকে পণ্য সংগ্রহ করে গ্রাহকের দোরগোড়ায় পৌঁছে দিচ্ছি।
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>কৃষক বাজার</Text>
          <Text style={styles.footerTagline}>সরাসরি কৃষকের কাছ থেকে টাটকা পণ্য</Text>
          <View style={styles.footerRow}>
            <Feather name="phone" size={12} color="rgba(255,255,255,0.7)" />
            <Text style={styles.footerContact}>01931-355398</Text>
          </View>
          <Text style={styles.footerPolicy}>
            ঢাকা সিটি: ৬০ টাকা (৫ কেজি পর্যন্ত) · ঢাকার বাইরে: ১২০ টাকা
          </Text>
          <Text style={styles.copyright}>© ২০২৫ কৃষক বাজার · একটি বাংলাদেশী উদ্যোগ</Text>
        </View>
      </ScrollView>

      {/* Floating Chatbot Button */}
      <TouchableOpacity
        style={[styles.chatFab, { bottom: (Platform.OS === "web" ? 34 : insets.bottom) + 72 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setShowChat(true);
        }}
      >
        <Feather name="message-circle" size={24} color="#fff" />
        <Text style={styles.chatFabText}>রিক্তাজ</Text>
      </TouchableOpacity>

      <CustomerModal visible={showCustomer} onClose={() => setShowCustomer(false)} />
      <FarmerModal visible={showFarmer} onClose={() => setShowFarmer(false)} />
      <ChatBotModal visible={showChat} onClose={() => setShowChat(false)} />
    </View>
  );
}

function getCatLabel(cat: string) {
  const map: Record<string, string> = { vege: "সবজি", fruit: "ফল", leafy: "শাক", fish: "মাছ", ready: "রেডি টু কুক" };
  return map[cat] || cat;
}

function CategoryTabsInline() {
  const { activeCategory, setActiveCategory } = useApp();
  const CATS = [
    { key: "all", label: "সব" },
    { key: "vege", label: "সবজি" },
    { key: "fruit", label: "ফল" },
    { key: "leafy", label: "শাক" },
    { key: "fish", label: "মাছ" },
    { key: "ready", label: "রেডি" },
  ];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
      {CATS.map((c) => (
        <TouchableOpacity
          key={c.key}
          style={[styles.catTab, activeCategory === c.key && styles.catTabActive]}
          onPress={() => setActiveCategory(c.key)}
        >
          <Text style={[styles.catLabel, activeCategory === c.key && styles.catLabelActive]}>{c.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  logoArea: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoImg: { width: 36, height: 36, borderRadius: 18 },
  brandName: { fontSize: 20, fontWeight: "800" as const, color: colors.light.primary },
  headerBtns: { flexDirection: "row", gap: 8 },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light.primarySoft,
  },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#fff" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.muted,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.light.text },
  catRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  catTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: "#fff",
  },
  catTabActive: { backgroundColor: colors.light.primary, borderColor: colors.light.primary },
  catLabel: { fontSize: 13, color: colors.light.mutedForeground, fontWeight: "500" as const },
  catLabelActive: { color: "#fff", fontWeight: "700" as const },
  section: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.light.text,
    borderLeftWidth: 3,
    borderLeftColor: colors.light.primary,
    paddingLeft: 10,
  },
  sectionSub: { fontSize: 12, color: colors.light.mutedForeground },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 10,
  },
  gridItem: { width: "47%", marginLeft: "1.5%" },
  empty: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: colors.light.mutedForeground },
  videoCard: { width: 200, height: 120, borderRadius: 12, overflow: "hidden" },
  videoThumb: { width: "100%", height: "100%", backgroundColor: "#000" },
  playOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  playBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,0,0,0.85)", alignItems: "center", justifyContent: "center" },
  storySection: {
    margin: 16,
    backgroundColor: colors.light.primarySoft,
    borderRadius: 20,
    padding: 20,
  },
  storyTitle: { fontSize: 18, fontWeight: "700" as const, color: colors.light.primary, marginBottom: 10 },
  storyText: { fontSize: 14, color: colors.light.text, lineHeight: 22 },
  footer: {
    backgroundColor: colors.light.primary,
    padding: 24,
    alignItems: "center",
    gap: 6,
  },
  footerBrand: { fontSize: 18, fontWeight: "800" as const, color: "#fff" },
  footerTagline: { fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "center" },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  footerContact: { fontSize: 13, color: "rgba(255,255,255,0.85)" },
  footerPolicy: { fontSize: 11, color: "rgba(255,255,255,0.6)", textAlign: "center", lineHeight: 18 },
  copyright: { fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 4 },
  chatFab: {
    position: "absolute",
    right: 20,
    backgroundColor: colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  chatFabText: { color: "#fff", fontWeight: "700" as const, fontSize: 14 },
});
