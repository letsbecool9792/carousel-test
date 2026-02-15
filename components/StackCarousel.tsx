import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
} from "react";
import { Dimensions, View, ViewStyle } from "react-native";
import { Extrapolation, interpolate } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

export interface StackCarouselRef {
  scrollTo: (index: number) => void;
}

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
  /** Animation duration in ms. Lower = faster. Default 400. */
  animationDuration?: number;
  onSnapToItem?: (index: number) => void;
}

function StackCarouselInner<T>(
  {
    data,
    renderItem,
    cardWidth = SCREEN_WIDTH * 0.85,
    cardHeight = SCREEN_HEIGHT * 0.55,
    stackOffset = 18,
    stackScaleStep = 0.05,
    maxVisibleCards = 2,
    loop = true,
    animationDuration = 900,
    onSnapToItem,
  }: StackCarouselProps<T>,
  ref: React.Ref<StackCarouselRef>,
) {
  const carouselRef = useRef<ICarouselInstance>(null);

  useImperativeHandle(ref, () => ({
    scrollTo: (index: number) => {
      carouselRef.current?.scrollTo({ index, animated: false });
    },
  }));
  // Spring config: lower duration = higher stiffness = faster
  // Damping is calculated to prevent bounce (overdamped)
  const mass = 0.9;
  const stiffness = 60000 / animationDuration;
  const damping = Math.sqrt(stiffness * mass) * 2.5; // heavily overdamped, zero bounce

  const dismissDistance = SCREEN_HEIGHT + cardHeight;

  const animationStyle = useCallback(
    (value: number): ViewStyle => {
      "worklet";

      // Build interpolation arrays dynamically based on maxVisibleCards
      // Input:  [-1, 0, 1, 2, ..., maxVisibleCards]
      // Each output array maps these positions to visual properties

      const inputRange = [-1, 0];
      const translateYOutput = [-dismissDistance, 0];
      //const translateYOutput = [dismissDistance, 0];
      const scaleOutput = [0.95, 1];
      const zIndexOutput = [maxVisibleCards + 2, maxVisibleCards + 1];
      const opacityOutput = [1, 1];

      for (let i = 1; i <= maxVisibleCards; i++) {
        inputRange.push(i);
        translateYOutput.push(stackOffset * i);
        scaleOutput.push(1 - stackScaleStep * i);
        zIndexOutput.push(maxVisibleCards + 1 - i);
        // Last visible card is slightly faded, rest full opacity
        opacityOutput.push(i === maxVisibleCards ? 0.6 : 1);
      }

      // One extra slot beyond maxVisibleCards — fully hidden
      inputRange.push(maxVisibleCards + 1);
      translateYOutput.push(stackOffset * maxVisibleCards);
      scaleOutput.push(1 - stackScaleStep * maxVisibleCards);
      zIndexOutput.push(0);
      opacityOutput.push(0);

      const translateY = interpolate(
        value,
        inputRange,
        translateYOutput,
        Extrapolation.CLAMP,
      );
      const scale = interpolate(
        value,
        inputRange,
        scaleOutput,
        Extrapolation.CLAMP,
      );
      const opacity = interpolate(
        value,
        inputRange,
        opacityOutput,
        Extrapolation.CLAMP,
      );
      const zIndex = interpolate(value, inputRange, zIndexOutput);

      // --- subtle rotation on dismiss ---
      /*
      const rotateZ = interpolate(
        value,
        [-1, -0.5, 0, 0.5, 1],
        [-3, -1.5, 0, 0, 0],
        Extrapolation.CLAMP,
      );*/

      return {
        transform: [{ translateY }, { scale }],
        opacity,
        zIndex: Math.round(zIndex),
      };
    },
    [dismissDistance, stackOffset, stackScaleStep, maxVisibleCards],
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
        ref={carouselRef}
        vertical
        data={data}
        renderItem={renderItem}
        width={cardWidth}
        height={cardHeight}
        customAnimation={animationStyle}
        windowSize={maxVisibleCards + 2}
        loop={loop}
        withAnimation={{
          type: "spring",
          config: { damping, stiffness, mass },
        }}
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

export const StackCarousel = forwardRef(StackCarouselInner) as <T>(
  props: StackCarouselProps<T> & { ref?: React.Ref<StackCarouselRef> },
) => React.ReactElement;
