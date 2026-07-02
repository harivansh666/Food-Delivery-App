import { COLORS } from "@/constants/constants";
import { Colors } from "@/constants/theme";
import { View, Text, StyleSheet } from "react-native";

export default function Cart() {
  return (
    <View style={styles.container}>
      <Text>Cart</Text>
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
