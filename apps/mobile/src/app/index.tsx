import { useRouter } from "expo-router";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { HealthCheckResponse } from "@food-delivery-app/types";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";

function Home() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery<HealthCheckResponse>({
    queryKey: ["health"],
    queryFn: async (): Promise<HealthCheckResponse> => {
      const response = await axiosInstance.get("/");
      return response.data;
    },
  });

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-pink-500">Food Delivery</Text>

      {isLoading && <ActivityIndicator size="large" color="#ec4899" />}
      {error && (
        <Text className="text-red-500 mt-4">Error: {error.message}</Text>
      )}
      {data && <Text className="text-green-500 mt-4">{data.status}</Text>}

      {/* Login button */}
      <TouchableOpacity
        className="mt-8 bg-blue-500 px-6 py-3 rounded-lg w-30 h-30 bg-orange-600 "
        onPress={() => router.push("/login")}
      >
        <Text className="text-white font-bold">Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Home;
