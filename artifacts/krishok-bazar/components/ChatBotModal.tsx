import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { GEMINI_API_KEY } from "@/constants/data";
import { useApp } from "@/context/AppContext";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

const SYSTEM_PROMPT = `তুমি একজন বাংলাদেশী কৃষি বিশেষজ্ঞ এবং পুষ্টি পরামর্শদাতা AI সহায়ক। তোমার নাম রিক্তাজ। কৃষক বাজারের অফিশিয়াল AI সহায়ক হিসেবে তুমি কাজ করো।

তুমি যেসব বিষয়ে সাহায্য করো:
1. পরিবারের সদস্য সংখ্যা অনুযায়ী সাপ্তাহিক/মাসিক সবজি-ফলের তালিকা তৈরি
2. শাকসবজির পুষ্টিগুণ ও স্বাস্থ্য উপকারিতা
3. রান্নার রেসিপি ও টিপস
4. শাকসবজি সংরক্ষণের পদ্ধতি ও শেলফ লাইফ
5. ফসলের রোগ, সার ও কীটনাশক পরামর্শ
6. বাজার মূল্য ও কৃষি তথ্য

গুরুত্বপূর্ণ নিয়ম:
- সব উত্তর বাংলায় দাও
- পেশাদার কিন্তু বন্ধুত্বপূর্ণ ভাষায় উত্তর দাও
- পরিবারের সাইজ জিজ্ঞেস করলে নির্দিষ্ট সবজির নাম ও পরিমাণ উল্লেখ করো
- সংক্ষিপ্ত কিন্তু কার্যকর উত্তর দাও (৩-৫ লাইন)
- প্রয়োজনে বুলেট পয়েন্ট ব্যবহার করো`;

const INITIAL_MSG: Message = {
  id: "0",
  role: "bot",
  text: "আসসালামু আলাইকুম, আমি রিক্তাজ। আপনাকে কীভাবে সাহায্য করতে পারি?\n\nআপনি জিজ্ঞেস করতে পারেন:\n• ৪ জনের পরিবারে সাপ্তাহিক সবজির তালিকা\n• রেসিপি আইডিয়া\n• পুষ্টিগুণ সম্পর্কে তথ্য\n• ফসলের পরামর্শ",
};

const QUICK_QUESTIONS = [
  "৪ জনের পরিবারের সাপ্তাহিক সবজির তালিকা দাও",
  "আলুর সেরা রেসিপি কী?",
  "পালং শাকের পুষ্টিগুণ বলো",
  "সবজি কতদিন ভালো থাকে?",
];

export default function ChatBotModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { currentCustomer } = useApp();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const sendMessage = async (text?: string) => {
    const msgText = (text ?? input).trim();
    if (!msgText || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: msgText };
    setMessages((prev) => [userMsg, ...prev]);
    setInput("");
    setLoading(true);

    try {
      const historyForGemini = messages
        .slice(0, 10)
        .reverse()
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.text }],
        }));

      const payload = {
        contents: [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }],
          },
          {
            role: "model",
            parts: [{ text: "বুঝেছি। আমি রিক্তাজ — কৃষক বাজারের AI সহায়ক। বাংলায় সাহায্য করতে প্রস্তুত।" }],
          },
          ...historyForGemini,
          {
            role: "user",
            parts: [{ text: msgText }],
          },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
      };

      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );
      const data = await resp.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "দুঃখিত, উত্তর দিতে পারছি না।";
      setMessages((prev) => [{ id: Date.now().toString() + "b", role: "bot", text: botText }, ...prev]);
    } catch {
      setMessages((prev) => [{ id: Date.now().toString() + "e", role: "bot", text: "ইন্টারনেট সংযোগ সমস্যা। একটু পরে আবার চেষ্টা করুন।" }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: 14 }]}>
            <View style={styles.headerLeft}>
              <Image
                source={require("@/assets/images/icon.png")}
                style={styles.botAvatar}
              />
              <View>
                <Text style={styles.headerTitle}>রিক্তাজ</Text>
                <View style={styles.onlineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.headerSub}>কৃষক বাজার AI সহায়ক</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.closeBtn}>
              <Feather name="x" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            ref={listRef}
            data={messages}
            inverted
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={loading ? (
              <View style={styles.typingRow}>
                <Image source={require("@/assets/images/icon.png")} style={styles.typingAvatar} />
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color={colors.light.primary} />
                  <Text style={styles.typingText}>রিক্তাজ লিখছে...</Text>
                </View>
              </View>
            ) : null}
            ListFooterComponent={
              messages.length <= 1 ? (
                <View style={styles.quickQContainer}>
                  <Text style={styles.quickQLabel}>দ্রুত প্রশ্ন করুন</Text>
                  {QUICK_QUESTIONS.map((q, i) => (
                    <TouchableOpacity key={i} style={styles.quickQ} onPress={() => sendMessage(q)}>
                      <Text style={styles.quickQText}>{q}</Text>
                      <Feather name="arrow-right" size={12} color={colors.light.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <View style={[styles.bubbleRow, item.role === "user" && styles.bubbleRowUser]}>
                {item.role === "bot" && (
                  <Image source={require("@/assets/images/icon.png")} style={styles.bubbleAvatar} />
                )}
                <View style={[styles.bubble, item.role === "user" ? styles.userBubble : styles.botBubble]}>
                  <Text style={[styles.bubbleText, item.role === "user" && styles.userText]}>
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* Input */}
          <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="প্রশ্ন করুন..."
              placeholderTextColor={colors.light.mutedForeground}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
              onPress={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <Feather name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  container: { height: "88%", backgroundColor: "#fff", borderTopLeftRadius: 26, borderTopRightRadius: 26, overflow: "hidden" },
  header: {
    backgroundColor: colors.light.primary,
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18, paddingBottom: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  botAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: "rgba(255,255,255,0.4)" },
  headerTitle: { fontSize: 17, fontWeight: "700" as const, color: "#fff" },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#4ade80" },
  headerSub: { fontSize: 11, color: "rgba(255,255,255,0.75)" },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  messageList: { paddingHorizontal: 14, paddingVertical: 16, gap: 10 },
  typingRow: { flexDirection: "row", alignItems: "flex-end", gap: 8, marginBottom: 8 },
  typingAvatar: { width: 28, height: 28, borderRadius: 14 },
  typingBubble: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.light.muted,
    borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10,
  },
  typingText: { fontSize: 12, color: colors.light.mutedForeground },
  quickQContainer: { gap: 8, marginTop: 8 },
  quickQLabel: { fontSize: 12, fontWeight: "600" as const, color: colors.light.mutedForeground, marginBottom: 2 },
  quickQ: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: colors.light.primarySoft,
    borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: colors.light.border,
  },
  quickQText: { fontSize: 13, color: colors.light.text, flex: 1 },
  bubbleRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  bubbleRowUser: { flexDirection: "row-reverse" as const },
  bubbleAvatar: { width: 28, height: 28, borderRadius: 14, flexShrink: 0 },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: { backgroundColor: colors.light.primary, borderBottomRightRadius: 4 },
  botBubble: { backgroundColor: colors.light.muted, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, color: colors.light.text, lineHeight: 21 },
  userText: { color: "#fff" },
  inputRow: {
    flexDirection: "row", alignItems: "flex-end", gap: 10,
    paddingHorizontal: 14, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: colors.light.border,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1, backgroundColor: colors.light.muted,
    borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: colors.light.text, maxHeight: 100,
    borderWidth: 1, borderColor: colors.light.border,
  },
  sendBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.light.primary,
    alignItems: "center", justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: colors.light.mutedForeground },
});
