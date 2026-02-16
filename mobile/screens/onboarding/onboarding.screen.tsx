import { View, Text } from "react-native";
import React, { useState } from "react";
import { onBoadingSlides } from "@/configs/constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Slider from "@/components/onboarding/slider";
import Slide from "@/components/onboarding/slide";

const OnBordingScreen = () => {
  const [index, setIndex] = useState<number>(0);
  const prev = onBoadingSlides[index - 1];
  const next = onBoadingSlides[index + 1];
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slider
        key={index}
        index={index}
        setIndex={setIndex}
        prev={
          prev && (
            <Slide
              index={index}
              setIndex={setIndex}
              slide={prev}
              totalSlides={onBoadingSlides.length}
            />
          )
        }
        next={
          next && (
            <Slide
              index={index}
              setIndex={setIndex}
              slide={next}
              totalSlides={onBoadingSlides.length}
            />
          )
        }
      >
        <Slide
          slide={onBoadingSlides[index]}
          index={index}
          setIndex={setIndex}
          totalSlides={onBoadingSlides.length}
        />
      </Slider>
    </GestureHandlerRootView>
  );
};

export default OnBordingScreen;
