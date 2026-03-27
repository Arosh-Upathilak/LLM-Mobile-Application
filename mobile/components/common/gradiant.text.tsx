import React from "react";
import { TextStyle } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from "react-native-svg";

export default function GradiantText({
  text,
  styles,
}: {
  text: string;
  styles: TextStyle;
}) {
  const fontSize = styles?.fontSize || 30;

  return (
    <Svg
      height={fontSize * 1}
      width="200"
      style={{ marginTop: 8}} 

    >
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#6D55FE" />
          <Stop offset="100%" stopColor="#8976FC" />
        </LinearGradient>
      </Defs>

      <SvgText
        fill="url(#grad)"
        fontSize={fontSize}
        fontWeight={styles?.fontWeight as any}
        fontFamily={styles?.fontFamily}
        x="0"
        y={fontSize - 4}  
        alignmentBaseline="baseline"
      >
        {text}
      </SvgText>
    </Svg>
  );
}