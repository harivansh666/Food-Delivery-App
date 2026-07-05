import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/context/auth-context";
import { Link } from "expo-router";

export default function AdminHomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ Admin Dashboard</Text>

      <Text style={styles.subtitle}>Welcome {user?.name ?? "Admin"}</Text>

      <Link
        style={styles.createRestaurant}
        href={"/admin/(index)/create-restaurant"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
  },

  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  createRestaurant: {
    height: 30,
    width: 90,
    backgroundColor: "#FF0000",
    borderRadius: 20,
  },
});
