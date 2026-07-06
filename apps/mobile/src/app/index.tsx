import { Redirect } from "expo-router";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@food-delivery-app/types";

function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) return <Redirect href="/login" />;

  if (user.role === UserRole.CUSTOMER)
    return <Redirect href={"/customer" as any} />;
  if (user.role === UserRole.ADMIN || user.role === UserRole.RESTAURANT_OWNER)
    return <Redirect href={"/admin" as any} />;
  if (user.role === UserRole.DELIVERYMAN)
    return <Redirect href={"/deliveryman" as any} />;

  // Fallback
  return <Redirect href="/login" />;
}

export default Home;

// ye file User ko sahi route pe redirect karti hai
