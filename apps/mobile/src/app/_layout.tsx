import { AuthProvider, useAuth } from "@/context/auth-context";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

// Create QueryClient outside the component to persist across re-renders
const queryClient = new QueryClient();

function InnerLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return (
      <Stack key="main" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="health" options={{ headerShown: false }} />

        <Stack.Protected guard={user.role === "CUSTOMER"}>
          <Stack.Screen name="customer" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={user.role === "ADMIN"}>
          <Stack.Screen name="admin" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={user.role === "DELIVERYMAN"}>
          <Stack.Screen name="deliveryman" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={user.role === "RESTAURANT_OWNER"}>
          <Stack.Screen name="restaurant" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    );
  }

  return (
    // Auth Stack: Sirf logged-OUT users ke liye — login/register hi dikhega
    <Stack key="auth" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="health" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      {/* ❌ customer/admin/deliveryman/restaurant yahan NAHI — security breach hoga */}
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
