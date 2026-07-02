import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/theme";

export default function Search() {
  return (
    <View style={styles.container}>
      <Text>search</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 24,
  },
});
