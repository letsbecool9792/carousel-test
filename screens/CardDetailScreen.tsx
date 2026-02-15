import { useCardExpandAnimation } from "@/animations/cardTransition";
import type { RootStackParamList } from "@/navigation/AppNavigator";
import { scrollToHome } from "@/utils/scrollSync";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
    BackHandler,
    Dimensions,
    FlatList,
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

// Ordered list of all images
const ALL_IMAGES = [
  { id: "1", source: require("@/assets/cats/1.jpg") },
  { id: "2", source: require("@/assets/cats/2.jpg") },
  { id: "3", source: require("@/assets/cats/3.jpg") },
  { id: "4", source: require("@/assets/cats/4.jpg") },
  { id: "5", source: require("@/assets/cats/5.jpg") },
  { id: "6", source: require("@/assets/cats/6.jpg") },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "CardDetail">;
  route: RouteProp<RootStackParamList, "CardDetail">;
};

export default function CardDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;
  const isAnimatingOut = useRef(false);
  const initialIndex = ALL_IMAGES.findIndex((img) => img.id === id) ?? 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const [isExpanded, setIsExpanded] = useState(false);

  const { cardStyle, contentStyle, animateOut } = useCardExpandAnimation({
    startSize: START_SIZE,
    endWidth: CARD_WIDTH,
    endHeight: CARD_HEIGHT,
    topBarHeight: TOP_BAR_HEIGHT,
    onExpandComplete: () => setIsExpanded(true),
  });

  const handleBack = () => {
    if (isAnimatingOut.current) return;
    isAnimatingOut.current = true;
    setIsExpanded(false); // switch back to single image before animating
    // Small delay to let React re-render before animation starts
    requestAnimationFrame(() => {
      animateOut(() => {
        scrollToHome(activeIndex);
        navigation.goBack();
      });
    });
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleBack();
      return true;
    });
    return () => sub.remove();
  }, []);

  const activeSource = ALL_IMAGES[activeIndex]?.source ?? ALL_IMAGES[0].source;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

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

      {/* Card — horizontal image carousel */}
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Base image — always mounted, fills container at any size */}
        <Image
          source={activeSource}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />

        {/* FlatList carousel — layered on top, only visible when expanded */}
        {isExpanded && (
          <View style={StyleSheet.absoluteFill}>
            <FlatList
              data={ALL_IMAGES}
              renderItem={({ item }) => (
                <Image
                  source={item.source}
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    resizeMode: "cover",
                  }}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              initialScrollIndex={initialIndex}
              getItemLayout={(_, index) => ({
                length: CARD_WIDTH,
                offset: CARD_WIDTH * index,
                index,
              })}
              bounces={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
            />
          </View>
        )}
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
