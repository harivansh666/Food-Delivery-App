import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/auth-context";

export default function LoginScreen() {
  const { login } = useAuth();

  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginState.email || !loginState.password) {
      return Alert.alert("Required", "Please fill all fields");
    }

    setIsLoading(true);
    try {
      await login(loginState.email, loginState.password);
    } catch (error) {
      Alert.alert("Error", "Check your credentials and try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-6 justify-center">
          <View className="mb-10">
            <Text className="text-4xl font-extrabold text-slate-900 mb-2">
              Welcome Back
            </Text>
            <Text className="text-lg text-slate-500">Sign in to continue</Text>
          </View>

          <View className="gap-5">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </Text>
              <TextInput
                className="h-14 bg-slate-50 rounded-2xl px-5 text-base text-slate-900 border border-slate-100"
                placeholder="example@mail.com"
                placeholderTextColor="#94a3b8"
                onChangeText={(text) =>
                  setLoginState({ ...loginState, email: text })
                }
                value={loginState.email}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-slate-700 ml-1">
                Password
              </Text>
              <TextInput
                className="h-14 bg-slate-50 rounded-2xl px-5 text-base text-slate-900 border border-slate-100"
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                onChangeText={(text) =>
                  setLoginState({ ...loginState, password: text })
                }
                value={loginState.password}
                secureTextEntry
              />
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              className={`h-14 bg-[#FF4B3A] rounded-2xl justify-center items-center mt-3 shadow-lg shadow-[#FF4B3A]/30 ${
                isLoading ? "opacity-80" : ""
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color={"#fff"} />
              ) : (
                <Text className="text-white text-lg font-bold">Login</Text>
              )}
            </Pressable>
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-500 text-base">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text className="text-[#FF4B3A] text-base font-bold">
                Register
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
