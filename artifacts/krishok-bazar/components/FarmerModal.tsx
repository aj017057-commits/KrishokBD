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

const MALE_LOGO = require("@/assets/images/farmer-male.png");
const FEMALE_LOGO = require("@/assets/images/farmer-female.png");

type FarmerView = "login" | "register" | "dashboard";

const PROD_CATEGORIES: { key: Product["cat"]; label: string }[] = [
  { key: "vege",  label: "সবজি" },
  { key: "leafy", label: "শাক" },
  { key: "fish",  label: "মাছ" },
  { key: "fruit", label: "ফল" },
  { key: "meat",  label: "মাংস" },
  { key: "dairy", label: "ডিম/দুগ্ধ" },
  { key: "spice", label: "মশলা" },
  { key: "rice",  label: "চাল" },
  { key: "honey", label: "মধু" },
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
    orders,
    newOrdersCount,
    clearNewOrders,
  } = useApp();

  const [view, setView] = useState<FarmerView>(currentFarmer ? "dashboard" : "login");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regGender, setRegGender] = useState<"male" | "female">("male");
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

  React.useEffect(() => {
    if (visible) {
      setView(currentFarmer ? "dashboard" : "login");
      if (currentFarmer && newOrdersCount > 0) clearNewOrders();
    }
  }, [visible, currentFarmer, newOrdersCount, clearNewOrders]);

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
      if (base64) generateAIDescription(base64, result.assets[0].mimeType ?? "image/jpeg");
    }
  };

  const generateAIDescription = async (base64: string, mimeType: string) => {
    if (!GEMINI_API_KEY) {
      Alert.alert("API Key নেই", "GEMINI_API_KEY সিস্টেমে সেট করুন।");
      return;
    }
    setAiLoading(true);
    try {
      const payload = {
        contents: [{
          parts: [
            {
              text: `তুমি একজন বাংলাদেশি কৃষি বিশেষজ্ঞ। ছবিটি বিশ্লেষণ করো।
এই পণ্যের জন্য নিচের ফরম্যাটে বাংলায় তথ্য দাও:
নাম: [পণ্যের পেশাদার বাংলা নাম]
বিবরণ: [২ বাক্যে আকর্ষণীয় বিক্রয় বিবরণ — তাজা, পুষ্টিগুণ, ব্যবহার উল্লেখ করো]
মূল্য: [বাংলাদেশের বাজার মূল্য অনুযায়ী কেজি/পিস প্রতি সর্বোচ্চ যুক্তিসঙ্গত মূল্য শুধু সংখ্যায়]`,
            },
            { inlineData: { mimeType, data: base64 } },
          ],
        }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 300 },
      };
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );
      const data = await resp.json();
      const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const nameMatch = text.match(/নাম:\s*(.+)/);
      const descMatch = text.match(/বিবরণ:\s*([\s\S]+?)(?=মূল্য:|$)/);
      const priceMatch = text.match(/মূল্য:\s*(\d+)/);
      if (nameMatch) setProdName(nameMatch[1].trim());
      if (descMatch) setProdDesc(descMatch[1].trim().replace(/\n/g, " "));
      if (priceMatch) setProdPrice(priceMatch[1].trim());
    } catch {
      Alert.alert("AI ব্যর্থ", "ছবি বিশ্লেষণ করা যায়নি। হাতে তথ্য দিন।");
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
    setProdImage(null); setProdImageBase64(null);
    setProdName(""); setProdDesc(""); setProdPrice("");
    setProdUnit("কেজি"); setProdCat("vege");
    setShowAddForm(false);
    Alert.alert("সফল!", "পণ্য যোগ করা হয়েছে।");
  };

  const farmerProducts = currentFarmer ? getFarmerProducts(currentFarmer.id) : [];
  const farmerOrders = currentFarmer ? getFarmerOrders(currentFarmer.id) : [];
  const totalRevenue = farmerOrders.reduce((s, o) => s + o.grandTotal, 0);
  const farmerAvatar = currentFarmer?.gender === "female" ? FEMALE_LOGO : MALE_LOGO;
  const allOrders = [...orders].reverse();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Image source={require("@/assets/images/icon.png")} style={styles.headerLogo} />
              <View>
                <Text style={styles.headerTitle}>
                  {view === "login" ? "কৃষক লগইন" : view === "register" ? "কৃষক নিবন্ধন" : "কৃষক ড্যাশবোর্ড"}
                </Text>
                {view === "dashboard" && newOrdersCount > 0 && (
                  <View style={styles.newOrderAlertRow}>
                    <View style={styles.newOrderDot} />
                    <Text style={styles.newOrderAlertText}>
                      {newOrdersCount}টি নতুন অর্ডার!
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={colors.light.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* LOGIN */}
            {view === "login" && (
              <View style={styles.form}>
                <View style={styles.demoHint}>
                  <Feather name="info" size={12} color={colors.light.primary} />
                  <Text style={styles.demoText}>ডেমো: 01700000001 · পাসওয়ার্ড: 1234</Text>
                </View>
                <TextInput style={styles.input} placeholder="মোবাইল নম্বর" value={loginPhone} onChangeText={setLoginPhone} keyboardType="phone-pad" placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="পাসওয়ার্ড" value={loginPass} onChangeText={setLoginPass} secureTextEntry placeholderTextColor={colors.light.mutedForeground} />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
                  <Text style={styles.primaryBtnText}>লগইন</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("register")}>
                  <Text style={styles.linkText}>নতুন কৃষক? নিবন্ধন করুন</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* REGISTER */}
            {view === "register" && (
              <View style={styles.form}>
                <TextInput style={styles.input} placeholder="আপনার পূর্ণ নাম" value={regName} onChangeText={setRegName} placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="মোবাইল নম্বর" value={regPhone} onChangeText={setRegPhone} keyboardType="phone-pad" placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="আপনার ঠিকানা (জেলা)" value={regAddress} onChangeText={setRegAddress} placeholderTextColor={colors.light.mutedForeground} />
                <TextInput style={styles.input} placeholder="কী পণ্য বিক্রি করেন?" value={regProductType} onChangeText={setRegProductType} placeholderTextColor={colors.light.mutedForeground} />
                <View style={styles.genderRow}>
                  <Text style={styles.selectLabel}>লিঙ্গ</Text>
                  <View style={styles.genderBtns}>
                    {(["male", "female"] as const).map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.genderBtn, regGender === g && styles.genderBtnActive]}
                        onPress={() => setRegGender(g)}
                      >
                        <Image source={g === "male" ? MALE_LOGO : FEMALE_LOGO} style={styles.genderBtnImg} />
                        <Text style={[styles.genderBtnText, regGender === g && styles.genderBtnTextActive]}>
                          {g === "male" ? "পুরুষ" : "মহিলা"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <TextInput style={styles.input} placeholder="পাসওয়ার্ড তৈরি করুন" value={regPass} onChangeText={setRegPass} secureTextEntry placeholderTextColor={colors.light.mutedForeground} />
                <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
                  <Text style={styles.primaryBtnText}>নিবন্ধন করুন</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setView("login")}>
                  <Text style={styles.linkText}>ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* DASHBOARD */}
            {view === "dashboard" && currentFarmer && (
              <View style={styles.form}>
                {/* Profile Banner */}
                <View style={styles.profileBanner}>
                  <Image source={farmerAvatar} style={styles.profileAvatar} resizeMode="cover" />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={styles.profileName}>{currentFarmer.name}</Text>
                      {currentFarmer.verified && (
                        <View style={styles.verifiedChip}>
                          <Feather name="check-circle" size={12} color={colors.light.primary} />
                          <Text style={styles.verifiedChipText}>যাচাইকৃত</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.profileSub}>{currentFarmer.address}</Text>
                    <Text style={styles.profileSub}>{currentFarmer.products}</Text>
                  </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                  {[
                    { num: farmerProducts.length, label: "পণ্য" },
                    { num: farmerOrders.length, label: "অর্ডার" },
                    { num: `৳${totalRevenue}`, label: "মোট আয়" },
                  ].map(({ num, label }) => (
                    <View key={label} style={styles.statCard}>
                      <Text style={styles.statNum}>{num}</Text>
                      <Text style={styles.statLabel}>{label}</Text>
                    </View>
                  ))}
                </View>

                {/* Add Product */}
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddForm(!showAddForm)}>
                  <Feather name={showAddForm ? "minus-circle" : "plus-circle"} size={16} color="#fff" />
                  <Text style={styles.addBtnText}>{showAddForm ? "ফর্ম বন্ধ করুন" : "নতুন পণ্য যোগ করুন"}</Text>
                </TouchableOpacity>

                {showAddForm && (
                  <View style={styles.addForm}>
                    <View style={styles.aiLabel}>
                      <Image source={require("@/assets/images/icon.png")} style={styles.aiLabelIcon} />
                      <Text style={styles.aiLabelText}>রিক্তাজ AI — ছবি দেখে স্বয়ংক্রিয় তথ্য তৈরি করবে</Text>
                    </View>
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                      {prodImage ? (
                        <Image source={{ uri: prodImage }} style={styles.pickedImage} />
                      ) : (
                        <View style={styles.imagePickerInner}>
                          <Feather name="camera" size={28} color={colors.light.primary} />
                          <Text style={styles.imagePickerText}>পণ্যের ছবি আপলোড করুন</Text>
                          <Text style={styles.imagePickerSub}>AI স্বয়ংক্রিয়ভাবে নাম, বিবরণ ও মূল্য তৈরি করবে</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    {aiLoading && (
                      <View style={styles.aiRow}>
                        <Image source={require("@/assets/images/icon.png")} style={styles.aiRowIcon} />
                        <ActivityIndicator size="small" color={colors.light.primary} />
                        <Text style={styles.aiText}>রিক্তাজ AI ছবি বিশ্লেষণ করছে...</Text>
                      </View>
                    )}
                    <View style={styles.fieldLabel}>
                      <Text style={styles.fieldLabelText}>পণ্যের নাম</Text>
                    </View>
                    <TextInput style={styles.input} placeholder="পণ্যের নাম" value={prodName} onChangeText={setProdName} placeholderTextColor={colors.light.mutedForeground} />
                    <View style={styles.fieldLabel}>
                      <Text style={styles.fieldLabelText}>বিবরণ</Text>
                    </View>
                    <TextInput style={[styles.input, { height: 72 }]} placeholder="পণ্যের বিবরণ" value={prodDesc} onChangeText={setProdDesc} multiline placeholderTextColor={colors.light.mutedForeground} textAlignVertical="top" />
                    <View style={styles.fieldLabel}>
                      <Text style={styles.fieldLabelText}>মূল্য (টাকা)</Text>
                    </View>
                    <TextInput style={styles.input} placeholder="দাম লিখুন" value={prodPrice} onChangeText={setProdPrice} keyboardType="numeric" placeholderTextColor={colors.light.mutedForeground} />
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
                      {PROD_CATEGORIES.map((c) => (
                        <TouchableOpacity key={c.key} style={[styles.option, prodCat === c.key && styles.optionActive]} onPress={() => setProdCat(c.key)}>
                          <Text style={[styles.optionText, prodCat === c.key && styles.optionTextActive]}>{c.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity style={styles.primaryBtn} onPress={handleAddProduct}>
                      <Feather name="plus" size={16} color="#fff" />
                      <Text style={styles.primaryBtnText}>পণ্য যোগ করুন</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Products List */}
                <Text style={styles.sectionLabel}>আমার পণ্য ({farmerProducts.length})</Text>
                {farmerProducts.length === 0 ? (
                  <View style={styles.empty}>
                    <Feather name="package" size={28} color={colors.light.mutedForeground} />
                    <Text style={styles.emptyText}>এখনো কোনো পণ্য নেই</Text>
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

                {/* My Orders */}
                <Text style={styles.sectionLabel}>আমার পণ্যের অর্ডার ({farmerOrders.length})</Text>
                {farmerOrders.length === 0 ? (
                  <View style={styles.empty}>
                    <Feather name="clipboard" size={28} color={colors.light.mutedForeground} />
                    <Text style={styles.emptyText}>এখনো কোনো অর্ডার নেই</Text>
                  </View>
                ) : (
                  farmerOrders.slice().reverse().map((o) => (
                    <View key={o.id} style={styles.orderCard}>
                      <View style={styles.orderRow}>
                        <Text style={styles.orderId}>#{o.id.slice(-6).toUpperCase()}</Text>
                        <Text style={styles.orderAmount}>৳{o.grandTotal}</Text>
                      </View>
                      <Text style={styles.orderItems} numberOfLines={1}>
                        {o.items.map(i => `${i.title} ×${i.qty}`).join(", ")}
                      </Text>
                      <Text style={styles.orderMeta}>{o.customerName} · {o.customerPhone}</Text>
                      <Text style={styles.orderAddress} numberOfLines={1}>📍 {o.customerAddress}</Text>
                      <Text style={styles.orderDate}>{new Date(o.date).toLocaleDateString("bn-BD")}</Text>
                    </View>
                  ))
                )}

                {/* All Customer Orders (Admin View) */}
                <View style={styles.adminSectionHeader}>
                  <View style={styles.adminSectionTitleRow}>
                    <Feather name="users" size={15} color={colors.light.primary} />
                    <Text style={styles.sectionLabel}>সকল গ্রাহকের অর্ডার ({allOrders.length})</Text>
                  </View>
                  {allOrders.length > 0 && (
                    <View style={styles.allOrdersBadge}>
                      <Text style={styles.allOrdersBadgeText}>অ্যাডমিন</Text>
                    </View>
                  )}
                </View>
                {allOrders.length === 0 ? (
                  <View style={styles.empty}>
                    <Feather name="inbox" size={28} color={colors.light.mutedForeground} />
                    <Text style={styles.emptyText}>এখনো কোনো গ্রাহক অর্ডার নেই</Text>
                  </View>
                ) : (
                  allOrders.map((o) => (
                    <View key={o.id} style={[styles.orderCard, styles.allOrderCard]}>
                      <View style={styles.orderRow}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <Text style={styles.orderId}>#{o.id.slice(-6).toUpperCase()}</Text>
                          <View style={[styles.statusChip, o.status === "confirmed" ? styles.statusConfirmed : styles.statusDelivered]}>
                            <Text style={styles.statusChipText}>
                              {o.status === "confirmed" ? "নিশ্চিত" : "ডেলিভারি হয়েছে"}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.orderAmount}>৳{o.grandTotal}</Text>
                      </View>
                      <Text style={styles.orderItems} numberOfLines={2}>
                        {o.items.map(i => `${i.title} ×${i.qty}`).join(", ")}
                      </Text>
                      <View style={styles.customerInfoRow}>
                        <Feather name="user" size={12} color={colors.light.mutedForeground} />
                        <Text style={styles.orderMeta}>{o.customerName} · {o.customerPhone}</Text>
                      </View>
                      <View style={styles.customerInfoRow}>
                        <Feather name="map-pin" size={12} color={colors.light.mutedForeground} />
                        <Text style={styles.orderAddress} numberOfLines={1}>{o.customerAddress}</Text>
                      </View>
                      <View style={styles.orderFooterRow}>
                        <Text style={styles.orderDate}>{new Date(o.date).toLocaleString("bn-BD")}</Text>
                        <Text style={styles.deliveryAreaTag}>
                          {o.deliveryArea === "dhaka" ? "🏙 ঢাকা" : "🗺 ঢাকার বাইরে"}
                        </Text>
                      </View>
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
  sheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: "94%", paddingHorizontal: 20,
  },
  handle: { width: 40, height: 4, backgroundColor: colors.light.border, borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 8 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerLogo: { width: 30, height: 30, borderRadius: 15 },
  headerTitle: { fontSize: 20, fontWeight: "700" as const, color: colors.light.text },
  closeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.light.muted, alignItems: "center", justifyContent: "center" },
  form: { gap: 12, paddingBottom: 16 },
  demoHint: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.light.primarySoft, padding: 10, borderRadius: 10 },
  demoText: { fontSize: 12, color: colors.light.primary, fontWeight: "600" as const },
  input: {
    backgroundColor: colors.light.muted, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 14, color: colors.light.text,
    borderWidth: 1, borderColor: colors.light.border,
  },
  primaryBtn: {
    backgroundColor: colors.light.primary, borderRadius: 14, paddingVertical: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 16 },
  linkText: { textAlign: "center" as const, color: colors.light.primary, fontSize: 14, fontWeight: "600" as const, paddingVertical: 4 },
  genderRow: { gap: 8 },
  selectLabel: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text },
  genderBtns: { flexDirection: "row", gap: 10 },
  genderBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 8,
    padding: 10, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.light.border, backgroundColor: "#fff",
  },
  genderBtnActive: { borderColor: colors.light.primary, backgroundColor: colors.light.primarySoft },
  genderBtnImg: { width: 32, height: 32, borderRadius: 16 },
  genderBtnText: { fontSize: 13, color: colors.light.mutedForeground, fontWeight: "600" as const },
  genderBtnTextActive: { color: colors.light.primary },
  profileBanner: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: colors.light.primarySoft, borderRadius: 18, padding: 14,
  },
  profileAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: colors.light.primary },
  profileName: { fontSize: 16, fontWeight: "700" as const, color: colors.light.text },
  profileSub: { fontSize: 12, color: colors.light.mutedForeground },
  verifiedChip: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "#fff", paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20,
  },
  verifiedChipText: { fontSize: 10, color: colors.light.primary, fontWeight: "600" as const },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, backgroundColor: colors.light.primarySoft, borderRadius: 14, padding: 12, alignItems: "center" },
  statNum: { fontSize: 18, fontWeight: "800" as const, color: colors.light.primary },
  statLabel: { fontSize: 10, color: colors.light.mutedForeground, marginTop: 2 },
  addBtn: {
    backgroundColor: colors.light.primary, borderRadius: 14, paddingVertical: 12,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 14 },
  addForm: { backgroundColor: colors.light.muted, borderRadius: 18, padding: 14, gap: 10 },
  aiLabel: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.light.primarySoft, borderRadius: 10, padding: 10,
  },
  aiLabelIcon: { width: 24, height: 24, borderRadius: 12 },
  aiLabelText: { fontSize: 12, color: colors.light.primary, fontWeight: "600" as const, flex: 1 },
  imagePicker: {
    borderRadius: 14, overflow: "hidden", backgroundColor: "#fff",
    height: 130, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: colors.light.primary, borderStyle: "dashed",
  },
  imagePickerInner: { alignItems: "center", gap: 6, padding: 16 },
  imagePickerText: { fontSize: 13, color: colors.light.primary, fontWeight: "600" as const },
  imagePickerSub: { fontSize: 10, color: colors.light.mutedForeground, textAlign: "center" as const },
  pickedImage: { width: "100%", height: 130 },
  aiRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.light.primarySoft, borderRadius: 10, padding: 10,
  },
  aiRowIcon: { width: 22, height: 22, borderRadius: 11 },
  aiText: { fontSize: 12, color: colors.light.primary, fontWeight: "600" as const },
  fieldLabel: {},
  fieldLabelText: { fontSize: 12, fontWeight: "700" as const, color: colors.light.mutedForeground, textTransform: "uppercase" as const, letterSpacing: 0.5 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  option: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.light.border, backgroundColor: "#fff" },
  optionActive: { backgroundColor: colors.light.primary, borderColor: colors.light.primary },
  optionText: { fontSize: 12, color: colors.light.mutedForeground },
  optionTextActive: { color: "#fff", fontWeight: "600" as const },
  newOrderAlertRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  newOrderDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#ef4444" },
  newOrderAlertText: { fontSize: 11, color: "#ef4444", fontWeight: "700" as const },
  adminSectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 4 },
  adminSectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  allOrdersBadge: { backgroundColor: "#fef3c7", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1, borderColor: "#fde68a" },
  allOrdersBadgeText: { fontSize: 10, color: "#92400e", fontWeight: "700" as const },
  allOrderCard: { borderLeftWidth: 3, borderLeftColor: colors.light.primary },
  statusChip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 20 },
  statusConfirmed: { backgroundColor: "#dcfce7" },
  statusDelivered: { backgroundColor: colors.light.primarySoft },
  statusChipText: { fontSize: 9, fontWeight: "700" as const, color: colors.light.primary },
  customerInfoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  orderFooterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  deliveryAreaTag: { fontSize: 10, color: colors.light.mutedForeground },
  sectionLabel: { fontSize: 15, fontWeight: "700" as const, color: colors.light.text, marginTop: 4 },
  empty: { alignItems: "center", paddingVertical: 20, gap: 8 },
  emptyText: { color: colors.light.mutedForeground, fontSize: 13 },
  productRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#fff", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: colors.light.border },
  productRowImg: { width: 44, height: 44, borderRadius: 8 },
  productRowName: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text },
  productRowPrice: { fontSize: 12, color: colors.light.primary, fontWeight: "700" as const },
  orderCard: { backgroundColor: colors.light.muted, borderRadius: 12, padding: 12, gap: 3, borderWidth: 1, borderColor: colors.light.border },
  orderRow: { flexDirection: "row", justifyContent: "space-between" },
  orderId: { fontSize: 11, fontWeight: "700" as const, color: colors.light.primary },
  orderAmount: { fontSize: 14, fontWeight: "700" as const, color: colors.light.primary },
  orderItems: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text },
  orderMeta: { fontSize: 12, color: colors.light.mutedForeground },
  orderAddress: { fontSize: 11, color: colors.light.mutedForeground },
  orderDate: { fontSize: 10, color: colors.light.mutedForeground },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: 14, borderWidth: 1, borderColor: "#fee2e2", backgroundColor: "#fff5f5" },
  logoutText: { color: colors.light.destructive, fontWeight: "600" as const, fontSize: 14 },
});
