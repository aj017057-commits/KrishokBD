import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { WithdrawalsService, type WithdrawalDoc } from "@/services/db";

interface Props {
  visible: boolean;
  onClose: () => void;
  farmerId: number;
  farmerName: string;
  availableBalance: number;
}

const METHODS = [
  { key: "bKash",  label: "bKash",  color: "#e2136e", icon: "smartphone" },
  { key: "Nagad",  label: "Nagad",  color: "#f15a22", icon: "smartphone" },
  { key: "Rocket", label: "Rocket", color: "#8b1fa9", icon: "smartphone" },
] as const;

export default function WithdrawalModal({ visible, onClose, farmerId, farmerName, availableBalance }: Props) {
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState<"bKash" | "Nagad" | "Rocket">("bKash");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<WithdrawalDoc[]>([]);
  const [tab, setTab] = useState<"request" | "history">("request");

  useEffect(() => {
    if (visible) {
      WithdrawalsService.getByFarmer(farmerId).then(setHistory);
      setSuccess(false);
      setError("");
    }
  }, [visible, farmerId]);

  const handleSubmit = async () => {
    const amt = parseInt(amount, 10);
    if (!accountNumber.trim() || accountNumber.length < 11) {
      setError("সঠিক একাউন্ট নম্বর দিন (১১ ডিজিট)");
      return;
    }
    if (!amt || amt < 100) { setError("ন্যূনতম উইথড্রয়াল ১০০ টাকা"); return; }
    if (amt > availableBalance) { setError(`সর্বোচ্চ উপলব্ধ: ৳${availableBalance}`); return; }

    setLoading(true);
    setError("");
    try {
      await WithdrawalsService.request({ farmerId, farmerName, amount: amt, method, accountNumber });
      setSuccess(true);
      setAmount("");
      setAccountNumber("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const updated = await WithdrawalsService.getByFarmer(farmerId);
      setHistory(updated);
    } catch {
      setError("কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
    setLoading(false);
  };

  const statusColor = (s: WithdrawalDoc["status"]) =>
    s === "approved" ? "#22c55e" : s === "rejected" ? "#ef4444" : "#f59e0b";
  const statusLabel = (s: WithdrawalDoc["status"]) =>
    s === "approved" ? "অনুমোদিত" : s === "rejected" ? "প্রত্যাখ্যাত" : "অপেক্ষমাণ";

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>উইথড্রয়াল</Text>
            <TouchableOpacity onPress={onClose}><Feather name="x" size={20} color={colors.light.text} /></TouchableOpacity>
          </View>

          {/* Balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>উপলব্ধ ব্যালেন্স</Text>
            <Text style={styles.balanceAmt}>৳{availableBalance.toLocaleString()}</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {(["request", "history"] as const).map((t) => (
              <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
                <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                  {t === "request" ? "উইথড্রয়াল করুন" : "ইতিহাস"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {tab === "request" ? (
              <View style={styles.form}>
                {/* Method selection */}
                <Text style={styles.fieldLabel}>পেমেন্ট পদ্ধতি</Text>
                <View style={styles.methodRow}>
                  {METHODS.map((m) => (
                    <TouchableOpacity
                      key={m.key}
                      style={[styles.methodBtn, method === m.key && { backgroundColor: m.color }]}
                      onPress={() => { setMethod(m.key); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    >
                      <Text style={[styles.methodText, method === m.key && { color: "#fff" }]}>{m.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Account number */}
                <Text style={styles.fieldLabel}>{method} নম্বর</Text>
                <TextInput
                  style={styles.input}
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="01XXXXXXXXX"
                  keyboardType="phone-pad"
                  maxLength={11}
                  placeholderTextColor={colors.light.mutedForeground}
                />

                {/* Amount */}
                <Text style={styles.fieldLabel}>পরিমাণ (৳)</Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="ন্যূনতম ১০০"
                  keyboardType="numeric"
                  placeholderTextColor={colors.light.mutedForeground}
                />

                {/* Quick amounts */}
                <View style={styles.quickAmtRow}>
                  {[500, 1000, 2000, 5000].filter((a) => a <= availableBalance).map((a) => (
                    <TouchableOpacity
                      key={a}
                      style={styles.quickAmt}
                      onPress={() => setAmount(a.toString())}
                    >
                      <Text style={styles.quickAmtText}>৳{a}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {success && (
                  <View style={styles.successBox}>
                    <Feather name="check-circle" size={16} color="#22c55e" />
                    <Text style={styles.successText}>উইথড্রয়াল অনুরোধ পাঠানো হয়েছে! ১-২ কার্যদিবসে প্রক্রিয়া হবে।</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" size="small" /> : (
                    <>
                      <Feather name="send" size={16} color="#fff" />
                      <Text style={styles.submitBtnText}>উইথড্রয়াল অনুরোধ করুন</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.historyList}>
                {history.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Feather name="inbox" size={32} color={colors.light.mutedForeground} />
                    <Text style={styles.emptyText}>কোনো ইতিহাস নেই</Text>
                  </View>
                ) : (
                  history.map((w) => (
                    <View key={w.id} style={styles.historyCard}>
                      <View style={styles.historyTop}>
                        <View>
                          <Text style={styles.historyMethod}>{w.method}</Text>
                          <Text style={styles.historyAccount}>{w.accountNumber}</Text>
                        </View>
                        <View style={[styles.historyStatusBadge, { backgroundColor: statusColor(w.status) + "20" }]}>
                          <Text style={[styles.historyStatusText, { color: statusColor(w.status) }]}>{statusLabel(w.status)}</Text>
                        </View>
                      </View>
                      <View style={styles.historyBottom}>
                        <Text style={styles.historyAmt}>৳{w.amount.toLocaleString()}</Text>
                        <Text style={styles.historyDate}>{new Date(w.createdAt).toLocaleDateString("bn-BD")}</Text>
                      </View>
                      {w.note && <Text style={styles.historyNote}>{w.note}</Text>}
                    </View>
                  ))
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
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: "800", color: colors.light.text },
  balanceCard: {
    backgroundColor: "#f0fdf4", borderRadius: 16, padding: 16, alignItems: "center",
    marginBottom: 16, borderWidth: 1, borderColor: "#bbf7d0",
  },
  balanceLabel: { fontSize: 12, color: colors.light.mutedForeground },
  balanceAmt: { fontSize: 28, fontWeight: "800", color: colors.light.primary },
  tabRow: { flexDirection: "row", backgroundColor: "#f3f4f6", borderRadius: 12, padding: 3, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4 },
  tabText: { fontSize: 13, color: colors.light.mutedForeground, fontWeight: "600" },
  tabTextActive: { color: colors.light.text },
  form: { gap: 4 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: colors.light.text, marginBottom: 6, marginTop: 10 },
  methodRow: { flexDirection: "row", gap: 8 },
  methodBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center",
    backgroundColor: "#f3f4f6", borderWidth: 1, borderColor: "#e5e7eb",
  },
  methodText: { fontSize: 13, fontWeight: "700", color: colors.light.text },
  input: {
    backgroundColor: "#f3f4f6", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: colors.light.text, borderWidth: 1, borderColor: "#e5e7eb",
  },
  quickAmtRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  quickAmt: {
    flex: 1, paddingVertical: 8, backgroundColor: "#f0fdf4", borderRadius: 10,
    alignItems: "center", borderWidth: 1, borderColor: "#bbf7d0",
  },
  quickAmtText: { fontSize: 12, fontWeight: "700", color: colors.light.primary },
  error: { color: "#ef4444", fontSize: 13, marginTop: 8 },
  successBox: { flexDirection: "row", gap: 8, backgroundColor: "#f0fdf4", borderRadius: 12, padding: 12, alignItems: "flex-start", marginTop: 8 },
  successText: { flex: 1, fontSize: 13, color: "#16a34a" },
  submitBtn: {
    backgroundColor: colors.light.primary, borderRadius: 14, paddingVertical: 15,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16,
  },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  historyList: { gap: 10, paddingTop: 4 },
  historyCard: { backgroundColor: "#f9fafb", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#e5e7eb" },
  historyTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  historyMethod: { fontSize: 14, fontWeight: "700", color: colors.light.text },
  historyAccount: { fontSize: 12, color: colors.light.mutedForeground, marginTop: 2 },
  historyStatusBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  historyStatusText: { fontSize: 12, fontWeight: "700" },
  historyBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  historyAmt: { fontSize: 16, fontWeight: "800", color: colors.light.primary },
  historyDate: { fontSize: 11, color: colors.light.mutedForeground },
  historyNote: { fontSize: 12, color: colors.light.mutedForeground, marginTop: 6, fontStyle: "italic" },
  emptyBox: { alignItems: "center", gap: 8, paddingVertical: 32 },
  emptyText: { color: colors.light.mutedForeground, fontSize: 14 },
});
