import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { HealthCheckResponse } from "@food-delivery-app/types";
import { View, Text, ActivityIndicator } from "react-native";

function Home() {
  const { data, isLoading, error } = useQuery<HealthCheckResponse>({
    queryKey: ["health"],
    queryFn: async (): Promise<HealthCheckResponse> => {
      const response = await axiosInstance.get("/");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-blue-500">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-rose-500">
          Error: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-pink-500">Food Delivery</Text>
        <Text className="text-2xl font-bold text-pink-500">{data?.status}</Text>
        {isLoading ? <ActivityIndicator className="text-orange-500" /> : null}
      </View>
    </>
  );
}

export default Home;
