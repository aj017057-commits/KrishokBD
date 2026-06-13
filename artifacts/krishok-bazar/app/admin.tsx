import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { CATEGORIES, Order, Product } from "@/constants/data";
import { useApp } from "@/context/AppContext";

const ADMIN_KEY = "krishok_admin_session_v1";
const ADMIN_USERNAME = "@Ajzakir2020";
const ADMIN_PASSWORD = "Ajzakir@2020";

type AdminTab = "orders" | "farmers" | "products" | "settings";

const STATUS_BN: Record<NonNullable<Order["status"]>, string> = {
  pending:          "অপেক্ষমাণ",
  confirmed:        "নিশ্চিত",
  processing:       "প্রস্তুতি",
  packed:           "প্যাক করা",
  shipped:          "শিপড",
  out_for_delivery: "ডেলিভারিতে",
  delivered:        "ডেলিভারড",
};

const STATUS_COLORS: Record<NonNullable<Order["status"]>, object> = {
  pending:          { backgroundColor: "#fef9c3" },
  confirmed:        { backgroundColor: "#dcfce7" },
  processing:       { backgroundColor: "#dbeafe" },
  packed:           { backgroundColor: "#ede9fe" },
  shipped:          { backgroundColor: "#ffedd5" },
  out_for_delivery: { backgroundColor: "#fce7f3" },
  delivered:        { backgroundColor: "#d1fae5" },
};

