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

type PanelView = "login" | "register" | "history";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function CustomerModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { currentCustomer, customerLogin, customerRegister, customerLogout, getCustomerOrders } = useApp();

  const [view, setView] = useState<PanelView>(currentCustomer ? "history" : "login");
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

  const handleLogin = () => {
    if (!loginPhone || !loginPass) { Alert.alert("তথ্য দিন", "নম্বর ও পাসওয়ার্ড দিন"); return; }
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

  const handleRegister = () => {
    if (!regName || !regPhone || !regAddress || !regPass) { Alert.alert("তথ্য দিন", "সব ঘর পূরণ করুন"); return; }
    setLoading(true);
    const result = customerRegister(regName, regPhone, regAddress, regPass);
    setLoading(false);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setView("history");
    } else {
      Alert.alert("ব্যর্থ", result.error);
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
              {view === "login" ? "লগইন করুন" : view === "register" ? "নতুন অ্যাকাউন্ট" : "আমার প্রোফাইল"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={colors.light.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {view === "login" && (
              <View style={styles.form}>
                <TextInput style={styles.input} placeholder="মোবাইল নম্বর (01XXXXXXXXX)" value={loginPhone} onChangeText={setLoginPhone} keyboardType="phone-pad" placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="পাসওয়ার্ড" value={loginPass} onChangeText={setLoginPass} secureTextEntry placeholderTextColor={colors.light.mutedForeground} />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>লগইন</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("register")}>
                  <Text style={styles.linkText}>নতুন অ্যাকাউন্ট খুলুন</Text>
                </TouchableOpacity>
              </View>
            )}

            {view === "register" && (
              <View style={styles.form}>
                <TextInput style={styles.input} placeholder="সম্পূর্ণ নাম" value={regName} onChangeText={setRegName} placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="মোবাইল নম্বর" value={regPhone} onChangeText={setRegPhone} keyboardType="phone-pad" placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="ঠিকানা" value={regAddress} onChangeText={setRegAddress} placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="পাসওয়ার্ড তৈরি করুন" value={regPass} onChangeText={setRegPass} secureTextEntry placeholderTextColor={colors.light.mutedForeground} />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>অ্যাকাউন্ট তৈরি করুন</Text>}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("login")}>
                  <Text style={styles.linkText}>ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন</Text>
                </TouchableOpacity>
              </View>
            )}

            {view === "history" && currentCustomer && (
              <View style={styles.form}>
                <View style={styles.profileCard}>
                  <View style={styles.profileAvatarBox}>
                    <Feather name="user" size={26} color={colors.light.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.profileName}>{currentCustomer.name}</Text>
                    <Text style={styles.profilePhone}>{currentCustomer.phone}</Text>
                    <Text style={styles.profileAddress} numberOfLines={1}>{currentCustomer.address}</Text>
                  </View>
                </View>

                <View style={styles.statRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statNum}>{orders.length}</Text>
                    <Text style={styles.statLabel}>মোট অর্ডার</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={styles.statNum}>৳{totalSpent}</Text>
                    <Text style={styles.statLabel}>মোট ব্যয়</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={styles.statNum}>{orders.filter(o => o.status === "confirmed").length}</Text>
                    <Text style={styles.statLabel}>সক্রিয়</Text>
                  </View>
                </View>

                <Text style={styles.sectionLabel}>অর্ডার ইতিহাস</Text>
                {orders.length === 0 ? (
                  <View style={styles.empty}>
                    <Feather name="shopping-bag" size={36} color={colors.light.mutedForeground} />
                    <Text style={styles.emptyText}>এখনো কোনো অর্ডার নেই</Text>
                  </View>
                ) : (
                  orders.slice().reverse().map((order) => (
                    <View key={order.id} style={styles.orderCard}>
                      <View style={styles.orderTop}>
                        <View style={styles.orderBadge}>
                          <Text style={styles.orderBadgeText}>
                            {order.status === "confirmed" ? "✓ কনফার্ম" : order.status === "delivered" ? "✓ ডেলিভারড" : "মুলতবি"}
                          </Text>
                        </View>
                        <Text style={styles.orderDate}>{new Date(order.date).toLocaleDateString("bn-BD")}</Text>
                      </View>
                      {order.items.map((item, idx) => (
                        <View key={idx} style={styles.orderItem}>
                          <Text style={styles.orderItemName}>{item.title}</Text>
                          <Text style={styles.orderItemDetail}>{item.qty} {item.unit} × ৳{item.price}</Text>
                        </View>
                      ))}
                      <View style={styles.orderFooter}>
                        <Text style={styles.orderDelivery}>ডেলিভারি: ৳{order.deliveryCharge}</Text>
                        <Text style={styles.orderTotal}>মোট: ৳{order.grandTotal}</Text>
                      </View>
                      <Text style={styles.orderAddress} numberOfLines={1}>📍 {order.customerAddress}</Text>
                    </View>
                  ))
                )}

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                  <Feather name="log-out" size={15} color={colors.light.destructive} />
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
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "92%", paddingHorizontal: 20 },
  handle: { width: 40, height: 4, backgroundColor: colors.light.border, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 8 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: "700" as const, color: colors.light.text },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.light.muted, alignItems: "center", justifyContent: "center" },
  form: { gap: 12, paddingBottom: 24 },
  input: {
    backgroundColor: colors.light.muted, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 14, color: colors.light.text,
    borderWidth: 1, borderColor: colors.light.border,
  },
  primaryBtn: { backgroundColor: colors.light.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 16 },
  linkText: { textAlign: "center" as const, color: colors.light.primary, fontSize: 14, fontWeight: "600" as const, paddingVertical: 4 },
  profileCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: colors.light.primarySoft, borderRadius: 18, padding: 16,
  },
  profileAvatarBox: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
  },
  profileName: { fontSize: 16, fontWeight: "700" as const, color: colors.light.text },
  profilePhone: { fontSize: 13, color: colors.light.mutedForeground },
  profileAddress: { fontSize: 11, color: colors.light.mutedForeground, marginTop: 2 },
  statRow: { flexDirection: "row", backgroundColor: colors.light.muted, borderRadius: 16, padding: 14 },
  stat: { flex: 1, alignItems: "center" },
  statDivider: { width: 1, backgroundColor: colors.light.border },
  statNum: { fontSize: 20, fontWeight: "800" as const, color: colors.light.primary },
  statLabel: { fontSize: 10, color: colors.light.mutedForeground, marginTop: 2 },
  sectionLabel: { fontSize: 15, fontWeight: "700" as const, color: colors.light.text },
  empty: { alignItems: "center", paddingVertical: 28, gap: 10 },
  emptyText: { color: colors.light.mutedForeground, fontSize: 14 },
  orderCard: {
    backgroundColor: colors.light.muted, borderRadius: 14, padding: 14, gap: 6,
    borderWidth: 1, borderColor: colors.light.border,
  },
  orderTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderBadge: { backgroundColor: colors.light.primarySoft, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  orderBadgeText: { fontSize: 11, color: colors.light.primary, fontWeight: "600" as const },
  orderDate: { fontSize: 11, color: colors.light.mutedForeground },
  orderItem: { flexDirection: "row", justifyContent: "space-between" },
  orderItemName: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text },
  orderItemDetail: { fontSize: 12, color: colors.light.mutedForeground },
  orderFooter: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.light.border, paddingTop: 6 },
  orderDelivery: { fontSize: 12, color: colors.light.mutedForeground },
  orderTotal: { fontSize: 14, fontWeight: "700" as const, color: colors.light.primary },
  orderAddress: { fontSize: 11, color: colors.light.mutedForeground },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    paddingVertical: 13, borderRadius: 14,
    borderWidth: 1, borderColor: "#fee2e2", backgroundColor: "#fff5f5",
  },
  logoutText: { color: colors.light.destructive, fontWeight: "600" as const, fontSize: 14 },
});
