import { useCallback, useEffect } from "react";
import { Dimensions } from "react-native";
import {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface CardExpandParams {
  startSize: number;
  endWidth: number;
  endHeight: number;
  topBarHeight: number;
  onExpandComplete?: () => void;
}

/**
 * TWEAK THESE:
 */
const DURATION_IN = 550;
const DURATION_OUT = 400;
const EASING_IN = Easing.bezier(0.4, 0, 0.2, 1);
const EASING_OUT = Easing.bezier(0.4, 0, 0.2, 1);

/**
 * Single-container approach.
 * The container itself IS the card — it has the background color.
 * Width, height, borderRadius, and position all animate from one shared value.
 * No inner views fighting the layout.
 */
export function useCardExpandAnimation({
  startSize,
  endWidth,
  endHeight,
  topBarHeight,
  onExpandComplete,
}: CardExpandParams) {
  const progress = useSharedValue(0);

  const startCenterY = SCREEN_HEIGHT / 2 + 60;
  const endCenterY = topBarHeight + endHeight / 2;
  const offsetY = startCenterY - endCenterY;

  useEffect(() => {
    progress.value = withTiming(
      1,
      {
        duration: DURATION_IN,
        easing: EASING_IN,
      },
      (finished) => {
        "worklet";
        if (finished && onExpandComplete) {
          runOnJS(onExpandComplete)();
        }
      },
    );
  }, []);

  const animateOut = useCallback((onDone: () => void) => {
    progress.value = withTiming(
      0,
      { duration: DURATION_OUT, easing: EASING_OUT },
      (finished) => {
        "worklet";
        if (finished) runOnJS(onDone)();
      },
    );
  }, []);

  /**
   * The card itself: animates size, position, and border radius.
   * At progress=0 it's the square from the index screen.
   * At progress=1 it's the full rectangle.
   */
  const cardStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      width: interpolate(p, [0, 1], [startSize, endWidth]),
      height: interpolate(p, [0, 1], [startSize, endHeight]),
      borderRadius: interpolate(p, [0, 1], [24, 24]),
      overflow: "hidden" as const,
      transform: [{ translateY: interpolate(p, [0, 1], [offsetY, 0]) }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    const cp = interpolate(progress.value, [0.5, 1], [0, 1], "clamp");
    return {
      opacity: cp,
      transform: [{ translateY: interpolate(cp, [0, 1], [20, 0]) }],
    };
  });

  return { cardStyle, contentStyle, animateOut };
}
