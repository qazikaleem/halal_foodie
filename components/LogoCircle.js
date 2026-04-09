// LogoCircle.js
import React, { useMemo } from "react";
import { Text, View } from "react-native";

/**
 * Props:
 *  - name: string (store name)
 *  - size: number (diameter in px) default 48
 *  - deterministic: boolean (true => color derived from name) default true
 *  - palette: optional array of hex colors to pick from (overrides HSL generator)
 *  - style / textStyle: optional additional styles
 */
export default function LogoCircle({
  name = "?",
  size = 48,
  deterministic = true,
  palette = null,
  style,
  textStyle,
}) {
  const first = (name || "?").toString().trim().charAt(0).toUpperCase() || "?";

  // Simple hash -> number for deterministic color
  const hashString = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0; // convert to 32bit int
    }
    return Math.abs(h);
  };

  // HSL -> HEX converter
  const hslToHex = (h, s, l) => {
    // h: 0..360, s: 0..100, l:0..100
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);
    const toHex = (x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  };

  // Contrast: return '#000' or '#fff' depending on background hex
  const getContrastColor = (hex) => {
    // remove '#'
    const c = hex.replace("#", "");
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);
    // relative luminance (approx)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
  };

  const backgroundColor = useMemo(() => {
    if (palette && Array.isArray(palette) && palette.length > 0) {
      if (deterministic) {
        const idx = hashString(name) % palette.length;
        return palette[idx];
      }
      // random pick
      return palette[Math.floor(Math.random() * palette.length)];
    }

    if (deterministic) {
      // derive Hue from hash, keep saturation and lightness pleasant
      const h = hashString(name) % 360; // 0..359
      return hslToHex(h, 65, 55);
    }

    // truly random HSL
    const h = Math.floor(Math.random() * 360);
    return hslToHex(h, 65, 55);
  }, [name, deterministic, palette]);

  const color = getContrastColor(backgroundColor);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    // subtle shadow on iOS + elevation on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  };

  const letterStyle = {
    color,
    fontSize: Math.round(size * 0.45),
    fontWeight: "700",
    includeFontPadding: false,
    textAlignVertical: "center",
    textAlign: "center",
  };

  return (
    <View style={[containerStyle, style]}>
      <Text style={[letterStyle, textStyle]} accessibilityLabel={`${name} logo`}>
        {first}
      </Text>
    </View>
  );
}
