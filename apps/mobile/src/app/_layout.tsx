import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";

export default function TabLayout() {
  // create client
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </QueryClientProvider>
  );
}
