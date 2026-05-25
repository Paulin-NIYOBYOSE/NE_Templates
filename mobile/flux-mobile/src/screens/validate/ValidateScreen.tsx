import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, Surface, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../../contexts/ThemeContext";
import { appConfig } from "../../config/appConfig";
import { validateToken } from "../../services/generateService";
import { GeneratedRecord } from "../../types";

const ValidateScreen = () => {
  const { theme } = useAppTheme();
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleValidate = async () => {
    if (!tokenInput.trim()) {
      Toast.show({ type: "error", text1: "Required", text2: "Please enter a token" });
      return;
    }

    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      const record = await validateToken(tokenInput.trim());
      if (record) {
        setResult(record);
      } else {
        setNotFound(true);
      }
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Error", text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  const daysRemaining = result
    ? Math.max(
        0,
        result.valueDays -
          Math.floor((Date.now() - new Date(result.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
        Validate Token
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20 }}>
        Enter a token to check its status and details
      </Text>

      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <TextInput
          label="Token Code"
          mode="outlined"
          value={tokenInput}
          onChangeText={setTokenInput}
          placeholder="e.g. 12345678"
          keyboardType="numeric"
          left={<TextInput.Icon icon="barcode-scan" />}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleValidate}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          icon="magnify"
        >
          Validate
        </Button>
      </Surface>

      {notFound && (
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.notFoundContainer}>
            <MaterialCommunityIcons name="close-circle" size={48} color="#EF4444" />
            <Text variant="titleMedium" style={{ color: "#EF4444", marginTop: 12, fontWeight: "600" }}>
              Token Not Found
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              The token you entered does not exist in our records.
            </Text>
          </View>
        </Surface>
      )}

      {result && (
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <View style={styles.resultHeader}>
            <MaterialCommunityIcons name="check-decagram" size={32} color="#10B981" />
            <Text variant="titleLarge" style={{ color: "#10B981", fontWeight: "bold", marginLeft: 8 }}>
              Valid Token
            </Text>
          </View>

          <Divider style={{ marginVertical: 16 }} />

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Token</Text>
            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: "bold" }}>
              {result.token}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {appConfig.generateFields.primaryInput.label}
            </Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {result.meterNumber}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Amount Paid</Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {appConfig.currency} {result.amount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Total Days</Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {result.valueDays} days
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Days Remaining</Text>
            <Text
              variant="titleMedium"
              style={{ color: daysRemaining > 0 ? "#10B981" : "#EF4444", fontWeight: "bold" }}
            >
              {daysRemaining} days
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Status</Text>
            <Text
              variant="titleMedium"
              style={{ color: daysRemaining > 0 ? "#10B981" : "#EF4444", fontWeight: "bold" }}
            >
              {daysRemaining > 0 ? "Active" : "Expired"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Purchased</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {new Date(result.createdAt).toLocaleString()}
            </Text>
          </View>
        </Surface>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  title: { fontWeight: "bold" },
  card: { borderRadius: 16, padding: 24, marginBottom: 16 },
  input: { marginBottom: 16 },
  button: { borderRadius: 12 },
  buttonContent: { paddingVertical: 6 },
  notFoundContainer: { alignItems: "center", padding: 16 },
  resultHeader: { flexDirection: "row", alignItems: "center" },
  detailRow: { marginBottom: 12 },
});

export default ValidateScreen;
