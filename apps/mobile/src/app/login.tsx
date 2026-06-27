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
  ActivityIndicator,
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

interface LoginErrors {
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

const colors = {
  primary: "#FF4B3A",
  secondary: "#FF6B35",
  white: "#ffffff",
  bg: "#f8fafc",
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    muted: "#64748b",
  },
  border: {
    default: "#e2e8f0",
    focused: "#FF4B3A",
    error: "#ef4444",
  },
  icon: "#94a3b8",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 48,
  },
  headerSection: {
    marginBottom: 40,
    alignItems: "center",
  },
  iconBox: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.muted,
  },
  formSection: {
    gap: 24,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    marginLeft: 4,
  },
  inputContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
    padding: 0,
  },
  inputDisabled: {
    color: colors.text.muted,
  },
  errorText: {
    fontSize: 12,
    color: colors.border.error,
    marginLeft: 4,
    fontWeight: "500",
  },
  forgotButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 40,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.text.muted,
    fontWeight: "500",
  },
  socialContainer: {
    flexDirection: "row",
    gap: 16,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    color: colors.text.muted,
    fontSize: 16,
  },
  registerText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
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

  const getBorderColor = (field: string, hasError: boolean): string => {
    if (hasError) return colors.border.error;
    if (focusedField === field) return colors.border.focused;
    return colors.border.default;
  };

  const getIconColor = (field: string, hasError: boolean): string => {
    if (hasError) return colors.border.error;
    if (focusedField === field) return colors.primary;
    return colors.icon;
  };

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
        Alert.alert("Error", "An unexpected error occurred");
      }
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
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.wrapper}>
            {/* Header */}
            <View style={styles.headerSection}>
              <View style={styles.iconBox}>
                <LogIn color={colors.white} size={40} />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              {/* Email */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <View
                  style={[
                    styles.inputContainer,
                    { borderColor: getBorderColor("email", !!errors.email) },
                  ]}
                >
                  <Mail
                    size={20}
                    color={getIconColor("email", !!errors.email)}
                  />
                  <TextInput
                    style={[styles.input, isLoading && styles.inputDisabled]}
                    placeholder="example@mail.com"
                    placeholderTextColor={colors.icon}
                    value={loginState.email}
                    onChangeText={handleEmailChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Password */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Password</Text>
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
                    placeholderTextColor={colors.icon}
                    value={loginState.password}
                    onChangeText={handlePasswordChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={colors.icon} />
                    ) : (
                      <Eye size={20} color={colors.icon} />
                    )}
                  </Pressable>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {/* Forgot Password */}
              <Pressable
                style={styles.forgotButton}
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>

              {/* Login Button */}
              <Pressable
                style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.primary,
                    borderWidth: 0,
                    marginTop: 16,
                  },
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} size={20} />
                ) : (
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Login
                  </Text>
                )}
              </Pressable>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.socialContainer}>
              <Pressable
                style={[
                  styles.inputContainer,
                  { flex: 1, backgroundColor: colors.white, gap: 8 },
                ]}
                onPress={() => handleSocialLogin("Google")}
                disabled={isLoading}
              >
                <Globe size={20} color={colors.text.secondary} />
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Google
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.inputContainer,
                  { flex: 1, backgroundColor: colors.white, gap: 8 },
                ]}
                onPress={() => handleSocialLogin("GitHub")}
                disabled={isLoading}
              >
                <User size={20} color={colors.text.secondary} />
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  GitHub
                </Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Pressable
                onPress={() => router.push("/register")}
                disabled={isLoading}
              >
                <Text style={styles.registerText}>Register</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
