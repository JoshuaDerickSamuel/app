import React from "react";
import { Stack } from "expo-router";

export default function CameraLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "default",
        presentation: "card",
        gestureEnabled: true, // Enable swipe gestures
      }}
    >
      <Stack.Screen name="add" />
    </Stack>
  );
}
