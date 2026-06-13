import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import colors from "@/constants/colors";

interface Props {
  onDone: () => void;
}

export default function SplashOverlay({ onDone }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => onDone());
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDone, opacity, scale]);

  if (Platform.OS !== "web") return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>কৃষক বাজার</Text>
        <Text style={styles.tagline}>দালাল মুক্ত কৃষি বাজার</Text>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <PulseDot key={i} delay={i * 200} />
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

function PulseDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.4, duration: 400, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);

  return (
    <Animated.View style={[styles.dot, { opacity: anim }]} />
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  content: {
    alignItems: "center",
    gap: 14,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 28,
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "800" as const,
    color: colors.light.primary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 15,
    color: colors.light.mutedForeground,
    fontWeight: "500" as const,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.light.primary,
  },
});
