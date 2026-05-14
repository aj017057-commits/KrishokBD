import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { GEMINI_API_KEY, Product } from "@/constants/data";
import { useApp } from "@/context/AppContext";

type FarmerView = "login" | "register" | "dashboard";

const CATEGORIES: { key: Product["cat"]; label: string }[] = [
  { key: "vege", label: "সবজি" },
  { key: "fruit", label: "ফল" },
  { key: "leafy", label: "শাক" },
  { key: "fish", label: "মাছ" },
  { key: "ready", label: "রেডি টু কুক" },
];

const UNITS = ["কেজি", "পিস", "ডজন", "আটি", "প্যাক"];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function FarmerModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const {
    currentFarmer,
    farmerLogin,
    farmerRegister,
    farmerLogout,
    addProduct,
    deleteProduct,
    getFarmerProducts,
    getFarmerOrders,
  } = useApp();

  const [view, setView] = useState<FarmerView>(currentFarmer ? "dashboard" : "login");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regProductType, setRegProductType] = useState("");
  const [regPass, setRegPass] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [prodImage, setProdImage] = useState<string | null>(null);
  const [prodImageBase64, setProdImageBase64] = useState<string | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodUnit, setProdUnit] = useState("কেজি");
  const [prodCat, setProdCat] = useState<Product["cat"]>("vege");
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (visible) setView(currentFarmer ? "dashboard" : "login");
  }, [visible, currentFarmer]);

  const handleLogin = () => {
    if (!loginPhone || !loginPass) { Alert.alert("সব তথ্য দিন"); return; }
    const result = farmerLogin(loginPhone, loginPass);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setView("dashboard");
    } else {
      Alert.alert("লগইন ব্যর্থ", result.error);
    }
  };

  const handleRegister = () => {
    if (!regName || !regPhone || !regAddress || !regPass) { Alert.alert("সব তথ্য দিন"); return; }
    const result = farmerRegister(regName, regPhone, regAddress, regProductType || "সবজি", regPass);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setView("dashboard");
    } else {
      Alert.alert("রেজিস্ট্রেশন ব্যর্থ", result.error);
    }
  };

  const handleLogout = () => {
    farmerLogout();
    setLoginPhone("");
    setLoginPass("");
    setView("login");
    onClose();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      setProdImage(result.assets[0].uri);
      const base64 = result.assets[0].base64 ?? null;
      setProdImageBase64(base64);
      if (base64) {
        generateAIDescription(base64, result.assets[0].mimeType ?? "image/jpeg");
      }
    }
  };

  const generateAIDescription = async (base64: string, mimeType: string) => {
    setAiLoading(true);
    try {
      const payload = {
        contents: [{
          parts: [
            { text: "এটি কোন কৃষি পণ্য? পণ্যের নাম বাংলায় দাও এবং একটি আকর্ষণীয় বিক্রয় বিবরণ বাংলায় লেখো। Format: নাম: [পণ্যের নাম]\nবিবরণ: [১-২ বাক্যে বিবরণ]" },
            { inlineData: { mimeType, data: base64 } },
          ],
        }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 200 },
      };
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );
      const data = await resp.json();
      const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const nameMatch = text.match(/নাম:\s*(.+)/);
      const descMatch = text.match(/বিবরণ:\s*(.+)/);
      if (nameMatch) setProdName(nameMatch[1].trim());
      if (descMatch) setProdDesc(descMatch[1].trim());
    } catch {
      setProdName("পণ্যের নাম লিখুন");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (!prodName || !prodPrice) { Alert.alert("পণ্যের নাম ও দাম দিন"); return; }
    if (!currentFarmer) return;
    addProduct({
      title: prodName,
      price: Number(prodPrice),
      unit: prodUnit,
      cat: prodCat,
      farmer: currentFarmer.name,
      farmerId: currentFarmer.id,
      desc: prodDesc,
      img: prodImage ?? "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&w=400",
      badge: "টাটকা",
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setProdImage(null);
    setProdImageBase64(null);
    setProdName("");
    setProdDesc("");
    setProdPrice("");
    setProdUnit("কেজি");
    setProdCat("vege");
    setShowAddForm(false);
    Alert.alert("সফল!", "পণ্য যোগ করা হয়েছে");
  };

  const farmerProducts = currentFarmer ? getFarmerProducts(currentFarmer.id) : [];
  const farmerOrders = currentFarmer ? getFarmerOrders(currentFarmer.id) : [];
  const totalSales = farmerOrders.reduce((s, o) => s + o.total, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              {view === "login" ? "কৃষক লগইন" : view === "register" ? "কৃষক রেজিস্ট্রেশন" : "কৃষক ড্যাশবোর্ড"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={22} color={colors.light.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {view === "login" && (
              <View style={styles.form}>
                <View style={styles.demoHint}>
                  <Feather name="info" size={12} color={colors.light.primary} />
                  <Text style={styles.demoText}>ডেমো: 01700000001 / 1234</Text>
                </View>
                <TextInput style={styles.input} placeholder="মোবাইল নম্বর" value={loginPhone} onChangeText={setLoginPhone} keyboardType="phone-pad" placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="পাসওয়ার্ড" value={loginPass} onChangeText={setLoginPass} secureTextEntry placeholderTextColor={colors.light.mutedForeground} />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
                  <Text style={styles.primaryBtnText}>লগইন</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("register")}>
                  <Text style={styles.linkText}>নতুন কৃষক? রেজিস্ট্রেশন করুন</Text>
                </TouchableOpacity>
              </View>
            )}

            {view === "register" && (
              <View style={styles.form}>
                <TextInput style={styles.input} placeholder="আপনার নাম" value={regName} onChangeText={setRegName} placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="মোবাইল নম্বর" value={regPhone} onChangeText={setRegPhone} keyboardType="phone-pad" placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="ঠিকানা" value={regAddress} onChangeText={setRegAddress} placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="পণ্যের ধরন (যেমন: সবজি, ফল)" value={regProductType} onChangeText={setRegProductType} placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="পাসওয়ার্ড" value={regPass} onChangeText={setRegPass} secureTextEntry placeholderTextColor={colors.light.mutedForeground} />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
                  <Text style={styles.primaryBtnText}>রেজিস্ট্রেশন</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("login")}>
                  <Text style={styles.linkText}>ইতিমধ্যে নিবন্ধিত? লগইন করুন</Text>
                </TouchableOpacity>
              </View>
            )}

            {view === "dashboard" && currentFarmer && (
              <View style={styles.form}>
                <View style={styles.profileCard}>
                  <View style={styles.profileIcon}>
                    <Feather name="user" size={22} color={colors.light.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={styles.profileName}>{currentFarmer.name}</Text>
                      {currentFarmer.verified && <Feather name="check-circle" size={14} color={colors.light.primary} />}
                    </View>
                    <Text style={styles.profileAddress}>{currentFarmer.address}</Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <Text style={styles.statNum}>{farmerProducts.length}</Text>
                    <Text style={styles.statLabel}>পণ্য</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statNum}>৳{totalSales}</Text>
                    <Text style={styles.statLabel}>বিক্রি</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statNum}>{farmerOrders.length}</Text>
                    <Text style={styles.statLabel}>অর্ডার</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => setShowAddForm(!showAddForm)}
                >
                  <Feather name={showAddForm ? "minus" : "plus"} size={16} color="#fff" />
                  <Text style={styles.addBtnText}>{showAddForm ? "বাতিল" : "নতুন পণ্য যোগ করুন"}</Text>
                </TouchableOpacity>

                {showAddForm && (
                  <View style={styles.addForm}>
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                      {prodImage ? (
                        <Image source={{ uri: prodImage }} style={styles.pickedImage} />
                      ) : (
                        <View style={styles.imagePickerInner}>
                          <Feather name="camera" size={24} color={colors.light.mutedForeground} />
                          <Text style={styles.imagePickerText}>ছবি বেছে নিন</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    {aiLoading && (
                      <View style={styles.aiRow}>
                        <ActivityIndicator size="small" color={colors.light.primary} />
                        <Text style={styles.aiText}>AI দিয়ে তথ্য তৈরি হচ্ছে...</Text>
                      </View>
                    )}
                    <TextInput style={styles.input} placeholder="পণ্যের নাম" value={prodName} onChangeText={setProdName} placeholderTextColor={colors.light.mutedForeground} />
                    <TextInput style={[styles.input, { height: 72 }]} placeholder="পণ্যের বিবরণ" value={prodDesc} onChangeText={setProdDesc} multiline placeholderTextColor={colors.light.mutedForeground} textAlignVertical="top" />
                    <TextInput style={styles.input} placeholder="দাম (টাকা)" value={prodPrice} onChangeText={setProdPrice} keyboardType="numeric" placeholderTextColor={colors.light.mutedForeground} />
                    <Text style={styles.selectLabel}>ইউনিট</Text>
                    <View style={styles.optionRow}>
                      {UNITS.map((u) => (
                        <TouchableOpacity key={u} style={[styles.option, prodUnit === u && styles.optionActive]} onPress={() => setProdUnit(u)}>
                          <Text style={[styles.optionText, prodUnit === u && styles.optionTextActive]}>{u}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <Text style={styles.selectLabel}>ক্যাটাগরি</Text>
                    <View style={styles.optionRow}>
                      {CATEGORIES.map((c) => (
                        <TouchableOpacity key={c.key} style={[styles.option, prodCat === c.key && styles.optionActive]} onPress={() => setProdCat(c.key)}>
                          <Text style={[styles.optionText, prodCat === c.key && styles.optionTextActive]}>{c.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity style={styles.primaryBtn} onPress={handleAddProduct}>
                      <Text style={styles.primaryBtnText}>পণ্য যোগ করুন</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={styles.sectionLabel}>আমার পণ্য ({farmerProducts.length})</Text>
                {farmerProducts.length === 0 ? (
                  <View style={styles.empty}>
                    <Feather name="package" size={28} color={colors.light.mutedForeground} />
                    <Text style={styles.emptyText}>কোনো পণ্য নেই</Text>
                  </View>
                ) : (
                  farmerProducts.map((p) => (
                    <View key={p.id} style={styles.productRow}>
                      <Image source={{ uri: p.img }} style={styles.productRowImg} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.productRowName}>{p.title}</Text>
                        <Text style={styles.productRowPrice}>৳{p.price}/{p.unit}</Text>
                      </View>
                      <TouchableOpacity onPress={() => deleteProduct(p.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Feather name="trash-2" size={18} color={colors.light.destructive} />
                      </TouchableOpacity>
                    </View>
                  ))
                )}

                <Text style={styles.sectionLabel}>প্রাপ্ত অর্ডার ({farmerOrders.length})</Text>
                {farmerOrders.length === 0 ? (
                  <View style={styles.empty}>
                    <Feather name="clipboard" size={28} color={colors.light.mutedForeground} />
                    <Text style={styles.emptyText}>কোনো অর্ডার নেই</Text>
                  </View>
                ) : (
                  farmerOrders.slice().reverse().map((o) => (
                    <View key={o.id} style={styles.orderCard}>
                      <View style={styles.orderRow}>
                        <Text style={styles.orderProduct}>{o.productName}</Text>
                        <Text style={styles.orderAmount}>৳{o.total}</Text>
                      </View>
                      <Text style={styles.orderMeta}>{o.customerName} · {o.customerPhone}</Text>
                      <Text style={styles.orderAddress}>{o.customerAddress}</Text>
                      <Text style={styles.orderDate}>{new Date(o.date).toLocaleDateString("bn-BD")}</Text>
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
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "92%", paddingHorizontal: 20 },
  handle: { width: 40, height: 4, backgroundColor: colors.light.border, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 8 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700" as const, color: colors.light.text },
  form: { gap: 12, paddingBottom: 16 },
  demoHint: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.light.primarySoft, padding: 10, borderRadius: 10 },
  demoText: { fontSize: 12, color: colors.light.primary, fontWeight: "600" as const },
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
  primaryBtn: { backgroundColor: colors.light.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 16 },
  linkText: { textAlign: "center", color: colors.light.primary, fontSize: 14, fontWeight: "600" as const, paddingVertical: 4 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: colors.light.primarySoft, borderRadius: 16, padding: 14 },
  profileIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  profileName: { fontSize: 16, fontWeight: "700" as const, color: colors.light.text },
  profileAddress: { fontSize: 12, color: colors.light.mutedForeground },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, backgroundColor: colors.light.primarySoft, borderRadius: 14, padding: 12, alignItems: "center" },
  statNum: { fontSize: 18, fontWeight: "800" as const, color: colors.light.primary },
  statLabel: { fontSize: 10, color: colors.light.mutedForeground, marginTop: 2 },
  addBtn: { backgroundColor: colors.light.primary, borderRadius: 14, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  addBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 14 },
  addForm: { backgroundColor: colors.light.muted, borderRadius: 16, padding: 14, gap: 10 },
  imagePicker: { borderRadius: 12, overflow: "hidden", backgroundColor: "#e5e7eb", height: 120, alignItems: "center", justifyContent: "center" },
  imagePickerInner: { alignItems: "center", gap: 8 },
  imagePickerText: { fontSize: 12, color: colors.light.mutedForeground },
  pickedImage: { width: "100%", height: 120, resizeMode: "cover" },
  aiRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  aiText: { fontSize: 12, color: colors.light.primary, fontWeight: "600" as const },
  selectLabel: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  option: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.light.border, backgroundColor: "#fff" },
  optionActive: { backgroundColor: colors.light.primary, borderColor: colors.light.primary },
  optionText: { fontSize: 12, color: colors.light.mutedForeground },
  optionTextActive: { color: "#fff", fontWeight: "600" as const },
  sectionLabel: { fontSize: 15, fontWeight: "700" as const, color: colors.light.text, marginTop: 4 },
  empty: { alignItems: "center", paddingVertical: 20, gap: 8 },
  emptyText: { color: colors.light.mutedForeground, fontSize: 13 },
  productRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#fff", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: colors.light.border },
  productRowImg: { width: 44, height: 44, borderRadius: 8 },
  productRowName: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text },
  productRowPrice: { fontSize: 12, color: colors.light.primary, fontWeight: "700" as const },
  orderCard: { backgroundColor: colors.light.muted, borderRadius: 12, padding: 12, gap: 2 },
  orderRow: { flexDirection: "row", justifyContent: "space-between" },
  orderProduct: { fontSize: 14, fontWeight: "600" as const, color: colors.light.text },
  orderAmount: { fontSize: 14, fontWeight: "700" as const, color: colors.light.primary },
  orderMeta: { fontSize: 12, color: colors.light.mutedForeground },
  orderAddress: { fontSize: 11, color: colors.light.mutedForeground },
  orderDate: { fontSize: 10, color: colors.light.mutedForeground },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.light.destructive },
  logoutText: { color: colors.light.destructive, fontWeight: "600" as const, fontSize: 14 },
});
