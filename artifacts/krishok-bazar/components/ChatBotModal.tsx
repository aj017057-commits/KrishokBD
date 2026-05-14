import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

const INITIAL_MSG: Message = {
  id: "0",
  role: "bot",
  text: "আসসালামু আলাইকুম! আমি রিক্তাজ, আপনার কৃষি সহায়ক। ফসলের রোগ, সার, বাজার মূল্য, রেসিপি ও ফ্যামিলি প্ল্যানিং নিয়ে প্রশ্ন করতে পারেন।",
};

export default function ChatBotModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
    };
    setMessages((prev) => [userMsg, ...prev]);
    setInput("");
    setLoading(true);

    try {
      const historyForGemini = messages.slice(0, 8).reverse().map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));
      const payload = {
        contents: [
          ...historyForGemini,
          {
            role: "user",
            parts: [{ text: `তুমি একজন বাংলাদেশী কৃষি বিশেষজ্ঞ চ্যাটবট। তোমার নাম রিক্তাজ। সব উত্তর বাংলায় দাও। ফসল, সার, কীটনাশক, রেসিপি, পরিবারের জন্য সবজির পরিমাণ ইত্যাদি বিষয়ে সাহায্য করো। প্রশ্ন: ${text}` }],
          },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      };
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await resp.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "দুঃখিত, উত্তর দিতে পারছি না।";
      setMessages((prev) => [{ id: Date.now().toString() + "b", role: "bot", text: botText }, ...prev]);
    } catch {
      setMessages((prev) => [{ id: Date.now().toString() + "e", role: "bot", text: "ইন্টারনেট সংযোগ সমস্যা। আবার চেষ্টা করুন।" }, ...prev]);
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
          keyboardVerticalOffset={0}
        >
          <View style={[styles.header, { paddingTop: 12 }]}>
            <View style={styles.headerLeft}>
              <View style={styles.botIcon}>
                <Feather name="cpu" size={16} color="#fff" />
              </View>
              <View>
                <Text style={styles.headerTitle}>রিক্তাজ</Text>
                <Text style={styles.headerSub}>কৃষি সহায়ক AI</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={listRef}
            data={messages}
            inverted
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={colors.light.primary} />
                <Text style={styles.loadingText}>রিক্তাজ লিখছে...</Text>
              </View>
            ) : null}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.role === "user" ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.bubbleText, item.role === "user" && styles.userText]}>
                  {item.text}
                </Text>
              </View>
            )}
          />

          <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="আপনার প্রশ্ন লিখুন..."
              placeholderTextColor={colors.light.mutedForeground}
              multiline
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
              onPress={sendMessage}
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
  container: { height: "85%", backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" },
  header: {
    backgroundColor: colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  botIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700" as const, color: "#fff" },
  headerSub: { fontSize: 10, color: "rgba(255,255,255,0.7)" },
  messageList: { padding: 16, gap: 8 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  loadingText: { fontSize: 12, color: colors.light.mutedForeground },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 4,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.light.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.light.muted,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, color: colors.light.text, lineHeight: 20 },
  userText: { color: "#fff" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    gap: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: colors.light.muted,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.light.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: colors.light.mutedForeground },
});
