import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LucideIcon } from "lucide-react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  className?: string;
}

export const Button = ({
  onPress,
  title,
  variant = "primary",
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  containerStyle,
  textStyle,
  className = "",
}: ButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-[#FF4B3A] shadow-lg shadow-[#FF4B3A]/30";
      case "secondary":
        return "bg-slate-900";
      case "outline":
        return "bg-transparent border border-slate-200";
      case "ghost":
        return "bg-transparent";
      default:
        return "bg-[#FF4B3A]";
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
      case "ghost":
        return "text-slate-900";
      default:
        return "text-white";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`h-14 rounded-2xl flex-row justify-center items-center px-6 ${getVariantStyles()} ${
        disabled || isLoading ? "opacity-60" : ""
      } ${className}`}
      style={containerStyle}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "outline" ? "#FF4B3A" : "#fff"} />
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon
              size={20}
              color={variant === "outline" ? "#0f172a" : "#fff"}
              className="mr-2"
            />
          )}
          <Text
            className={`text-lg font-bold ${getTextStyle()}`}
            style={textStyle}
          >
            {title}
          </Text>
          {Icon && iconPosition === "right" && (
            <Icon
              size={20}
              color={variant === "outline" ? "#0f172a" : "#fff"}
              className="ml-2"
            />
          )}
        </>
      )}
    </Pressable>
  );
};
