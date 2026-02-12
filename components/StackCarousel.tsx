import React, { useCallback } from "react";
import { Dimensions, View, ViewStyle } from "react-native";
import { Extrapolation, interpolate } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface StackCarouselProps<T> {
  data: T[];
  renderItem: (info: {
    item: T;
    index: number;
    animationValue: any;
  }) => React.ReactElement;
  cardWidth?: number;
  cardHeight?: number;
  stackOffset?: number;
  stackScaleStep?: number;
  maxVisibleCards?: number;
  loop?: boolean;
  onSnapToItem?: (index: number) => void;
}

export function StackCarousel<T>({
  data,
  renderItem,
  cardWidth = SCREEN_WIDTH * 0.85,
  cardHeight = SCREEN_HEIGHT * 0.55,
  stackOffset = 14,
  stackScaleStep = 0.05,
  maxVisibleCards = 4,
  loop = false,
  onSnapToItem,
}: StackCarouselProps<T>) {
  const animationStyle = useCallback(
    (value: number): ViewStyle => {
      "worklet";

      // --- translateY ---
      // value < 0 : card swiped up and away
      // value 0   : resting position (front)
      // value > 0 : peeking out below the front card
      // use full screen height so the card travels all the way up and out
      const dismissDistance = SCREEN_HEIGHT + cardHeight;

      const translateY = interpolate(
        value,
        [-1, 0, 1, 2, 3, 4],
        [
          -dismissDistance,
          0,
          stackOffset,
          stackOffset * 2,
          stackOffset * 3,
          stackOffset * 4,
        ],
        Extrapolation.CLAMP,
      );

      // --- scale ---
      // front card is 1.0; each card behind shrinks a step
      const scale = interpolate(
        value,
        [-1, 0, 1, 2, 3, 4],
        [
          0.95,
          1,
          1 - stackScaleStep,
          1 - stackScaleStep * 2,
          1 - stackScaleStep * 3,
          1 - stackScaleStep * 4,
        ],
        Extrapolation.CLAMP,
      );

      // --- opacity ---
      // keep full opacity while the card is being swiped away;
      // only fade the deepest stack cards slightly.
      const opacity = interpolate(
        value,
        [-1, 0, 1, maxVisibleCards],
        [1, 1, 1, 0.6],
        Extrapolation.CLAMP,
      );

      // --- zIndex ---
      // the card being swiped away (value < 0) must stay on top
      // the entire time so it doesn't dip behind the next card.
      const zIndex = interpolate(
        value,
        [-1, 0, 1, 2, 3, 4],
        [
          maxVisibleCards + 2,
          maxVisibleCards + 1,
          maxVisibleCards,
          maxVisibleCards - 1,
          maxVisibleCards - 2,
          maxVisibleCards - 3,
        ],
      );

      // --- subtle rotation on dismiss ---
      // Gives a natural "flick" feel when swiping up
      const rotateZ = interpolate(
        value,
        [-1, -0.5, 0, 0.5, 1],
        [-3, -1.5, 0, 0, 0],
        Extrapolation.CLAMP,
      );

      return {
        transform: [{ translateY }, { scale }, { rotateZ: `${rotateZ}deg` }],
        opacity,
        zIndex: Math.round(zIndex),
      };
    },
    [cardHeight, stackOffset, stackScaleStep, maxVisibleCards],
  );

  return (
    <View
      style={{
        width: cardWidth,
        height: cardHeight + stackOffset * maxVisibleCards,
        alignSelf: "center",
        overflow: "visible",
      }}
    >
      <Carousel
        vertical
        data={data}
        renderItem={renderItem}
        width={cardWidth}
        height={cardHeight}
        customAnimation={animationStyle}
        windowSize={maxVisibleCards + 2}
        loop={loop}
        onSnapToItem={onSnapToItem}
        autoFillData={false}
        overscrollEnabled={false}
        style={{
          width: cardWidth,
          height: cardHeight + stackOffset * maxVisibleCards,
          overflow: "visible",
        }}
      />
    </View>
  );
}
