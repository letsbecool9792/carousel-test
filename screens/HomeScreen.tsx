import { Card, CardData } from "@/components/Card";
import { StackCarousel, StackCarouselRef } from "@/components/StackCarousel";
import {
    registerScrollCallback,
    unregisterScrollCallback,
} from "@/utils/scrollSync";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useRef } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

import type { RootStackParamList } from "@/navigation/AppNavigator";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_SIZE = SCREEN_WIDTH * 0.85;

// Map images from assets/cats
const CAT_IMAGES = [
  require("@/assets/cats/1.jpg"),
  require("@/assets/cats/2.jpg"),
  require("@/assets/cats/3.jpg"),
  require("@/assets/cats/4.jpg"),
  require("@/assets/cats/5.jpg"),
  require("@/assets/cats/6.jpg"),
];

const CARDS: CardData[] = CAT_IMAGES.map((image, i) => ({
  id: String(i + 1),
  image,
}));

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export default function HomeScreen({ navigation }: Props) {
  const carouselRef = useRef<StackCarouselRef>(null);

  useEffect(() => {
    registerScrollCallback((index: number) => {
      carouselRef.current?.scrollTo(index);
    });
    return () => unregisterScrollCallback();
  }, []);
  const renderItem = useCallback(
    ({ item, index }: { item: CardData; index: number }) => (
      <Pressable
        onPress={() => navigation.navigate("CardDetail", { id: item.id })}
      >
        <Card item={item} index={index} size={CARD_SIZE} />
      </Pressable>
    ),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <StackCarousel
        ref={carouselRef}
        data={CARDS}
        renderItem={renderItem}
        cardWidth={CARD_SIZE}
        cardHeight={CARD_SIZE}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
});
