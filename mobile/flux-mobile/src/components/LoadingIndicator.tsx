import React from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useAppTheme } from "../contexts/ThemeContext";

interface Props {
  message?: string;
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<Props> = ({ message = "Loading…", fullScreen = true }) => {
  const { theme } = useAppTheme();

  if (!fullScreen) {
    return <ActivityIndicator animating color={theme.colors.primary} style={{ marginVertical: 16 }} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator animating size="large" color={theme.colors.primary} />
      <Text variant="bodyMedium" style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { marginTop: 12 },
});

export default LoadingIndicator;
