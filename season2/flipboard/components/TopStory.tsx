import * as React from "react";
import {
  View, StyleSheet, Dimensions, Image,
} from "react-native";
import { DangerZone } from "expo";

import Interactable from "./Interactable";

const {
  Animated,
} = DangerZone;
const {
  Value, Extrapolate, interpolate, concat,
} = Animated;
const { height } = Dimensions.get("window");
const frontPerspective = 1000;
const backPerspective = -frontPerspective;

interface StoriesProps {
  front: string;
  back: string;
}

interface StoriesState {
  isDragging: boolean;
}

export default class Story extends React.PureComponent<StoriesProps, StoriesState> {
  state: StoriesState = {
    isDragging: false,
  };

  y = new Value(0);

  onDrag = () => {
    const { isDragging } = this.state;
    this.setState({ isDragging: !isDragging });
  }

  render() {
    const { y, onDrag } = this;
    const { front, back } = this.props;
    const { isDragging } = this.state;
    const interpolation = interpolate(y, {
      inputRange: [0, height],
      outputRange: [0, -180],
      extrapolate: Extrapolate.CLAMP,
    });
    const rotateX = concat(interpolation, "deg");
    const snapPoints = [{ y: 0 }, { y: height }];
    return (
      <View style={{ flex: 1, zIndex: isDragging ? 100 : 0 }}>
        <View style={styles.story}>
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              transform: [backPerspective, { rotateY: "180deg" }, { translateY: height / 4 }, { rotateX }, { translateY: -height / 4 }, { rotateZ: "180deg" }],
            }}
          >
            <Image source={{ uri: back }} style={styles.image} />
          </Animated.View>
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              backfaceVisibility: "hidden",
              transform: [frontPerspective, { translateY: height / 4 }, { rotateX }, { translateY: -height / 4 }],
            }}
          >
            <Image source={{ uri: front }} style={styles.image} />
          </Animated.View>
        </View>
        <Interactable
          style={{
            backgroundColor: "rgba(100, 500, 0, 0.5)", height, position: "absolute", top: -height / 2, left: 0, right: 0,
          }}
          animatedValueY={y}
          verticalOnly
          {...{ snapPoints, onDrag }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  story: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: "cover",
  },
});
