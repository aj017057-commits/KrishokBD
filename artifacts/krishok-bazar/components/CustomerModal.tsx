import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

type View_ = "login" | "register" | "history";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CustomerModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const {
    currentCustomer,
    customerLogin,
    customerRegister,
    customerLogout,
    getCustomerOrders,
  } = useApp();

  const [view, setView] = useState<View_>(currentCustomer ? "history" : "login");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPass, setRegPass] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (visible) setView(currentCustomer ? "history" : "login");
  }, [visible, currentCustomer]);

  const handleLogin = async () => {
    if (!loginPhone || !loginPass) { Alert.alert("সব তথ্য দিন"); return; }
    setLoading(true);
    const result = customerLogin(loginPhone, loginPass);
    setLoading(false);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setView("history");
    } else {
      Alert.alert("লগইন ব্যর্থ", result.error);
    }
  };

  const handleRegister = async () => {
    if (!regName || !regPhone || !regAddress || !regPass) { Alert.alert("সব তথ্য দিন"); return; }
    setLoading(true);
    const result = customerRegister(regName, regPhone, regAddress, regPass);
    setLoading(false);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setView("history");
    } else {
      Alert.alert("রেজিস্ট্রেশন ব্যর্থ", result.error);
    }
  };

  const handleLogout = () => {
    customerLogout();
    setLoginPhone("");
    setLoginPass("");
    setView("login");
    onClose();
  };

  const orders = currentCustomer ? getCustomerOrders(currentCustomer.id) : [];
  const totalSpent = orders.reduce((s, o) => s + o.grandTotal, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              {view === "login" ? "গ্রাহক লগইন" : view === "register" ? "নতুন অ্যাকাউন্ট" : "আমার প্রোফাইল"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={colors.light.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {view === "login" && (
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="মোবাইল নম্বর"
                  value={loginPhone}
                  onChangeText={setLoginPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.light.mutedForeground}
                />
                <TextInput
                  style={styles.input}
                  placeholder="পাসওয়ার্ড"
                  value={loginPass}
                  onChangeText={setLoginPass}
                  secureTextEntry
                  placeholderTextColor={colors.light.mutedForeground}
                />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>লগইন</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("register")}>
                  <Text style={styles.linkText}>নতুন? রেজিস্ট্রেশন করুন</Text>
                </TouchableOpacity>
              </View>
            )}

            {view === "register" && (
              <View style={styles.form}>
                <TextInput style={styles.input} placeholder="আপনার নাম" value={regName} onChangeText={setRegName} placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="মোবাইল নম্বর" value={regPhone} onChangeText={setRegPhone} keyboardType="phone-pad" placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="ঠিকানা" value={regAddress} onChangeText={setRegAddress} placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="পাসওয়ার্ড" value={regPass} onChangeText={setRegPass} secureTextEntry placeholderTextColor={colors.light.mutedForeground} />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>রেজিস্ট্রেশন</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("login")}>
                  <Text style={styles.linkText}>ইতিমধ্যে নিবন্ধিত? লগইন করুন</Text>
                </TouchableOpacity>
              </View>
            )}

            {view === "history" && currentCustomer && (
              <View style={styles.form}>
                <View style={styles.profileCard}>
                  <View style={styles.profileIcon}>
                    <Feather name="user" size={24} color={colors.light.primary} />
                  </View>
                  <View>
                    <Text style={styles.profileName}>{currentCustomer.name}</Text>
                    <Text style={styles.profilePhone}>{currentCustomer.phone}</Text>
                    <Text style={styles.profileAddress}>{currentCustomer.address}</Text>
                  </View>
                </View>

                <View style={styles.statRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statNum}>{orders.length}</Text>
                    <Text style={styles.statLabel}>মোট অর্ডার</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statNum}>৳{totalSpent}</Text>
                    <Text style={styles.statLabel}>মোট ব্যয়</Text>
                  </View>
                </View>

                <Text style={styles.sectionLabel}>অর্ডার ইতিহাস</Text>
                {orders.length === 0 ? (
                  <View style={styles.empty}>
                    <Feather name="shopping-bag" size={32} color={colors.light.mutedForeground} />
                    <Text style={styles.emptyText}>কোনো অর্ডার নেই</Text>
                  </View>
                ) : (
                  orders.slice().reverse().map((order) => (
                    <View key={order.id} style={styles.orderCard}>
                      <View style={styles.orderRow}>
                        <Text style={styles.orderProduct}>{order.productName}</Text>
                        <Text style={styles.orderAmount}>৳{order.total}</Text>
                      </View>
                      <Text style={styles.orderMeta}>{order.qty} {order.unit} · {order.farmerName}</Text>
                      <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString("bn-BD")}</Text>
                    </View>
                  ))
                )}

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                  <Feather name="log-out" size={16} color={colors.light.destructive} />
                  <Text style={styles.logoutText}>লগআউট</Text>
                </TouchableOpacity>
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
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "90%", paddingHorizontal: 20 },
  handle: { width: 40, height: 4, backgroundColor: colors.light.border, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 8 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: "700" as const, color: colors.light.text },
  form: { gap: 12, paddingBottom: 16 },
  input: {
    backgroundColor: colors.light.muted,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: colors.light.text,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  primaryBtn: {
    backgroundColor: colors.light.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 16 },
  linkText: { textAlign: "center", color: colors.light.primary, fontSize: 14, fontWeight: "600" as const, paddingVertical: 4 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: colors.light.primarySoft, borderRadius: 16, padding: 14 },
  profileIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  profileName: { fontSize: 16, fontWeight: "700" as const, color: colors.light.text },
  profilePhone: { fontSize: 13, color: colors.light.mutedForeground },
  profileAddress: { fontSize: 12, color: colors.light.mutedForeground },
  statRow: { flexDirection: "row", gap: 12 },
  stat: { flex: 1, backgroundColor: colors.light.muted, borderRadius: 14, padding: 14, alignItems: "center" },
  statNum: { fontSize: 22, fontWeight: "800" as const, color: colors.light.primary },
  statLabel: { fontSize: 11, color: colors.light.mutedForeground, marginTop: 2 },
  sectionLabel: { fontSize: 15, fontWeight: "700" as const, color: colors.light.text },
  empty: { alignItems: "center", paddingVertical: 24, gap: 8 },
  emptyText: { color: colors.light.mutedForeground, fontSize: 14 },
  orderCard: {
    backgroundColor: colors.light.muted,
    borderRadius: 12,
    padding: 12,
    gap: 2,
  },
  orderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderProduct: { fontSize: 14, fontWeight: "600" as const, color: colors.light.text },
  orderAmount: { fontSize: 14, fontWeight: "700" as const, color: colors.light.primary },
  orderMeta: { fontSize: 12, color: colors.light.mutedForeground },
  orderDate: { fontSize: 10, color: colors.light.mutedForeground },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.light.destructive },
  logoutText: { color: colors.light.destructive, fontWeight: "600" as const, fontSize: 14 },
});
