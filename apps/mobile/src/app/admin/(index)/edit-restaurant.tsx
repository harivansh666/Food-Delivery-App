import { useEffect, useState } from "react";
import { openSettings } from "expo-linking";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useImageUploader } from "@/lib/uploadthing";
import axiosInstance from "@/lib/axios";
import { RestaurantType } from "@food-delivery-app/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/constants";

export default function EditRestaurantScreen() {
  const queryClient = useQueryClient();

  const { data: restaurant, isLoading: isLoadingRestaurant } =
    useQuery<RestaurantType | null>({
      queryKey: ["my-restaurant"],
      queryFn: () =>
        axiosInstance
          .get<RestaurantType | null>("/restaurants/mine")
          .then((res) => res.data),
    });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name);
      setDescription(restaurant.description ?? "");
      setAddress(restaurant.address);
      setCuisineType(restaurant.cuisineType);
      setImageUrl(restaurant.imageUrl);
    }
  }, [restaurant]);

  const { openImagePicker, isUploading } = useImageUploader("restaurantImage", {
    onClientUploadComplete: (res) => {
      setImageUrl(res[0].ufsUrl);
      Alert.alert("Success", "Image updated successfully");
    },
    onUploadError: (error) => {
      Alert.alert("Upload failed", error.message);
    },
  });

  const { mutate: updateRestaurant, isPending } = useMutation({
    mutationFn: () =>
      axiosInstance.patch(`/restaurants/${restaurant?.id}`, {
        name,
        description,
        address,
        cuisineType,
        imageUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] });
      Alert.alert("Success", "Restaurant updated successfully");
      router.back();
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
    updateRestaurant();
  }

  if (isLoadingRestaurant) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading restaurant...</Text>
      </View>
    );
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
        {/* Header with Back Button */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </Pressable>
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="create-outline" size={28} color={COLORS.white} />
            </View>
            <Text style={styles.title}>Edit Restaurant</Text>
            <Text style={styles.subtitle}>
              Update your restaurant information
            </Text>
          </View>
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

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

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
                <Text style={styles.buttonText}>Saving...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Save Changes</Text>
                <Ionicons name="checkmark" size={20} color={COLORS.white} />
              </View>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 20,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    alignItems: "center",
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 4,
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
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
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
