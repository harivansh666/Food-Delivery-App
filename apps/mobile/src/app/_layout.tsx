import { AuthProvider, useAuth } from "@/context/auth-context";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { UserRole } from "@food-delivery-app/types";

const queryClient = new QueryClient();

function InnerLayout() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="health" />

      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && user.role === UserRole.CUSTOMER}>
        <Stack.Screen name="customer" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && user.role === UserRole.DELIVERYMAN}>
        <Stack.Screen name="deliveryman" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && user.role === UserRole.ADMIN}>
        <Stack.Screen name="admin" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerLayout />
      </AuthProvider>
    </QueryClientProvider>
  );
}
// Route block/allow karti hai

// index.tsx — login ke baad automatically sahi jagah le jaata hai ✅

// _layout.tsx — direct URL type karne pe bhi block karta hai ✅
