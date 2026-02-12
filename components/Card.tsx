import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface CardData {
  id: string;
  label: string;
  color: string;
}

interface CardProps {
  item: CardData;
  index: number;
  size: number;
}

export function Card({ item, size }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        { width: size, height: size, backgroundColor: item.color },
      ]}
    >
      <Text style={styles.label}>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  label: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
});
