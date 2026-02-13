import { Card, CardData } from "@/components/Card";
import { StackCarousel } from "@/components/StackCarousel";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

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

export default function Index() {
  const router = useRouter();

  const renderItem = useCallback(
    ({ item, index }: { item: CardData; index: number }) => (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/card/[id]" as any,
            params: { id: item.id },
          })
        }
      >
        <Card item={item} index={index} size={CARD_SIZE} />
      </Pressable>
    ),
    [router],
  );

  return (
    <View style={styles.container}>
      <StackCarousel
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
