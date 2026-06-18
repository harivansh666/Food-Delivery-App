import { AuthProvider } from "@/context/auth-context";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Stack } from "expo-router";

export default function TabLayout() {
  // create client
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
