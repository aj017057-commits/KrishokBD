import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { ReviewsService, type ReviewDoc } from "@/services/db";

interface Props {
  visible: boolean;
  onClose: () => void;
  productId: number;
  productTitle: string;
}

function StarRow({ rating, onRate, readonly }: { rating: number; onRate?: (n: number) => void; readonly?: boolean }) {
  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} disabled={readonly} onPress={() => { onRate?.(n); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
          <Feather name={n <= rating ? "star" : "star"} size={28} color={n <= rating ? "#f59e0b" : "#e5e7eb"} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ReviewModal({ visible, onClose, productId, productTitle }: Props) {
  const insets = useSafeAreaInsets();
  const { currentCustomer } = useApp();
  const [tab, setTab] = useState<"write" | "read">("read");
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avgRating, setAvgRating] = useState({ avg: 0, count: 0 });

  useEffect(() => {
    if (visible) {
      setLoading(true);
      Promise.all([
        ReviewsService.getByProduct(productId),
        ReviewsService.getAvgRating(productId),
      ]).then(([revs, avg]) => {
        setReviews(revs);
        setAvgRating(avg);
        setLoading(false);
      });
      setSuccess(false);
      setComment("");
      setPhotoUri(null);
      setRating(5);
    }
  }, [visible, productId]);

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
    if (!res.canceled && res.assets[0]) setPhotoUri(res.assets[0].uri);
  };

  const submitReview = async () => {
    if (!currentCustomer) return;
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const rev = await ReviewsService.add({
        productId,
        customerId: currentCustomer.id,
        customerName: currentCustomer.name,
        rating,
        comment: comment.trim(),
        photoUrl: photoUri || undefined,
      });
      setReviews((prev) => [rev, ...prev]);
      setAvgRating(await ReviewsService.getAvgRating(productId));
      setSuccess(true);
      setComment("");
      setPhotoUri(null);
      setRating(5);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTab("read");
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>রিভিউ</Text>
              <Text style={styles.sheetSub}>{productTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose}><Feather name="x" size={20} color={colors.light.text} /></TouchableOpacity>
          </View>

          {/* Avg rating hero */}
          {avgRating.count > 0 && (
            <View style={styles.avgCard}>
              <Text style={styles.avgNum}>{avgRating.avg}</Text>
              <StarRow rating={Math.round(avgRating.avg)} readonly />
              <Text style={styles.avgCount}>{avgRating.count}টি রিভিউ</Text>
            </View>
          )}

          {/* Tabs */}
          <View style={styles.tabRow}>
            {(["read", "write"] as const).map((t) => (
              <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
                <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                  {t === "read" ? `সব রিভিউ (${reviews.length})` : "রিভিউ লিখুন"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {tab === "read" ? (
              loading ? (
                <ActivityIndicator color={colors.light.primary} style={{ marginTop: 32 }} />
              ) : reviews.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Feather name="star" size={32} color="#e5e7eb" />
                  <Text style={styles.emptyText}>এখনো কোনো রিভিউ নেই</Text>
                  {currentCustomer && (
                    <TouchableOpacity style={styles.firstReviewBtn} onPress={() => setTab("write")}>
                      <Text style={styles.firstReviewBtnText}>প্রথম রিভিউ দিন</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={styles.reviewList}>
                  {reviews.map((r) => (
                    <View key={r.id} style={styles.reviewCard}>
                      <View style={styles.reviewTop}>
                        <View style={styles.reviewAvatar}>
                          <Text style={styles.reviewAvatarText}>{r.customerName[0]}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.reviewName}>{r.customerName}</Text>
                          <StarRow rating={r.rating} readonly />
                        </View>
                        <Text style={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString("bn-BD")}</Text>
                      </View>
                      <Text style={styles.reviewComment}>{r.comment}</Text>
                      {r.photoUrl && <Image source={{ uri: r.photoUrl }} style={styles.reviewPhoto} />}
                    </View>
                  ))}
                </View>
              )
            ) : (
              <View style={styles.writeForm}>
                {!currentCustomer ? (
                  <View style={styles.loginNotice}>
                    <Feather name="lock" size={24} color={colors.light.mutedForeground} />
                    <Text style={styles.loginNoticeText}>রিভিউ দিতে লগইন করুন</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.fieldLabel}>রেটিং</Text>
                    <StarRow rating={rating} onRate={setRating} />

                    <Text style={styles.fieldLabel}>মন্তব্য</Text>
                    <TextInput
                      style={styles.commentInput}
                      value={comment}
                      onChangeText={setComment}
                      placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
                      placeholderTextColor={colors.light.mutedForeground}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />

                    <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto}>
                      <Feather name="camera" size={16} color={colors.light.primary} />
                      <Text style={styles.photoBtnText}>{photoUri ? "ছবি বদলান" : "ছবি যোগ করুন (ঐচ্ছিক)"}</Text>
                    </TouchableOpacity>
                    {photoUri && <Image source={{ uri: photoUri }} style={styles.previewPhoto} />}

                    {success && (
                      <View style={styles.successBox}>
                        <Feather name="check-circle" size={14} color="#22c55e" />
                        <Text style={styles.successText}>রিভিউ সফলভাবে জমা দেওয়া হয়েছে!</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={[styles.submitBtn, (submitting || !comment.trim()) && { opacity: 0.6 }]}
                      onPress={submitReview}
                      disabled={submitting || !comment.trim()}
                    >
                      {submitting ? <ActivityIndicator color="#fff" size="small" /> : (
                        <>
                          <Feather name="send" size={16} color="#fff" />
                          <Text style={styles.submitBtnText}>রিভিউ জমা দিন</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "90%", padding: 20 },
  handle: { width: 40, height: 4, backgroundColor: "#e5e7eb", borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  sheetTitle: { fontSize: 18, fontWeight: "800", color: colors.light.text },
  sheetSub: { fontSize: 12, color: colors.light.mutedForeground, marginTop: 2 },
  avgCard: { backgroundColor: "#fffbeb", borderRadius: 16, padding: 14, alignItems: "center", gap: 4, marginBottom: 14, borderWidth: 1, borderColor: "#fde68a" },
  avgNum: { fontSize: 36, fontWeight: "900", color: "#f59e0b" },
  avgCount: { fontSize: 12, color: colors.light.mutedForeground },
  tabRow: { flexDirection: "row", backgroundColor: "#f3f4f6", borderRadius: 12, padding: 3, marginBottom: 14 },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4 },
  tabText: { fontSize: 13, color: colors.light.mutedForeground, fontWeight: "600" },
  tabTextActive: { color: colors.light.text },
  reviewList: { gap: 12, paddingTop: 4 },
  reviewCard: { backgroundColor: "#f9fafb", borderRadius: 14, padding: 14, gap: 8, borderWidth: 1, borderColor: "#e5e7eb" },
  reviewTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.light.primary + "20", alignItems: "center", justifyContent: "center" },
  reviewAvatarText: { fontSize: 16, fontWeight: "700", color: colors.light.primary },
  reviewName: { fontSize: 13, fontWeight: "700", color: colors.light.text },
  reviewDate: { fontSize: 11, color: colors.light.mutedForeground },
  reviewComment: { fontSize: 13, color: colors.light.text, lineHeight: 20 },
  reviewPhoto: { width: "100%", height: 180, borderRadius: 10, resizeMode: "cover" },
  writeForm: { gap: 10 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: colors.light.text, marginTop: 8 },
  commentInput: {
    backgroundColor: "#f3f4f6", borderRadius: 12, padding: 14, fontSize: 14,
    color: colors.light.text, borderWidth: 1, borderColor: "#e5e7eb", minHeight: 100,
  },
  photoBtn: {
    flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.light.primary + "40", padding: 12,
    borderStyle: "dashed",
  },
  photoBtnText: { color: colors.light.primary, fontSize: 13, fontWeight: "600" },
  previewPhoto: { width: "100%", height: 150, borderRadius: 10, resizeMode: "cover" },
  successBox: { flexDirection: "row", gap: 8, backgroundColor: "#f0fdf4", borderRadius: 10, padding: 10, alignItems: "center" },
  successText: { flex: 1, fontSize: 13, color: "#16a34a" },
  submitBtn: { backgroundColor: colors.light.primary, borderRadius: 14, paddingVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  emptyBox: { alignItems: "center", gap: 8, paddingVertical: 32 },
  emptyText: { color: colors.light.mutedForeground, fontSize: 14 },
  firstReviewBtn: { backgroundColor: colors.light.primary + "20", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  firstReviewBtnText: { color: colors.light.primary, fontWeight: "700", fontSize: 13 },
  loginNotice: { alignItems: "center", gap: 8, paddingVertical: 32 },
  loginNoticeText: { color: colors.light.mutedForeground, fontSize: 15 },
});
