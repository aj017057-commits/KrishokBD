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

const MALE_LOGO = require("@/assets/images/farmer-male.png");
const FEMALE_LOGO = require("@/assets/images/farmer-female.png");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { products, farmers, searchQuery, setSearchQuery, activeCategory } = useApp();
  const [showCustomer, setShowCustomer] = useState(false);
  const [showFarmer, setShowFarmer] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") list = list.filter((p) => p.cat === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.farmer.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, activeCategory, searchQuery]);

  const featured = useMemo(() => products.slice(0, 8), [products]);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Header */}
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

      {/* Search */}
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
        {/* Hero Carousel */}
        <HeroCarousel onOrderPress={() => {}} />

        {/* Category Tabs */}
        <CategoryTabs />

        {/* Featured Products */}
        {!searchQuery && activeCategory === "all" && (
          <Section title="আজকের বিশেষ পণ্য" sub="সেরা বিক্রিত">
            <FlatList
              data={featured}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              renderItem={({ item }) => (
                <View style={{ width: 170 }}>
                  <ProductCard product={item} />
                </View>
              )}
            />
          </Section>
        )}

        {/* Product Grid */}
        <Section
          title={activeCategory === "all" ? "সব পণ্য" : getCatLabel(activeCategory)}
          sub={`${filtered.length}টি পণ্য`}
        >
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="search" size={40} color={colors.light.mutedForeground} />
              <Text style={styles.emptyText}>কোনো পণ্য পাওয়া যায়নি</Text>
              <TouchableOpacity onPress={() => { setSearchQuery(""); }}>
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
        </Section>

        {/* Farmers */}
        <Section title="আমাদের যাচাইকৃত কৃষক" sub={`${farmers.length}+ কৃষক`}>
          <FlatList
            data={farmers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            renderItem={({ item }) => <FarmerCard farmer={item} />}
          />
        </Section>

        {/* YouTube Videos */}
        <Section title="খেত থেকে লাইভ" sub="ভিডিও গাইড">
          <FlatList
            data={VIDEO_IDS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(id) => id}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
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
        </Section>

        {/* Story */}
        <View style={styles.storyCard}>
          <Text style={styles.storyTitle}>আমাদের লক্ষ্য</Text>
          <Text style={styles.storyText}>
            বাংলাদেশের কোটি কৃষক প্রতিদিন অক্লান্ত পরিশ্রম করেন — অথচ দালালদের কারণে ন্যায্য মূল্য পান না।
            {"\n\n"}
            <Text style={{ fontWeight: "700" as const, color: colors.light.primary }}>
              কৃষক বাজার
            </Text>
            {" "}সেই মধ্যস্বত্তাভোগীদের বাদ দিয়ে সরাসরি কৃষকের হাত থেকে আপনার দরজায় টাটকা পণ্য পৌঁছে দেয়।
            {"\n\n"}
            ন্যায্য দাম। টাটকা পণ্য। সম্মানিত কৃষক।
          </Text>
          <View style={styles.storyStats}>
            {[["২৮+", "পণ্য"], ["১০+", "কৃষক"], ["৯৯%", "সন্তুষ্ট"]].map(([num, label]) => (
              <View key={label} style={styles.storyStat}>
                <Text style={styles.storyStatNum}>{num}</Text>
                <Text style={styles.storyStatLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Image source={require("@/assets/images/icon.png")} style={styles.footerLogo} />
          <Text style={styles.footerBrand}>কৃষক বাজার</Text>
          <Text style={styles.footerTagline}>সরাসরি কৃষকের কাছ থেকে টাটকা পণ্য</Text>
          <View style={styles.footerDivider} />
          <Text style={styles.footerPolicy}>
            ঢাকা সিটি ডেলিভারি: ৳৬০ · ঢাকার বাইরে: ৳১২০{"\n"}
            ৫ কেজির বেশি: অতিরিক্ত ৳৩০/কেজি
          </Text>
          <Text style={styles.copyright}>© ২০২৫ কৃষক বাজার · বাংলাদেশ</Text>
        </View>
      </ScrollView>

      {/* Riktaj Chatbot FAB */}
      <TouchableOpacity
        style={[styles.chatFab, { bottom: (Platform.OS === "web" ? 34 : insets.bottom) + 76 }]}
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

function Section({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <View style={sectionStyles.header}>
        <View style={sectionStyles.titleRow}>
          <View style={sectionStyles.accent} />
          <Text style={sectionStyles.title}>{title}</Text>
        </View>
        <Text style={sectionStyles.sub}>{sub}</Text>
      </View>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: { marginBottom: 6 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, marginBottom: 12 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  accent: { width: 4, height: 20, backgroundColor: colors.light.primary, borderRadius: 2 },
  title: { fontSize: 18, fontWeight: "700" as const, color: colors.light.text },
  sub: { fontSize: 12, color: colors.light.mutedForeground },
});

function CategoryTabs() {
  const { activeCategory, setActiveCategory } = useApp();
  const CATS = [
    { key: "all", label: "সব", icon: "grid" },
    { key: "vege", label: "সবজি", icon: "sun" },
    { key: "fruit", label: "ফল", icon: "circle" },
    { key: "leafy", label: "শাক", icon: "feather" },
    { key: "fish", label: "মাছ", icon: "anchor" },
    { key: "ready", label: "রেডি", icon: "package" },
  ];
  return (
    <ScrollView
      horizontal showsHorizontalScrollIndicator={false}
      contentContainerStyle={catStyles.row}
    >
      {CATS.map((c) => (
        <TouchableOpacity
          key={c.key}
          style={[catStyles.tab, activeCategory === c.key && catStyles.tabActive]}
          onPress={() => setActiveCategory(c.key)}
        >
          <Text style={[catStyles.label, activeCategory === c.key && catStyles.labelActive]}>
            {c.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const catStyles = StyleSheet.create({
  row: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  tab: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 24,
    borderWidth: 1, borderColor: colors.light.border, backgroundColor: "#fff",
  },
  tabActive: { backgroundColor: colors.light.primary, borderColor: colors.light.primary },
  label: { fontSize: 13, color: colors.light.mutedForeground, fontWeight: "500" as const },
  labelActive: { color: "#fff", fontWeight: "700" as const },
});

function getCatLabel(cat: string) {
  const m: Record<string, string> = { vege: "সবজি", fruit: "ফল", leafy: "শাক", fish: "মাছ", ready: "রেডি টু কুক" };
  return m[cat] || cat;
}

const styles = StyleSheet.create({
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
  searchWrap: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#fff" },
  searchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.light.muted, borderRadius: 24,
    paddingHorizontal: 14, paddingVertical: 10, gap: 8,
    borderWidth: 1, borderColor: colors.light.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.light.text },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 10 },
  gridItem: { width: "47%", marginLeft: "1.5%" },
  empty: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 15, color: colors.light.mutedForeground },
  emptyLink: { fontSize: 14, color: colors.light.primary, fontWeight: "600" as const },
  videoCard: { width: 180, height: 110, borderRadius: 14, overflow: "hidden" },
  videoThumb: { width: "100%", height: "100%", backgroundColor: "#111" },
  playOverlay: {
    ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  playBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(220,0,0,0.88)",
    alignItems: "center", justifyContent: "center",
  },
  videoLabel: {
    position: "absolute", top: 8, right: 8,
    backgroundColor: "rgba(220,0,0,0.85)",
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  videoLabelText: { fontSize: 9, color: "#fff", fontWeight: "700" as const },
  storyCard: {
    margin: 16, backgroundColor: "#fff",
    borderRadius: 22, padding: 22,
    borderWidth: 1, borderColor: colors.light.border,
  },
  storyTitle: { fontSize: 20, fontWeight: "800" as const, color: colors.light.primary, marginBottom: 10 },
  storyText: { fontSize: 14, color: colors.light.text, lineHeight: 23 },
  storyStats: { flexDirection: "row", justifyContent: "space-around", marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.light.border },
  storyStat: { alignItems: "center" },
  storyStatNum: { fontSize: 24, fontWeight: "800" as const, color: colors.light.primary },
  storyStatLabel: { fontSize: 11, color: colors.light.mutedForeground, marginTop: 2 },
  footer: {
    backgroundColor: colors.light.primary,
    padding: 28, alignItems: "center", gap: 6,
  },
  footerLogo: { width: 52, height: 52, borderRadius: 26, marginBottom: 4 },
  footerBrand: { fontSize: 20, fontWeight: "800" as const, color: "#fff" },
  footerTagline: { fontSize: 12, color: "rgba(255,255,255,0.75)", textAlign: "center" as const },
  footerDivider: { width: 60, height: 1, backgroundColor: "rgba(255,255,255,0.25)", marginVertical: 4 },
  footerPolicy: { fontSize: 11, color: "rgba(255,255,255,0.6)", textAlign: "center" as const, lineHeight: 18 },
  copyright: { fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 4 },
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
