import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useState } from "react";
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

const YOUTUBE_VIDEOS = [
  { id: "dQw4w9WgXcQ", title: "কৃষক বাজার - সরাসরি কৃষকের কাছ থেকে", views: "১২হাজার" },
  { id: "xvFZjo5PgG0", title: "জৈব সবজি চাষের টিপস", views: "৮হাজার" },
  { id: "6JYIGclVQdw", title: "বাংলাদেশি কৃষকদের গল্প", views: "৫হাজার" },
  { id: "2Vv-BfVoq4g", title: "তাজা মাছ বাজার", views: "৩হাজার" },
];

const TIKTOK_URLS = [
  "https://www.tiktok.com/embed/v2/7041263673948906754",
  "https://www.tiktok.com/embed/v2/7030000000000000000",
];

const FACEBOOK_PAGE_URL = "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F&tabs=timeline&width=400&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true";

type FeedTab = "youtube" | "facebook" | "tiktok";

function IframeEmbed({ src, height = 220 }: { src: string; height?: number }) {
  if (Platform.OS !== "web") {
    return (
      <View style={[styles.nativeNotice, { height }]}>
        <Feather name="smartphone" size={24} color={colors.light.mutedForeground} />
        <Text style={styles.nativeNoticeText}>মোবাইল অ্যাপে দেখতে লিংক খুলুন</Text>
        <TouchableOpacity onPress={() => Linking.openURL(src)} style={styles.openLinkBtn}>
          <Text style={styles.openLinkText}>খুলুন</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <iframe
      src={src}
      style={{ width: "100%", height, border: "none", borderRadius: 12 } as any}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

export default function SocialFeedsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FeedTab>("youtube");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const TABS: { key: FeedTab; label: string; icon: string; color: string }[] = [
    { key: "youtube",  label: "YouTube",  icon: "youtube",  color: "#ff0000" },
    { key: "facebook", label: "Facebook", icon: "facebook", color: "#1877f2" },
    { key: "tiktok",   label: "TikTok",  icon: "music",    color: "#010101" },
  ];

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}>
          <Feather name="arrow-left" size={20} color={colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>সোশ্যাল ফিড</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, activeTab === t.key && { backgroundColor: t.color }]}
            onPress={() => { setActiveTab(t.key); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          >
            <Feather name={t.icon as any} size={14} color={activeTab === t.key ? "#fff" : t.color} />
            <Text style={[styles.tabBtnText, { color: activeTab === t.key ? "#fff" : t.color }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }}>

        {/* YouTube */}
        {activeTab === "youtube" && (
          <>
            <View style={styles.platformHeader}>
              <Feather name="youtube" size={20} color="#ff0000" />
              <Text style={styles.platformTitle}>YouTube ভিডিও</Text>
              <TouchableOpacity style={[styles.followBtn, { backgroundColor: "#ff0000" }]} onPress={() => Linking.openURL("https://youtube.com/@krishokbazar")}>
                <Text style={styles.followBtnText}>Subscribe</Text>
              </TouchableOpacity>
            </View>
            {YOUTUBE_VIDEOS.map((v) => (
              <View key={v.id} style={styles.videoCard}>
                <IframeEmbed src={`https://www.youtube.com/embed/${v.id}?rel=0`} height={220} />
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{v.title}</Text>
                  <View style={styles.videoMeta}>
                    <Feather name="eye" size={12} color={colors.light.mutedForeground} />
                    <Text style={styles.videoMetaText}>{v.views} ভিউ</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(`https://youtube.com/watch?v=${v.id}`)}>
                      <Text style={styles.watchNow}>YouTube-এ দেখুন →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Facebook */}
        {activeTab === "facebook" && (
          <>
            <View style={styles.platformHeader}>
              <Feather name="facebook" size={20} color="#1877f2" />
              <Text style={styles.platformTitle}>Facebook পেজ</Text>
              <TouchableOpacity style={[styles.followBtn, { backgroundColor: "#1877f2" }]} onPress={() => Linking.openURL("https://facebook.com/krishokbazar")}>
                <Text style={styles.followBtnText}>Like করুন</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.embedCard}>
              <IframeEmbed src={FACEBOOK_PAGE_URL} height={500} />
            </View>
            <TouchableOpacity style={styles.openFbBtn} onPress={() => Linking.openURL("https://facebook.com/krishokbazar")}>
              <Feather name="external-link" size={14} color="#1877f2" />
              <Text style={styles.openFbText}>Facebook-এ দেখুন</Text>
            </TouchableOpacity>
          </>
        )}

        {/* TikTok */}
        {activeTab === "tiktok" && (
          <>
            <View style={styles.platformHeader}>
              <Feather name="music" size={20} color="#010101" />
              <Text style={styles.platformTitle}>TikTok ভিডিও</Text>
              <TouchableOpacity style={[styles.followBtn, { backgroundColor: "#010101" }]} onPress={() => Linking.openURL("https://tiktok.com/@krishokbazar")}>
                <Text style={styles.followBtnText}>Follow</Text>
              </TouchableOpacity>
            </View>
            {TIKTOK_URLS.map((url, i) => (
              <View key={i} style={styles.videoCard}>
                <IframeEmbed src={url} height={700} />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#f0f0f0",
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f0fdf4", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", color: colors.light.text },
  tabBar: { flexDirection: "row", gap: 8, padding: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#f0f0f0" },
  tabBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5,
    paddingVertical: 8, borderRadius: 10, backgroundColor: "#f3f4f6",
    borderWidth: 1, borderColor: "#e5e7eb",
  },
  tabBtnText: { fontSize: 12, fontWeight: "700" },
  platformHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  platformTitle: { flex: 1, fontSize: 16, fontWeight: "700", color: colors.light.text },
  followBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  followBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  videoCard: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6 },
  videoInfo: { padding: 12, gap: 4 },
  videoTitle: { fontSize: 14, fontWeight: "600", color: colors.light.text },
  videoMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  videoMetaText: { fontSize: 11, color: colors.light.mutedForeground, flex: 1 },
  watchNow: { fontSize: 12, color: colors.light.primary, fontWeight: "600" },
  embedCard: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" },
  openFbBtn: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", paddingVertical: 10 },
  openFbText: { color: "#1877f2", fontSize: 14, fontWeight: "600" },
  nativeNotice: { backgroundColor: "#f3f4f6", borderRadius: 12, alignItems: "center", justifyContent: "center", gap: 8 },
  nativeNoticeText: { fontSize: 13, color: colors.light.mutedForeground },
  openLinkBtn: { backgroundColor: colors.light.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  openLinkText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
