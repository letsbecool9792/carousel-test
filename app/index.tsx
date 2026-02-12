import { Card, CardData } from "@/components/Card";
import { StackCarousel } from "@/components/StackCarousel";
import React, { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_SIZE = SCREEN_WIDTH * 0.85;

const COLORS = [
  "#6C5CE7",
  "#E17055",
  "#00B894",
  "#0984E3",
  "#D63031",
  "#FDCB6E",
];

const CARDS: CardData[] = COLORS.map((color, i) => ({
  id: String(i + 1),
  label: `Card ${i + 1}`,
  color,
}));

export default function Index() {
  const renderItem = useCallback(
    ({ item, index }: { item: CardData; index: number }) => (
      <Card item={item} index={index} size={CARD_SIZE} />
    ),
    [],
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
