import { Redirect } from "expo-router";
import { useAuth } from "@/context/auth-context";

function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) return <Redirect href="/login" />;

  if (user.role === "CUSTOMER") return <Redirect href={"/customer" as any} />;
  if (user.role === "ADMIN") return <Redirect href={"/admin" as any} />;
  if (user.role === "DELIVERYMAN")
    return <Redirect href={"/deliveryman" as any} />;
  if (user.role === "RESTAURANT_OWNER")
    return <Redirect href={"/restaurant" as any} />;

  // Fallback
  return <Redirect href="/login" />;
}

export default Home;

// ye file User ko sahi route pe redirect karti hai
