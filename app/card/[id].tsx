import { useCardExpandAnimation } from "@/animations/cardTransition";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    BackHandler,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.55;
const TOP_BAR_HEIGHT = 90;
const START_SIZE = SCREEN_WIDTH * 0.85;

// Same order as index.tsx — keyed by id
const CAT_IMAGES: Record<string, any> = {
  "1": require("@/assets/cats/1.jpg"),
  "2": require("@/assets/cats/2.jpg"),
  "3": require("@/assets/cats/3.jpg"),
  "4": require("@/assets/cats/4.jpg"),
  "5": require("@/assets/cats/5.jpg"),
  "6": require("@/assets/cats/6.jpg"),
};

export default function CardDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isAnimatingOut = useRef(false);

  const { cardStyle, contentStyle, animateOut } = useCardExpandAnimation({
    startSize: START_SIZE,
    endWidth: CARD_WIDTH,
    endHeight: CARD_HEIGHT,
    topBarHeight: TOP_BAR_HEIGHT,
  });

  const handleBack = () => {
    if (isAnimatingOut.current) return;
    isAnimatingOut.current = true;
    animateOut(() => router.back());
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleBack();
      return true;
    });
    return () => sub.remove();
  }, []);

  const imageSource = CAT_IMAGES[id ?? "1"];

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons
            name="chevron-down"
            size={28}
            color="rgba(255,255,255,0.7)"
          />
        </Pressable>
      </View>

      {/* Card — animated image */}
      <Animated.View style={[styles.card, cardStyle]}>
        <Image source={imageSource} style={styles.cardImage} />
      </Animated.View>

      {/* Bottom content */}
      <Animated.View style={[styles.bottomContent, contentStyle]}>
        <Text style={styles.title}>Big text</Text>
        <Text style={styles.body}>Small text</Text>

        <Pressable style={styles.cameraButton} onPress={() => {}}>
          <Ionicons name="camera-outline" size={28} color="#fff" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  topBar: {
    height: TOP_BAR_HEIGHT,
    justifyContent: "flex-end",
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    alignSelf: "center",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bottomContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 22,
    marginBottom: 28,
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
});
