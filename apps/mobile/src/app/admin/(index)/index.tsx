import { openSettings } from "expo-linking";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import axiosInstance from "@/lib/axios";
import { useImageUploader } from "@/lib/uploadthing";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/constants";

export default function CreateRestaurantScreen() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { openImagePicker, isUploading } = useImageUploader("restaurantImage", {
    onClientUploadComplete: (res) => {
      setImageUrl(res[0].ufsUrl);
      Alert.alert("Success", "Image uploaded successfully");
    },
    onUploadError: (error) => {
      Alert.alert("Upload failed", error.message);
    },
  });

  const { mutate: createRestaurant, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance.post("/restaurants", {
        name,
        description,
        address,
        cuisineType,
        imageUrl,
      }),
    onSuccess: (restaurant) => {
      void queryClient.setQueryData(["my-restaurant"], restaurant);
      router.replace("/admin/(index)");
    },
    onError: (e: any) => {
      Alert.alert(
        "Error",
        e?.response?.data?.message ?? "Something went wrong",
      );
    },
  });

  function handleSubmit() {
    if (!name || !address || !cuisineType) {
      return Alert.alert(
        "Validation Error",
        "Please fill in all required fields",
      );
    }
    createRestaurant();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Ionicons
              name="restaurant-outline"
              size={32}
              color={COLORS.white}
            />
          </View>
          <Text style={styles.title}>Create Your Restaurant</Text>
          <Text style={styles.subtitle}>
            Fill in the details to get started
          </Text>
        </View>

        {/* Image Upload */}
        <View style={styles.imageSection}>
          <Text style={styles.label}>Restaurant Image</Text>
          <Pressable
            style={({ pressed }) => [
              styles.imagePicker,
              pressed && styles.imagePickerPressed,
              imageUrl && styles.imagePickerWithImage,
            ]}
            onPress={() =>
              void openImagePicker({
                source: "library",
                onInsufficientPermissions: () => {
                  Alert.alert(
                    "Permission Required",
                    "You need to grant permission to access your photos",
                    [
                      { text: "Dismiss", style: "cancel" },
                      { text: "Open Settings", onPress: openSettings },
                    ],
                  );
                },
              })
            }
            disabled={isUploading}
          >
            {imageUrl ? (
              <>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={24} color={COLORS.white} />
                  <Text style={styles.imageOverlayText}>Change Image</Text>
                </View>
              </>
            ) : (
              <View style={styles.imagePlaceholder}>
                {isUploading ? (
                  <>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={48}
                      color={COLORS.primary}
                    />
                    <Text style={styles.imagePickerText}>Tap to upload</Text>
                    <Text style={styles.imagePickerSubtext}>
                      JPG, PNG, WEBP up to 5MB
                    </Text>
                  </>
                )}
              </View>
            )}
          </Pressable>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Restaurant Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="storefront-outline"
                size={20}
                color={COLORS.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. Pasta Paradise"
                placeholderTextColor={COLORS.text.muted}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about your restaurant..."
                placeholderTextColor={COLORS.text.muted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Address <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="location-outline"
                size={20}
                color={COLORS.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. 123 Main St, City"
                placeholderTextColor={COLORS.text.muted}
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Cuisine Type <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="restaurant-outline"
                size={20}
                color={COLORS.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. Italian, Chinese, Mexican"
                placeholderTextColor={COLORS.text.muted}
                value={cuisineType}
                onChangeText={setCuisineType}
              />
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            (isPending || isUploading) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={isPending || isUploading}
        >
          {isPending ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color={COLORS.white} size="small" />
              <Text style={styles.buttonText}>Creating...</Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Create Restaurant</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
            </View>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: "center",
  },
  imageSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  required: {
    color: COLORS.border.error,
  },
  imagePicker: {
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border.default,
    borderStyle: "dashed",
    backgroundColor: COLORS.white,
    overflow: "hidden",
    position: "relative",
  },
  imagePickerPressed: {
    opacity: 0.8,
  },
  imagePickerWithImage: {
    borderStyle: "solid",
    borderColor: COLORS.primary,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imageOverlayText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  imagePickerText: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  imagePickerSubtext: {
    color: COLORS.text.muted,
    fontSize: 12,
    marginTop: 4,
  },
  uploadingText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    marginTop: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  textAreaContainer: {
    alignItems: "flex-start",
    paddingVertical: 8,
    minHeight: 120,
  },
  textArea: {
    minHeight: 120,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
});
