import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "@/constants/colors";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallBanner() {
  const [show, setShow] = useState(false);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
  const slideY = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const handler = (e: Event) => {
      e.preventDefault();
      deferredRef.current = e as BeforeInstallPromptEvent;
      setShow(true);
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }).start();
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [slideY]);

  const handleInstall = async () => {
    if (!deferredRef.current) return;
    await deferredRef.current.prompt();
    const { outcome } = await deferredRef.current.userChoice;
    if (outcome === "accepted") setShow(false);
    deferredRef.current = null;
  };

  const handleDismiss = () => {
    Animated.timing(slideY, { toValue: 80, duration: 250, useNativeDriver: true }).start(() => setShow(false));
  };

  if (!show) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: slideY }] }]}>
      <View style={styles.left}>
        <Text style={styles.icon}>📲</Text>
        <View>
          <Text style={styles.title}>হোমস্ক্রিনে ইনস্টল করুন</Text>
          <Text style={styles.sub}>অ্যাপের মতো ব্যবহার করুন · অফলাইনেও চলে</Text>
        </View>
      </View>
      <View style={styles.right}>
        <TouchableOpacity style={styles.installBtn} onPress={handleInstall}>
          <Text style={styles.installText}>ইনস্টল</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss}>
          <Feather name="x" size={16} color={colors.light.mutedForeground} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    bottom: 72,
    left: 12,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    borderWidth: 1,
    borderColor: colors.light.border,
    zIndex: 1000,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  icon: { fontSize: 26 },
  title: { fontSize: 13, fontWeight: "700" as const, color: colors.light.text },
  sub: { fontSize: 11, color: colors.light.mutedForeground, marginTop: 1 },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  installBtn: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  installText: { color: "#fff", fontWeight: "700" as const, fontSize: 13 },
  closeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.light.muted,
    alignItems: "center", justifyContent: "center",
  },
});
