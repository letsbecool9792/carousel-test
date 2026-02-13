import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

export interface CardData {
  id: string;
  image: ImageSourcePropType;
}

interface CardProps {
  item: CardData;
  index: number;
  size: number;
}

export function Card({ item, size }: CardProps) {
  return (
    <View style={[styles.card, { width: size, height: size }]}>
      <Image source={item.image} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
