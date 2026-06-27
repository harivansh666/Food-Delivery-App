import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";
import {
  LogIn,
  Globe,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { Button } from "@/components/ui/button";

interface LoginErrors {
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

const styles = StyleSheet.create({
  inputContainer: {
    height: 56,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
    marginLeft: 12,
  },
  inputDisabled: {
    color: "#cbd5e1",
  },
});

export default function LoginScreen() {
  const { login } = useAuth();

  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Helper function to get border color
  const getBorderColor = (field: string, hasError: boolean): string => {
    if (hasError) return "#ef4444"; // Red
    if (focusedField === field) return "#FF4B3A"; // Orange
    return "#e2e8f0"; // Slate-100
  };

  // Helper function to get icon color
  const getIconColor = (field: string, hasError: boolean): string => {
    if (hasError) return "#ef4444";
    if (focusedField === field) return "#FF4B3A";
    return "#94a3b8";
  };

  // Validation logic
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!loginState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(loginState.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!loginState.password.trim()) {
      newErrors.password = "Password is required";
    } else if (loginState.password.length < PASSWORD_MIN_LENGTH) {
      newErrors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(loginState.email.trim(), loginState.password);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("email")) {
          setErrors((prev) => ({
            ...prev,
            email: "Email not found or invalid",
          }));
        } else if (error.message.includes("password")) {
          setErrors((prev) => ({
            ...prev,
            password: "Incorrect password",
          }));
        } else {
          Alert.alert("Login Failed", error.message);
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert("Social Login", `${provider} login coming soon!`);
  };

  const handleEmailChange = (text: string) => {
    setLoginState((prev) => ({ ...prev, email: text }));
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setLoginState((prev) => ({ ...prev, password: text }));
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleForgotPassword = () => {
    if (!loginState.email.trim()) {
      Alert.alert("Enter Email", "Please enter your email first");
      return;
    }
    Alert.alert("Reset Password", "Password reset flow coming soon!");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          <View className="flex-1 justify-center py-12">
            {/* Header Section */}
            <View className="mb-10 items-center">
              <View className="w-20 h-20 bg-[#FF4B3A] rounded-3xl items-center justify-center mb-6 shadow-xl shadow-[#FF4B3A]/40">
                <LogIn color="white" size={40} />
              </View>
              <Text className="text-3xl font-extrabold text-slate-900 mb-2">
                Welcome Back
              </Text>
              <Text className="text-base text-slate-500">
                Sign in to continue your food journey
              </Text>
            </View>

            {/* Form Section */}
            <View className="gap-6">
              {/* Email Field */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-slate-700 ml-1">
                  Email Address
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: getBorderColor("email", !!errors.email),
                    },
                  ]}
                >
                  <Mail
                    size={20}
                    color={getIconColor("email", !!errors.email)}
                  />
                  <TextInput
                    style={[styles.input, isLoading && styles.inputDisabled]}
                    placeholder="example@mail.com"
                    placeholderTextColor="#94a3b8"
                    value={loginState.email}
                    onChangeText={handleEmailChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                    accessibilityLabel="Email address input"
                  />
                </View>
                {errors.email && (
                  <Text className="text-xs text-red-500 ml-1">
                    {errors.email}
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-slate-700 ml-1">
                  Password
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      borderColor: getBorderColor(
                        "password",
                        !!errors.password,
                      ),
                    },
                  ]}
                >
                  <Lock
                    size={20}
                    color={getIconColor("password", !!errors.password)}
                  />
                  <TextInput
                    style={[styles.input, isLoading && styles.inputDisabled]}
                    placeholder="Enter your password"
                    placeholderTextColor="#94a3b8"
                    value={loginState.password}
                    onChangeText={handlePasswordChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    accessibilityLabel="Password input"
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#94a3b8" />
                    ) : (
                      <Eye size={20} color="#94a3b8" />
                    )}
                  </Pressable>
                </View>
                {errors.password && (
                  <Text className="text-xs text-red-500 ml-1">
                    {errors.password}
                  </Text>
                )}
              </View>

              {/* Forgot Password */}
              <Pressable
                onPress={handleForgotPassword}
                disabled={isLoading}
                className="self-end"
              >
                <Text className="text-sm font-semibold text-[#FF4B3A]">
                  Forgot Password?
                </Text>
              </Pressable>

              {/* Login Button */}
              <Button
                title="Login"
                onPress={handleLogin}
                isLoading={isLoading}
                containerStyle={{ marginTop: 8 }}
                disabled={isLoading}
              />
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-10">
              <View className="flex-1 h-[1px] bg-slate-100" />
              <Text className="mx-4 text-slate-400 font-medium">
                Or continue with
              </Text>
              <View className="flex-1 h-[1px] bg-slate-100" />
            </View>

            {/* Social Logins */}
            <View className="flex-row gap-4">
              <Button
                variant="outline"
                title="Google"
                icon={Globe}
                onPress={() => handleSocialLogin("Google")}
                disabled={isLoading}
                className="flex-1"
                textStyle={{ fontSize: 16 }}
              />
              <Button
                variant="outline"
                title="GitHub"
                icon={User}
                onPress={() => handleSocialLogin("GitHub")}
                disabled={isLoading}
                className="flex-1"
                textStyle={{ fontSize: 16 }}
              />
            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-10">
              <Text className="text-slate-500 text-base">
                Don't have an account?{" "}
              </Text>
              <Pressable
                onPress={() => router.push("/register")}
                disabled={isLoading}
              >
                <Text className="text-[#FF4B3A] text-base font-bold">
                  Register
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// import { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Pressable,
//   Text,
//   TextInput,
//   View,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from "react-native";
// import { router } from "expo-router";
// import { useAuth } from "@/context/auth-context";

// export default function LoginScreen() {
//   const { login } = useAuth();

//   const [loginState, setLoginState] = useState({
//     email: "",
//     password: "",
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!loginState.email || !loginState.password) {
//       return Alert.alert("Required", "Please fill all fields");
//     }

//     setIsLoading(true);
//     try {
//       await login(loginState.email, loginState.password);
//     } catch (error) {
//       Alert.alert("Error", "Check your credentials and try again");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       className="flex-1 bg-white"
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View className="flex-1 px-6 justify-center">
//           <View className="mb-10">
//             <Text className="text-4xl font-extrabold text-slate-900 mb-2">
//               Welcome Back
//             </Text>
//             <Text className="text-lg text-slate-500">Sign in to continue</Text>
//           </View>

//           <View className="gap-5">
//             <View className="gap-2">
//               <Text className="text-sm font-semibold text-slate-700 ml-1">
//                 Email Address
//               </Text>
//               <TextInput
//                 className="h-14 bg-slate-50 rounded-2xl px-5 text-base text-slate-900 border border-slate-100"
//                 placeholder="example@mail.com"
//                 placeholderTextColor="#94a3b8"
//                 onChangeText={(text) =>
//                   setLoginState({ ...loginState, email: text })
//                 }
//                 value={loginState.email}
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//               />
//             </View>

//             <View className="gap-2">
//               <Text className="text-sm font-semibold text-slate-700 ml-1">
//                 Password
//               </Text>
//               <TextInput
//                 className="h-14 bg-slate-50 rounded-2xl px-5 text-base text-slate-900 border border-slate-100"
//                 placeholder="••••••••"
//                 placeholderTextColor="#94a3b8"
//                 onChangeText={(text) =>
//                   setLoginState({ ...loginState, password: text })
//                 }
//                 value={loginState.password}
//                 secureTextEntry
//               />
//             </View>

//             <Pressable
//               onPress={handleLogin}
//               disabled={isLoading}
//               className={`h-14 bg-[#FF4B3A] rounded-2xl justify-center items-center mt-3 shadow-lg shadow-[#FF4B3A]/30 ${
//                 isLoading ? "opacity-80" : ""
//               }`}
//             >
//               {isLoading ? (
//                 <ActivityIndicator color={"#fff"} />
//               ) : (
//                 <Text className="text-white text-lg font-bold">Login</Text>
//               )}
//             </Pressable>
//           </View>

//           <View className="flex-row justify-center mt-8">
//             <Text className="text-slate-500 text-base">
//               Don't have an account?{" "}
//             </Text>
//             <Pressable onPress={() => router.push("/register")}>
//               <Text className="text-[#FF4B3A] text-base font-bold">
//                 Register
//               </Text>
//             </Pressable>
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// }
