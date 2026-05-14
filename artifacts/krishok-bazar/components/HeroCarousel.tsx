import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "@/constants/colors";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "সরাসরি কৃষকের কাছ থেকে",
    subtitle: "টাটকা সবজি, ফল, শাক",
    image: require("@/assets/images/hero1.png"),
    cta: "অর্ডার করুন",
  },
  {
    id: "2",
    title: "দালাল ছাড়া বাজার",
    subtitle: "ন্যায্য দাম, নিশ্চিত মান",
    image: require("@/assets/images/hero2.png"),
    cta: "পণ্য দেখুন",
  },
  {
    id: "3",
    title: "রেডি-টু-কুক আইটেম",
    subtitle: "কাটা, ধোয়া, মিক্সড",
    image: { uri: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=800" },
    cta: "শপিং করুন",
  },
];

interface Props {
  onOrderPress?: () => void;
}

export default function HeroCarousel({ onOrderPress }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % SLIDES.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <ImageBackground source={item.image} style={styles.slide} imageStyle={styles.slideImage}>
            <View style={styles.overlay} />
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <TouchableOpacity style={styles.cta} onPress={onOrderPress}>
                <Text style={styles.ctaText}>{item.cta}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}
      />
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width, height: 220, position: "relative" },
  slide: { width, height: 220, justifyContent: "flex-end" },
  slideImage: { resizeMode: "cover" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.42)" },
  content: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: "800" as const, color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 12 },
  cta: {
    alignSelf: "flex-start",
    backgroundColor: colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  ctaText: { color: "#fff", fontWeight: "700" as const, fontSize: 13 },
  dots: { position: "absolute", bottom: 12, alignSelf: "center", flexDirection: "row", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.4)" },
  dotActive: { backgroundColor: "#fff", width: 18 },
});
