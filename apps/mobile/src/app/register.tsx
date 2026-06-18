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
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import { UserRole } from "@food-delivery-app/types";
import { useAuth } from "@/context/auth-context";

export default function RegisterScreen() {
  const { register } = useAuth();

  const [registerState, setRegisterState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: UserRole.CUSTOMER,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    const { firstName, lastName, email, password } = registerState;
    if (!firstName || !lastName || !email || !password) {
      return Alert.alert("Required", "Please fill all fields");
    }

    setIsLoading(true);
    try {
      await register(registerState);
      Alert.alert("Success", "Account created successfully!");
    } catch (error) {
      Alert.alert(
        "Registration Error",
        "Something went wrong. Please try again.",
      );
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
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          className="flex-1 px-6 pt-16"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8">
            <Text className="text-4xl font-extrabold text-slate-900 mb-2">
              Create Account
            </Text>
            <Text className="text-lg text-slate-500">
              Join our food delivery community
            </Text>
          </View>

          <View className="gap-5">
            <View className="flex-row gap-3">
              <View className="flex-1 gap-2">
                <Text className="text-sm font-semibold text-slate-700 ml-1">
                  First Name
                </Text>
                <TextInput
                  className="h-14 bg-slate-50 rounded-2xl px-5 text-base text-slate-900 border border-slate-100"
                  placeholder="John"
                  placeholderTextColor="#94a3b8"
                  onChangeText={(text) =>
                    setRegisterState({ ...registerState, firstName: text })
                  }
                  value={registerState.firstName}
                />
              </View>
              <View className="flex-1 gap-2">
                <Text className="text-sm font-semibold text-slate-700 ml-1">
                  Last Name
                </Text>
                <TextInput
                  className="h-14 bg-slate-50 rounded-2xl px-5 text-base text-slate-900 border border-slate-100"
                  placeholder="Doe"
                  placeholderTextColor="#94a3b8"
                  onChangeText={(text) =>
                    setRegisterState({ ...registerState, lastName: text })
                  }
                  value={registerState.lastName}
                />
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </Text>
              <TextInput
                className="h-14 bg-slate-50 rounded-2xl px-5 text-base text-slate-900 border border-slate-100"
                placeholder="example@mail.com"
                placeholderTextColor="#94a3b8"
                onChangeText={(text) =>
                  setRegisterState({ ...registerState, email: text })
                }
                value={registerState.email}
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
                  setRegisterState({ ...registerState, password: text })
                }
                value={registerState.password}
                secureTextEntry
              />
            </View>

            <View className="gap-3 mt-1">
              <Text className="text-sm font-semibold text-slate-700 ml-1">
                Register as:
              </Text>
              <View className="flex-row gap-3">
                <Pressable
                  className={`flex-1 h-12 rounded-xl border justify-center items-center ${
                    registerState.role === UserRole.CUSTOMER
                      ? "bg-[#FF4B3A10] border-[#FF4B3A]"
                      : "bg-slate-50 border-slate-100"
                  }`}
                  onPress={() =>
                    setRegisterState({
                      ...registerState,
                      role: UserRole.CUSTOMER,
                    })
                  }
                >
                  <Text
                    className={`text-sm font-semibold ${
                      registerState.role === UserRole.CUSTOMER
                        ? "text-[#FF4B3A]"
                        : "text-slate-500"
                    }`}
                  >
                    Customer
                  </Text>
                </Pressable>
                {/* <Pressable
                  className={`flex-1 h-12 rounded-xl border justify-center items-center ${
                    registerState.role === UserRole.RESTAURANT_OWNER
                      ? "bg-[#FF4B3A10] border-[#FF4B3A]"
                      : "bg-slate-50 border-slate-100"
                  }`}
                  onPress={() =>
                    setRegisterState({
                      ...registerState,
                      role: UserRole.RESTAURANT_OWNER,
                    })
                  }
                >
                  <Text
                    className={`text-sm font-semibold ${
                      registerState.role === UserRole.RESTAURANT_OWNER
                        ? "text-[#FF4B3A]"
                        : "text-slate-500"
                    }`}
                  >
                    Restaurant
                  </Text>
                </Pressable> */}
              </View>
            </View>

            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              className={`h-14 bg-[#FF4B3A] rounded-2xl justify-center items-center mt-3 shadow-lg shadow-[#FF4B3A]/30 ${
                isLoading ? "opacity-80" : ""
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color={"#fff"} />
              ) : (
                <Text className="text-white text-lg font-bold">Sign Up</Text>
              )}
            </Pressable>
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-500 text-base">
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text className="text-[#FF4B3A] text-base font-bold">Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
