import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  sub
} from "react-native-reanimated";

import { bInterpolateColor, polar2Canvas } from "react-native-redash";
import { CX, CY, Ring, SIZE, STROKE_WIDTH, TAU } from "./Constants";
import Circle from "./Circle";
import AngularGradient from "./AngularGradient";
import Courtain from "./Courtain";
import polar2CanvasJS from "./Coordinates";

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center"
  }
});
const center = {
  x: CX,
  y: CY
};

interface RingProps {
  ring: Ring;
  progress: Animated.Node<number>;
}

export default ({ ring, progress }: RingProps) => {
  const theta = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, ring.value]
  });
  const revolution = interpolate(theta, {
    inputRange: [0, TAU],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP
  });
  const rotate = interpolate(theta, {
    inputRange: [TAU, 2 * TAU],
    outputRange: [0, TAU],
    extrapolateLeft: Extrapolate.CLAMP
  });
  const { x, y } = polar2Canvas(
    { theta, radius: (ring.size - STROKE_WIDTH) / 2 },
    center
  );
  const { x: x1, y: y1 } = polar2CanvasJS(
    { theta: 0, radius: (ring.size - STROKE_WIDTH) / 2 },
    center
  );
  const x2 = x1 - STROKE_WIDTH / 2;
  const y2 = y1 - STROKE_WIDTH / 2;
  const translateX = sub(x, STROKE_WIDTH / 2);
  const translateY = sub(y, STROKE_WIDTH / 2);
  const backgroundColor = bInterpolateColor(revolution, ring.start, ring.end);
  return (
    <>
      <Animated.View style={[styles.overlay, { transform: [{ rotate }] }]}>
        <AngularGradient {...{ ring }} />
      </Animated.View>
      <View style={styles.overlay}>
        <Circle radius={ring.size / 2 - STROKE_WIDTH} backgroundColor="black" />
      </View>
      <Animated.View style={styles.overlay}>
        <View style={{ width: SIZE, height: SIZE }}>
          <View style={{ transform: [{ translateX: x2 }, { translateY: y2 }] }}>
            <Circle radius={STROKE_WIDTH / 2} backgroundColor={ring.start} />
          </View>
        </View>
      </Animated.View>
      <View style={styles.overlay}>
        <Courtain {...{ ring, revolution }} />
      </View>
      <Animated.View style={styles.overlay}>
        <View style={{ width: SIZE, height: SIZE }}>
          <Animated.View
            style={{ transform: [{ translateX }, { translateY }] }}
          >
            <Circle radius={STROKE_WIDTH / 2} {...{ backgroundColor }} />
          </Animated.View>
        </View>
      </Animated.View>
    </>
  );
};