function playAlertSound() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    try {
      const AudioCtx = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
        || (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      [0, 0.18, 0.36].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = delay === 0 ? 880 : delay === 0.18 ? 1100 : 660;
        gain.gain.setValueAtTime(0.35, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.2);
      });
    } catch { /* silent */ }
  }
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const {
    products, farmers, orders,
    addProduct, updateProduct, deleteProduct,
    newOrdersCount, clearNewOrders, updateOrderStatus,
  } = useApp();

  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [newOrderBanner, setNewOrderBanner] = useState(false);
  const [bannerCount, setBannerCount] = useState(0);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // CMS site settings
  const [cmsLoaded, setCmsLoaded] = useState(false);
  const [dhakaCharge, setDhakaCharge] = useState("60");
  const [outsideCharge, setOutsideCharge] = useState("120");
  const [extraPerKg, setExtraPerKg] = useState("30");
  const [bkashNum, setBkashNum] = useState("01700000000");
  const [nagadNum, setNagadNum] = useState("01700000000");
  const [rocketNum, setRocketNum] = useState("");
  const [contactPhone, setContactPhone] = useState("01700000000");
  const [contactEmail, setContactEmail] = useState("krishokbazar@gmail.com");
  const [contactAddress, setContactAddress] = useState("ঢাকা, বাংলাদেশ");
  const [siteNote, setSiteNote] = useState("সরাসরি কৃষকের কাছ থেকে তাজা পণ্য।");
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsSaved, setCmsSaved] = useState(false);

  const prevOrderLen = useRef(orders.length);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [epTitle, setEpTitle] = useState("");
  const [epPrice, setEpPrice] = useState("");
  const [epUnit, setEpUnit] = useState("কেজি");
  const [epCat, setEpCat] = useState<Product["cat"]>("vege");
  const [epDesc, setEpDesc] = useState("");
  const [epImg, setEpImg] = useState("");
  const [epBadge, setEpBadge] = useState("");

  useEffect(() => {
    AsyncStorage.getItem(ADMIN_KEY).then((v) => {
      if (v === "true") setLoggedIn(true);
      setSessionChecked(true);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("krishok_site_settings_v1").then((v) => {
      if (v) {
        try {
          const s = JSON.parse(v);
          if (s.dhakaCharge)   setDhakaCharge(s.dhakaCharge);
          if (s.outsideCharge) setOutsideCharge(s.outsideCharge);
          if (s.extraPerKg)    setExtraPerKg(s.extraPerKg);
          if (s.bkashNum)      setBkashNum(s.bkashNum);
          if (s.nagadNum)      setNagadNum(s.nagadNum);
          if (s.rocketNum)     setRocketNum(s.rocketNum);
          if (s.contactPhone)  setContactPhone(s.contactPhone);
          if (s.contactEmail)  setContactEmail(s.contactEmail);
          if (s.contactAddress) setContactAddress(s.contactAddress);
          if (s.siteNote)      setSiteNote(s.siteNote);
        } catch { /* ignore */ }
      }
      setCmsLoaded(true);
    });
  }, []);

  const saveCmsSettings = async () => {
    setCmsSaving(true);
    await AsyncStorage.setItem("krishok_site_settings_v1", JSON.stringify({
      dhakaCharge, outsideCharge, extraPerKg,
      bkashNum, nagadNum, rocketNum,
      contactPhone, contactEmail, contactAddress, siteNote,
    }));
    setCmsSaving(false);
    setCmsSaved(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCmsSaved(false), 2500);
  };

  useEffect(() => {
    if (!loggedIn || !sessionChecked) return;
    if (orders.length > prevOrderLen.current) {
      const diff = orders.length - prevOrderLen.current;
      playAlertSound();
      setBannerCount(diff);
      setNewOrderBanner(true);
      clearNewOrders();
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
      bannerTimer.current = setTimeout(() => setNewOrderBanner(false), 8000);
    }
    prevOrderLen.current = orders.length;
  }, [orders.length, loggedIn, sessionChecked, clearNewOrders]);

  const handleLogin = useCallback(() => {
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      AsyncStorage.setItem(ADMIN_KEY, "true");
      setLoggedIn(true);
      setLoginError("");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setLoginError("ভুল ইউজারনেম বা পাসওয়ার্ড");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [username, password]);

  const handleLogout = () => {
    Alert.alert("লগআউট", "আপনি কি অ্যাডমিন প্যানেল থেকে বের হতে চান?", [
      { text: "না", style: "cancel" },
      {
        text: "হ্যাঁ, বের হন",
        style: "destructive",
        onPress: () => {
          AsyncStorage.removeItem(ADMIN_KEY);
          setLoggedIn(false);
          router.back();
        },
      },
    ]);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setEpTitle(p.title); setEpPrice(String(p.price));
    setEpUnit(p.unit); setEpCat(p.cat);
    setEpDesc(p.desc); setEpImg(p.img);
    setEpBadge(p.badge ?? "");
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editProduct || !epTitle || !epPrice) { Alert.alert("নাম ও দাম আবশ্যক"); return; }
    updateProduct(editProduct.id, {
      title: epTitle, price: Number(epPrice),
      unit: epUnit, cat: epCat,
      desc: epDesc, img: epImg, badge: epBadge || undefined,
    });
    setShowEditModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const openAdd = () => {
    setEpTitle(""); setEpPrice(""); setEpUnit("কেজি");
    setEpCat("vege"); setEpDesc(""); setEpImg(""); setEpBadge("");
    setShowAddModal(true);
  };

  const saveAdd = () => {
    if (!epTitle || !epPrice) { Alert.alert("নাম ও দাম আবশ্যক"); return; }
    addProduct({
      title: epTitle, price: Number(epPrice),
      unit: epUnit, cat: epCat,
      desc: epDesc || `${epTitle} — তাজা ও গুণমানসম্পন্ন।`,
      img: epImg || "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&w=400",
      badge: epBadge || "টাটকা",
      farmer: "অ্যাডমিন", farmerId: 0,
    });
    setShowAddModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const confirmDelete = (p: Product) => {
    Alert.alert("পণ্য মুছুন", `"${p.title}" মুছে ফেলবেন?`, [
      { text: "না", style: "cancel" },
      { text: "মুছুন", style: "destructive", onPress: () => deleteProduct(p.id) },
    ]);
  };

  const moveToReady = (p: Product) => {
    updateProduct(p.id, { cat: "ready" });
    Alert.alert("সফল", `"${p.title}" রেডি টু কুক বিভাগে সরানো হয়েছে।`);
  };

  if (!sessionChecked) return null;

  if (!loggedIn) {
    return (
      <View style={[styles.loginBg, { paddingTop: insets.top + 24 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.light.primary} />
        </TouchableOpacity>
        <View style={styles.loginCard}>
          <Image source={require("@/assets/images/icon.png")} style={styles.loginLogo} />
          <Text style={styles.loginTitle}>অ্যাডমিন প্যানেল</Text>
          <Text style={styles.loginSub}>কৃষক বাজার · সুরক্ষিত প্রবেশদ্বার</Text>
          {loginError ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={14} color="#ef4444" />
              <Text style={styles.errorText}>{loginError}</Text>
            </View>
          ) : null}
          <View style={styles.inputWrap}>
            <Feather name="user" size={16} color={colors.light.mutedForeground} style={styles.inputIcon} />
            <TextInput
              style={styles.loginInput}
              placeholder="ইউজারনেম"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor={colors.light.mutedForeground}
            />
          </View>
          <View style={styles.inputWrap}>
            <Feather name="lock" size={16} color={colors.light.mutedForeground} style={styles.inputIcon} />
            <TextInput
              style={styles.loginInput}
              placeholder="পাসওয়ার্ড"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              placeholderTextColor={colors.light.mutedForeground}
            />
            <TouchableOpacity onPress={() => setShowPass((v) => !v)} style={styles.eyeBtn}>
              <Feather name={showPass ? "eye-off" : "eye"} size={16} color={colors.light.mutedForeground} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Feather name="log-in" size={16} color="#fff" />
            <Text style={styles.loginBtnText}>লগইন করুন</Text>
          </TouchableOpacity>
          <Text style={styles.secureNote}>🔒 এই পেজটি সম্পূর্ণ সুরক্ষিত এবং গোপন</Text>
        </View>
      </View>
    );
  }

  const allOrders = [...orders].reverse();
  const totalRevenue = orders.reduce((s, o) => s + o.grandTotal, 0);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require("@/assets/images/icon.png")} style={styles.headerLogo} />
          <View>
            <Text style={styles.headerTitle}>অ্যাডমিন ড্যাশবোর্ড</Text>
            <Text style={styles.headerSub}>কৃষক বাজার · Full Control</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={15} color={colors.light.destructive} />
        </TouchableOpacity>
      </View>

      {/* New Order Alert Banner */}
      {newOrderBanner && (
        <TouchableOpacity
          style={styles.alertBanner}
          onPress={() => { setNewOrderBanner(false); setActiveTab("orders"); }}
        >
          <Text style={styles.alertBannerIcon}>🔔</Text>
          <Text style={styles.alertBannerText}>
            {bannerCount}টি নতুন অর্ডার! ট্যাপ করে দেখুন →
          </Text>
          <TouchableOpacity onPress={() => setNewOrderBanner(false)}>
            <Feather name="x" size={14} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Stats Strip */}
      <View style={styles.statsStrip}>
        {[
          { icon: "shopping-bag", num: allOrders.length, label: "মোট অর্ডার" },
          { icon: "package",      num: products.length,  label: "পণ্য" },
          { icon: "users",        num: farmers.length,   label: "কৃষক" },
          { icon: "dollar-sign",  num: `৳${totalRevenue.toLocaleString()}`, label: "মোট আয়" },
        ].map(({ icon, num, label }) => (
          <View key={label} style={styles.statItem}>
            <Feather name={icon as never} size={14} color={colors.light.primary} />
            <Text style={styles.statNum}>{num}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {([
          { key: "orders",   icon: "clipboard",  label: "অর্ডার",  badge: newOrdersCount },
          { key: "farmers",  icon: "users",      label: "কৃষক",    badge: 0 },
          { key: "products", icon: "package",    label: "পণ্য",    badge: 0 },
          { key: "settings", icon: "settings",   label: "সেটিং",   badge: 0 },
        ] as { key: AdminTab; icon: string; label: string; badge: number }[]).map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabItem, activeTab === t.key && styles.tabItemActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <View style={{ position: "relative" }}>
              <Feather name={t.icon as never} size={16} color={activeTab === t.key ? "#fff" : colors.light.mutedForeground} />
              {t.badge > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{t.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── ORDERS ── */}
        {activeTab === "orders" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>লাইভ অর্ডার ({allOrders.length})</Text>
            {allOrders.length === 0 ? (
              <View style={styles.emptyBox}>
                <Feather name="inbox" size={36} color={colors.light.mutedForeground} />
                <Text style={styles.emptyText}>এখনো কোনো অর্ডার নেই</Text>
              </View>
            ) : (
              allOrders.map((o, idx) => {
                const isExpanded = expandedOrderId === o.id;
                return (
                  <View key={o.id} style={[styles.orderCard, idx === 0 && styles.orderCardNew]}>
                    {idx === 0 && <View style={styles.newBadge}><Text style={styles.newBadgeText}>নতুন</Text></View>}

                    {/* Tap header to expand */}
                    <TouchableOpacity
                      style={styles.orderHeaderRow}
                      onPress={() => setExpandedOrderId(isExpanded ? null : o.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.orderId}>#{o.id.slice(-8).toUpperCase()}</Text>
                      <View style={[styles.statusPill, STATUS_COLORS[o.status ?? "confirmed"]]}>
                        <Text style={styles.statusPillText}>{STATUS_BN[o.status ?? "confirmed"]}</Text>
                      </View>
                      <Text style={styles.orderTotal}>৳{o.grandTotal}</Text>
                      <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={14} color={colors.light.mutedForeground} />
                    </TouchableOpacity>

                    <View style={styles.orderMetaRow}>
                      <Feather name="user" size={12} color={colors.light.mutedForeground} />
                      <Text style={styles.orderMeta}>{o.customerName}</Text>
                      <Text style={styles.orderMetaDot}>·</Text>
                      <Feather name="phone" size={12} color={colors.light.mutedForeground} />
                      <Text style={styles.orderMeta}>{o.customerPhone}</Text>
                    </View>
                    <View style={styles.orderMetaRow}>
                      <Feather name="map-pin" size={12} color={colors.light.mutedForeground} />
                      <Text style={styles.orderMeta} numberOfLines={1}>{o.customerAddress}</Text>
                      <Text style={styles.deliveryTag}>{o.deliveryArea === "dhaka" ? "🏙 ঢাকা" : "🗺 বাইরে"}</Text>
                    </View>

                    {isExpanded && (
                      <>
                        <View style={styles.itemsBox}>
                          {o.items.map((item, i) => (
                            <View key={i} style={styles.itemRow}>
                              <Text style={styles.itemName}>{item.title}</Text>
                              <Text style={styles.itemQty}>×{item.qty} {item.unit}</Text>
                              <Text style={styles.itemPrice}>৳{item.price * item.qty}</Text>
                            </View>
                          ))}
                        </View>

                        <View style={styles.orderTotalsRow}>
                          <Text style={styles.orderTotalLabel}>পণ্যমূল্য: ৳{o.subtotal}</Text>
                          <Text style={styles.orderTotalLabel}>ডেলিভারি: ৳{o.deliveryCharge}</Text>
                          <Text style={styles.orderGrand}>মোট: ৳{o.grandTotal}</Text>
                        </View>

                        {/* 7-step status update */}
                        <View style={styles.statusUpdateBox}>
                          <Text style={styles.statusUpdateLabel}>স্ট্যাটাস আপডেট করুন:</Text>
                          <View style={styles.statusBtnRow}>
                            {(Object.entries(STATUS_BN) as [Order["status"], string][]).map(([key, label]) => (
                              <TouchableOpacity
                                key={key}
                                style={[
                                  styles.statusBtn,
                                  o.status === key && styles.statusBtnActive,
                                ]}
                                onPress={() => {
                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                  updateOrderStatus(o.id, key);
                                }}
                              >
                                <Text style={[styles.statusBtnText, o.status === key && styles.statusBtnTextActive]}>
                                  {label}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </>
                    )}

                    <Text style={styles.orderDate}>{new Date(o.date).toLocaleString("bn-BD")}</Text>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* ── FARMERS ── */}
        {activeTab === "farmers" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>নিবন্ধিত কৃষক ({farmers.length})</Text>
            {farmers.map((f) => (
              <View key={f.id} style={styles.farmerCard}>
                <View style={styles.farmerCardHeader}>
                  <Image
                    source={f.gender === "female"
                      ? require("@/assets/images/farmer-female.png")
                      : require("@/assets/images/farmer-male.png")}
                    style={styles.farmerAvatar}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <View style={styles.farmerNameRow}>
                      <Text style={styles.farmerName}>{f.name}</Text>
                      {f.verified && (
                        <View style={styles.verifiedBadge}>
                          <Feather name="check-circle" size={10} color={colors.light.primary} />
                          <Text style={styles.verifiedText}>যাচাইকৃত</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.farmerMeta}>📍 {f.address}</Text>
                    <Text style={styles.farmerMeta}>📦 {f.products}</Text>
                    <Text style={styles.farmerMeta}>📞 {f.phone}</Text>
                  </View>
                </View>
                <View style={styles.farmerStats}>
                  <View style={styles.farmerStat}><Text style={styles.farmerStatNum}>৳{f.sales}</Text><Text style={styles.farmerStatLabel}>বিক্রয়</Text></View>
                  <View style={styles.farmerStat}><Text style={styles.farmerStatNum}>⭐ {f.rating}</Text><Text style={styles.farmerStatLabel}>রেটিং</Text></View>
                  <View style={styles.farmerStat}><Text style={styles.farmerStatNum}>{f.gender === "female" ? "মহিলা" : "পুরুষ"}</Text><Text style={styles.farmerStatLabel}>লিঙ্গ</Text></View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── PRODUCTS ── */}
        {activeTab === "products" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>পণ্য ব্যবস্থাপনা ({products.length})</Text>
              <TouchableOpacity style={styles.addProductBtn} onPress={openAdd}>
                <Feather name="plus" size={14} color="#fff" />
                <Text style={styles.addProductBtnText}>নতুন পণ্য</Text>
              </TouchableOpacity>
            </View>
            {products.map((p) => (
              <View key={p.id} style={styles.productCard}>
                <Image source={{ uri: p.img }} style={styles.productImg} resizeMode="cover" />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={styles.productName}>{p.title}</Text>
                  <Text style={styles.productMeta}>৳{p.price}/{p.unit} · {CATEGORIES.find(c => c.key === p.cat)?.label ?? p.cat}</Text>
                  <Text style={styles.productFarmer} numberOfLines={1}>👨‍🌾 {p.farmer}</Text>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => openEdit(p)}>
                    <Feather name="edit-2" size={14} color={colors.light.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => moveToReady(p)}>
                    <Feather name="tag" size={14} color="#f59e0b" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => confirmDelete(p)}>
                    <Feather name="trash-2" size={14} color={colors.light.destructive} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === "settings" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>সাইট সেটিংস CMS</Text>
              {cmsSaved && (
                <View style={styles.savedBadge}>
                  <Feather name="check-circle" size={12} color="#16a34a" />
                  <Text style={styles.savedBadgeText}>সংরক্ষিত!</Text>
                </View>
              )}
            </View>

            {/* Stats summary */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsLabel}>📊 অ্যাপ পরিসংখ্যান</Text>
              {[
                ["পণ্য সংখ্যা", `${products.length}টি`],
                ["কৃষক সংখ্যা", `${farmers.length}জন`],
                ["মোট অর্ডার", `${orders.length}টি`],
                ["মোট আয়", `৳${totalRevenue.toLocaleString()}`],
                ["অ্যাডমিন", ADMIN_USERNAME],
              ].map(([label, val]) => (
                <View key={label} style={styles.settingsRow}>
                  <Text style={styles.settingsKey}>{label}</Text>
                  <Text style={styles.settingsVal}>{val}</Text>
                </View>
              ))}
            </View>

            {/* Delivery charges - editable */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsLabel}>🚚 ডেলিভারি চার্জ</Text>
              <View style={styles.cmsFieldRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cmsFieldLabel}>ঢাকা সিটি (৳)</Text>
                  <TextInput
                    style={styles.cmsInput}
                    value={dhakaCharge}
                    onChangeText={setDhakaCharge}
                    keyboardType="numeric"
                    placeholderTextColor={colors.light.mutedForeground}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cmsFieldLabel}>ঢাকার বাইরে (৳)</Text>
                  <TextInput
                    style={styles.cmsInput}
                    value={outsideCharge}
                    onChangeText={setOutsideCharge}
                    keyboardType="numeric"
                    placeholderTextColor={colors.light.mutedForeground}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cmsFieldLabel}>৫কেজি+ প্রতি কেজি (৳)</Text>
                  <TextInput
                    style={styles.cmsInput}
                    value={extraPerKg}
                    onChangeText={setExtraPerKg}
                    keyboardType="numeric"
                    placeholderTextColor={colors.light.mutedForeground}
                  />
                </View>
              </View>
            </View>

            {/* Payment numbers - editable */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsLabel}>💳 পেমেন্ট নম্বর</Text>
              <Text style={styles.cmsFieldLabel}>bKash নম্বর</Text>
              <TextInput
                style={styles.cmsInput}
                value={bkashNum}
                onChangeText={setBkashNum}
                keyboardType="phone-pad"
                placeholder="01XXXXXXXXX"
                placeholderTextColor={colors.light.mutedForeground}
              />
              <Text style={styles.cmsFieldLabel}>Nagad নম্বর</Text>
              <TextInput
                style={styles.cmsInput}
                value={nagadNum}
                onChangeText={setNagadNum}
                keyboardType="phone-pad"
                placeholder="01XXXXXXXXX"
                placeholderTextColor={colors.light.mutedForeground}
              />
              <Text style={styles.cmsFieldLabel}>Rocket নম্বর (ঐচ্ছিক)</Text>
              <TextInput
                style={styles.cmsInput}
                value={rocketNum}
                onChangeText={setRocketNum}
                keyboardType="phone-pad"
                placeholder="01XXXXXXXXX"
                placeholderTextColor={colors.light.mutedForeground}
              />
            </View>

            {/* Contact info - editable */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsLabel}>📞 যোগাযোগ তথ্য</Text>
              <Text style={styles.cmsFieldLabel}>ফোন নম্বর</Text>
              <TextInput
                style={styles.cmsInput}
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
                placeholderTextColor={colors.light.mutedForeground}
              />
              <Text style={styles.cmsFieldLabel}>ইমেইল</Text>
              <TextInput
                style={styles.cmsInput}
                value={contactEmail}
                onChangeText={setContactEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.light.mutedForeground}
              />
              <Text style={styles.cmsFieldLabel}>ঠিকানা</Text>
              <TextInput
                style={styles.cmsInput}
                value={contactAddress}
                onChangeText={setContactAddress}
                placeholderTextColor={colors.light.mutedForeground}
              />
            </View>

            {/* Site note */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsLabel}>📝 সাইট নোট / ট্যাগলাইন</Text>
              <TextInput
                style={[styles.cmsInput, { height: 72, textAlignVertical: "top" }]}
                value={siteNote}
                onChangeText={setSiteNote}
                multiline
                placeholderTextColor={colors.light.mutedForeground}
              />
            </View>

            {/* Save button */}
            <TouchableOpacity
              style={[styles.saveBtn, cmsSaving && { opacity: 0.7 }]}
              onPress={saveCmsSettings}
              disabled={cmsSaving}
            >
              <Feather name={cmsSaved ? "check-circle" : "save"} size={16} color="#fff" />
              <Text style={styles.saveBtnText}>
                {cmsSaving ? "সংরক্ষণ হচ্ছে..." : cmsSaved ? "সংরক্ষিত হয়েছে!" : "সেটিংস সংরক্ষণ করুন"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerBtn} onPress={handleLogout}>
              <Feather name="log-out" size={15} color="#fff" />
              <Text style={styles.dangerBtnText}>অ্যাডমিন লগআউট</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Product Edit Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>পণ্য সম্পাদনা</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Feather name="x" size={20} color={colors.light.mutedForeground} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ProductForm
                title={epTitle} setTitle={setEpTitle}
                price={epPrice} setPrice={setEpPrice}
                unit={epUnit} setUnit={setEpUnit}
                cat={epCat} setCat={setEpCat}
                desc={epDesc} setDesc={setEpDesc}
                img={epImg} setImg={setEpImg}
                badge={epBadge} setBadge={setEpBadge}
              />
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Feather name="save" size={16} color="#fff" />
                <Text style={styles.saveBtnText}>পরিবর্তন সংরক্ষণ করুন</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Product Add Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>নতুন পণ্য যোগ করুন</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Feather name="x" size={20} color={colors.light.mutedForeground} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ProductForm
                title={epTitle} setTitle={setEpTitle}
                price={epPrice} setPrice={setEpPrice}
                unit={epUnit} setUnit={setEpUnit}
                cat={epCat} setCat={setEpCat}
                desc={epDesc} setDesc={setEpDesc}
                img={epImg} setImg={setEpImg}
                badge={epBadge} setBadge={setEpBadge}
              />
              <TouchableOpacity style={styles.saveBtn} onPress={saveAdd}>
                <Feather name="plus-circle" size={16} color="#fff" />
                <Text style={styles.saveBtnText}>পণ্য যোগ করুন</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const UNITS = ["কেজি", "পিস", "ডজন", "আঁটি", "প্যাক", "লিটার", "১০০ পিস", "৫০০ গ্রাম"];
const PROD_CATS: { key: Product["cat"]; label: string }[] = [
  { key: "vege",    label: "সবজি" },
  { key: "leafy",   label: "শাক" },
  { key: "fish",    label: "মাছ" },
  { key: "fruit",   label: "ফল" },
  { key: "meat",    label: "মাংস" },
  { key: "dairy",   label: "ডিম/দুগ্ধ" },
  { key: "spice",   label: "মশলা" },
  { key: "rice",    label: "চাল" },
  { key: "honey",   label: "মধু" },
  { key: "ready",   label: "রেডি টু কুক" },
  { key: "organic", label: "অর্গানিক" },
];

function ProductForm({
  title, setTitle, price, setPrice, unit, setUnit,
  cat, setCat, desc, setDesc, img, setImg, badge, setBadge,
}: {
  title: string; setTitle: (v: string) => void;
  price: string; setPrice: (v: string) => void;
  unit: string; setUnit: (v: string) => void;
  cat: Product["cat"]; setCat: (v: Product["cat"]) => void;
  desc: string; setDesc: (v: string) => void;
  img: string; setImg: (v: string) => void;
  badge: string; setBadge: (v: string) => void;
}) {
  return (
    <View style={styles.formGap}>
      <Text style={styles.formLabel}>পণ্যের নাম *</Text>
      <TextInput style={styles.formInput} value={title} onChangeText={setTitle} placeholder="যেমন: টাটকা আলু" placeholderTextColor={colors.light.mutedForeground} />

      <View style={styles.formRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.formLabel}>মূল্য (৳) *</Text>
          <TextInput style={styles.formInput} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="০" placeholderTextColor={colors.light.mutedForeground} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.formLabel}>ব্যাজ</Text>
          <TextInput style={styles.formInput} value={badge} onChangeText={setBadge} placeholder="টাটকা" placeholderTextColor={colors.light.mutedForeground} />
        </View>
      </View>

      <Text style={styles.formLabel}>ইউনিট</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          {UNITS.map((u) => (
            <TouchableOpacity key={u} style={[styles.chip, unit === u && styles.chipActive]} onPress={() => setUnit(u)}>
              <Text style={[styles.chipText, unit === u && styles.chipTextActive]}>{u}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text style={styles.formLabel}>ক্যাটাগরি</Text>
      <View style={styles.chipRow}>
        {PROD_CATS.map((c) => (
          <TouchableOpacity key={c.key} style={[styles.chip, cat === c.key && styles.chipActive]} onPress={() => setCat(c.key)}>
            <Text style={[styles.chipText, cat === c.key && styles.chipTextActive]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.formLabel}>Shopify ইমেজ লিঙ্ক</Text>
      <TextInput
        style={[styles.formInput, { height: 72 }]}
        value={img}
        onChangeText={setImg}
        placeholder="https://cdn.shopify.com/..."
        placeholderTextColor={colors.light.mutedForeground}
        multiline
        autoCapitalize="none"
        textAlignVertical="top"
      />
      {img ? (
        <Image source={{ uri: img }} style={styles.imgPreview} resizeMode="cover" />
      ) : null}

      <Text style={styles.formLabel}>বিবরণ</Text>
      <TextInput
        style={[styles.formInput, { height: 80 }]}
        value={desc}
        onChangeText={setDesc}
        placeholder="পণ্যের বিস্তারিত বিবরণ..."
        placeholderTextColor={colors.light.mutedForeground}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f1f5f9" },
  loginBg: {
    flex: 1, backgroundColor: colors.light.primarySoft,
    alignItems: "center", justifyContent: "center",
  },
  backBtn: {
    position: "absolute", top: 56, left: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  loginCard: {
    backgroundColor: "#fff", borderRadius: 28, padding: 28,
    width: "88%", maxWidth: 400, alignItems: "center", gap: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24,
  },
  loginLogo: { width: 70, height: 70, borderRadius: 35 },
  loginTitle: { fontSize: 26, fontWeight: "800" as const, color: colors.light.primary },
  loginSub: { fontSize: 12, color: colors.light.mutedForeground, textAlign: "center" as const },
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#fef2f2", borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: "#fca5a5", width: "100%",
  },
  errorText: { color: "#ef4444", fontSize: 13, fontWeight: "600" as const },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.light.muted, borderRadius: 14,
    borderWidth: 1, borderColor: colors.light.border,
    paddingHorizontal: 14, width: "100%",
  },
  inputIcon: { marginRight: 8 },
  loginInput: { flex: 1, height: 50, fontSize: 14, color: colors.light.text },
  eyeBtn: { padding: 4 },
  loginBtn: {
    backgroundColor: colors.light.primary, borderRadius: 14,
    paddingVertical: 15, paddingHorizontal: 32,
    flexDirection: "row", alignItems: "center", gap: 8, width: "100%",
    justifyContent: "center",
  },
  loginBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 16 },
  secureNote: { fontSize: 11, color: colors.light.mutedForeground, textAlign: "center" as const },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#fff", paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.light.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerLogo: { width: 38, height: 38, borderRadius: 19 },
  headerTitle: { fontSize: 18, fontWeight: "800" as const, color: colors.light.text },
  headerSub: { fontSize: 10, color: colors.light.mutedForeground },
  logoutBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#fef2f2", alignItems: "center", justifyContent: "center",
  },

  alertBanner: {
    backgroundColor: "#ef4444", flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12, gap: 8,
  },
  alertBannerIcon: { fontSize: 18 },
  alertBannerText: { flex: 1, color: "#fff", fontWeight: "700" as const, fontSize: 13 },

  statsStrip: {
    flexDirection: "row", backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: colors.light.border,
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 10, gap: 2, borderRightWidth: 1, borderRightColor: colors.light.border },
  statNum: { fontSize: 13, fontWeight: "800" as const, color: colors.light.text },
  statLabel: { fontSize: 9, color: colors.light.mutedForeground },

  tabBar: {
    flexDirection: "row", backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: colors.light.border,
    paddingHorizontal: 8, paddingVertical: 8, gap: 6,
  },
  tabItem: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 5, paddingVertical: 9, borderRadius: 12,
    backgroundColor: colors.light.muted,
  },
  tabItemActive: { backgroundColor: colors.light.primary },
  tabLabel: { fontSize: 11, color: colors.light.mutedForeground, fontWeight: "600" as const },
  tabLabelActive: { color: "#fff", fontWeight: "700" as const },
  tabBadge: {
    position: "absolute", top: -6, right: -8,
    backgroundColor: "#ef4444", minWidth: 14, height: 14,
    borderRadius: 7, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 2,
  },
  tabBadgeText: { fontSize: 8, color: "#fff", fontWeight: "800" as const },

  content: { padding: 14, gap: 12, paddingBottom: 40 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800" as const, color: colors.light.text },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  orderCard: {
    backgroundColor: "#fff", borderRadius: 18, padding: 16, gap: 8,
    borderWidth: 1, borderColor: colors.light.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6,
  },
  orderCardNew: { borderColor: colors.light.primary, borderWidth: 2 },
  newBadge: {
    alignSelf: "flex-start" as const,
    backgroundColor: "#ef4444", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
  },
  newBadgeText: { fontSize: 10, color: "#fff", fontWeight: "800" as const },
  orderHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  orderId: { fontSize: 13, fontWeight: "700" as const, color: colors.light.text, flex: 1 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  pillConfirm: { backgroundColor: "#dcfce7" },
  pillDelivered: { backgroundColor: colors.light.primarySoft },
  statusPillText: { fontSize: 10, fontWeight: "700" as const, color: colors.light.primary },
  orderTotal: { fontSize: 16, fontWeight: "800" as const, color: colors.light.primary },
  orderMetaRow: { flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap" as const },
  orderMeta: { fontSize: 12, color: colors.light.mutedForeground },
  orderMetaDot: { color: colors.light.mutedForeground },
  deliveryTag: { fontSize: 10, color: colors.light.mutedForeground, marginLeft: "auto" as const },
  itemsBox: {
    backgroundColor: colors.light.muted, borderRadius: 12, padding: 10, gap: 5,
    borderWidth: 1, borderColor: colors.light.border,
  },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  itemName: { flex: 1, fontSize: 12, color: colors.light.text, fontWeight: "600" as const },
  itemQty: { fontSize: 11, color: colors.light.mutedForeground },
  itemPrice: { fontSize: 13, fontWeight: "700" as const, color: colors.light.primary },
  orderTotalsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" as const },
  orderTotalLabel: { fontSize: 11, color: colors.light.mutedForeground },
  orderGrand: { fontSize: 13, fontWeight: "800" as const, color: colors.light.primary, marginLeft: "auto" as const },
  orderDate: { fontSize: 10, color: colors.light.mutedForeground },
  statusUpdateBox: {
    backgroundColor: colors.light.muted, borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: colors.light.border, gap: 8,
  },
  statusUpdateLabel: { fontSize: 12, fontWeight: "700" as const, color: colors.light.text },
  statusBtnRow: { flexDirection: "row", flexWrap: "wrap" as const, gap: 6 },
  statusBtn: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16,
    borderWidth: 1, borderColor: colors.light.border, backgroundColor: "#fff",
  },
  statusBtnActive: { backgroundColor: colors.light.primary, borderColor: colors.light.primary },
  statusBtnText: { fontSize: 11, color: colors.light.mutedForeground, fontWeight: "600" as const },
  statusBtnTextActive: { color: "#fff", fontWeight: "700" as const },

  farmerCard: {
    backgroundColor: "#fff", borderRadius: 18, padding: 16, gap: 12,
    borderWidth: 1, borderColor: colors.light.border,
  },
  farmerCardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  farmerAvatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: colors.light.primary },
  farmerNameRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" as const },
  farmerName: { fontSize: 15, fontWeight: "700" as const, color: colors.light.text },
  verifiedBadge: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: colors.light.primarySoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20,
  },
  verifiedText: { fontSize: 9, color: colors.light.primary, fontWeight: "600" as const },
  farmerMeta: { fontSize: 11, color: colors.light.mutedForeground, marginTop: 1 },
  farmerStats: { flexDirection: "row", gap: 8 },
  farmerStat: {
    flex: 1, backgroundColor: colors.light.muted, borderRadius: 12, padding: 10, alignItems: "center", gap: 2,
  },
  farmerStatNum: { fontSize: 13, fontWeight: "700" as const, color: colors.light.text },
  farmerStatLabel: { fontSize: 9, color: colors.light.mutedForeground },

  addProductBtn: {
    backgroundColor: colors.light.primary, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 7,
    flexDirection: "row", alignItems: "center", gap: 5,
  },
  addProductBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 12 },
  productCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#fff", borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: colors.light.border,
  },
  productImg: { width: 60, height: 60, borderRadius: 12 },
  productName: { fontSize: 14, fontWeight: "700" as const, color: colors.light.text },
  productMeta: { fontSize: 11, color: colors.light.mutedForeground },
  productFarmer: { fontSize: 10, color: colors.light.mutedForeground },
  productActions: { flexDirection: "column", gap: 6 },
  actionBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: colors.light.primarySoft, alignItems: "center", justifyContent: "center",
  },
  deleteBtn: { backgroundColor: "#fef2f2" },

  emptyBox: { alignItems: "center", paddingVertical: 48, gap: 10 },
  emptyText: { fontSize: 14, color: colors.light.mutedForeground },

  settingsCard: {
    backgroundColor: "#fff", borderRadius: 18, padding: 18, gap: 12,
    borderWidth: 1, borderColor: colors.light.border,
  },
  settingsLabel: { fontSize: 14, fontWeight: "700" as const, color: colors.light.text, paddingBottom: 4,
    borderBottomWidth: 1, borderBottomColor: colors.light.border },
  settingsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  settingsKey: { fontSize: 13, color: colors.light.mutedForeground },
  settingsVal: { fontSize: 13, fontWeight: "700" as const, color: colors.light.text },
  footerLogoPreview: { flexDirection: "row", alignItems: "center", gap: 12 },
  footerLogoImg: { width: 48, height: 48, borderRadius: 24 },
  footerLogoName: { fontSize: 15, fontWeight: "700" as const, color: colors.light.primary },
  footerLogoStatus: { fontSize: 11, color: "#22c55e", fontWeight: "600" as const },
  dangerBtn: {
    backgroundColor: colors.light.destructive, borderRadius: 14, paddingVertical: 14,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8,
  },
  dangerBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 15 },

  savedBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#f0fdf4", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: "#bbf7d0",
  },
  savedBadgeText: { fontSize: 12, color: "#16a34a", fontWeight: "700" as const },
  cmsFieldRow: { flexDirection: "row", gap: 8 },
  cmsFieldLabel: { fontSize: 12, fontWeight: "600" as const, color: colors.light.mutedForeground, marginBottom: 5, marginTop: 8 },
  cmsInput: {
    backgroundColor: colors.light.muted, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 13, color: colors.light.text,
    borderWidth: 1, borderColor: colors.light.border,
  },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: "93%", padding: 22, gap: 16,
  },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 19, fontWeight: "800" as const, color: colors.light.text },
  saveBtn: {
    backgroundColor: colors.light.primary, borderRadius: 14, paddingVertical: 15,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginVertical: 12,
  },
  saveBtnText: { color: "#fff", fontWeight: "700" as const, fontSize: 16 },
  formGap: { gap: 10 },
  formLabel: { fontSize: 13, fontWeight: "600" as const, color: colors.light.text },
  formRow: { flexDirection: "row", gap: 10 },
  formInput: {
    backgroundColor: colors.light.muted, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: colors.light.text,
    borderWidth: 1, borderColor: colors.light.border,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap" as const, gap: 7 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: colors.light.border, backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: colors.light.primary, borderColor: colors.light.primary },
  chipText: { fontSize: 12, color: colors.light.mutedForeground },
  chipTextActive: { color: "#fff", fontWeight: "700" as const },
  imgPreview: { width: "100%", height: 140, borderRadius: 12 },
});
