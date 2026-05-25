import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Text, TextInput, Button, Surface, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../../contexts/ThemeContext";
import { appConfig } from "../../config/appConfig";
import { generateValue } from "../../services/generateService";
import { GeneratedRecord } from "../../types";

const GenerateScreen = () => {
  const { theme } = useAppTheme();
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedRecord | null>(null);

  const { generateFields, validation } = appConfig;

  const handleGenerate = async () => {
    // Validate meter number
    if (validation.meterNumber.regex && !validation.meterNumber.regex.test(meterNumber)) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: `${generateFields.primaryInput.label} must be ${validation.meterNumber.length} digits`,
      });
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < validation.amount.min) {
      Toast.show({
        type: "error",
        text1: "Invalid Amount",
        text2: `Minimum amount is ${appConfig.currency} ${validation.amount.min}`,
      });
      return;
    }
    if (numAmount > validation.amount.max) {
      Toast.show({
        type: "error",
        text1: "Invalid Amount",
        text2: `Maximum amount is ${appConfig.currency} ${validation.amount.max.toLocaleString()}`,
      });
      return;
    }

    setLoading(true);
    try {
      const record = await generateValue(meterNumber, numAmount);
      setResult(record);
      Toast.show({ type: "success", text1: "Generated!", text2: "Token created successfully" });
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Error", text2: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMeterNumber("");
    setAmount("");
    setResult(null);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onBackground }]}>
          Generate Token
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 20 }}>
          Enter details to generate a new token
        </Text>

        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <TextInput
            label={generateFields.primaryInput.label}
            mode="outlined"
            value={meterNumber}
            onChangeText={setMeterNumber}
            placeholder={generateFields.primaryInput.placeholder}
            keyboardType={generateFields.primaryInput.keyboardType}
            maxLength={validation.meterNumber.length}
            left={<TextInput.Icon icon="counter" />}
            style={styles.input}
          />

          <TextInput
            label={generateFields.amountInput.label}
            mode="outlined"
            value={amount}
            onChangeText={setAmount}
            placeholder={generateFields.amountInput.placeholder}
            keyboardType={generateFields.amountInput.keyboardType}
            left={<TextInput.Icon icon="cash" />}
            style={styles.input}
          />

          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
            Min: {appConfig.currency} {validation.amount.min} · Step: {validation.amount.step} · Max:{" "}
            {appConfig.currency} {validation.amount.max.toLocaleString()}
          </Text>

          <Button
            mode="contained"
            onPress={handleGenerate}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="lightning-bolt"
          >
            Generate
          </Button>
        </Surface>

        {result && (
          <Surface style={[styles.resultCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <View style={styles.resultHeader}>
              <MaterialCommunityIcons name="check-circle" size={32} color="#10B981" />
              <Text variant="titleLarge" style={{ color: "#10B981", fontWeight: "bold", marginLeft: 8 }}>
                Success!
              </Text>
            </View>

            <Divider style={{ marginVertical: 16 }} />

            <View style={styles.resultRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {appConfig.generateResultLabels.token}
              </Text>
              <Text variant="headlineSmall" style={[styles.tokenText, { color: theme.colors.primary }]}>
                {result.token}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {appConfig.generateResultLabels.valueDays}
              </Text>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: "bold" }}>
                {result.valueDays} days
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {generateFields.primaryInput.label}
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {result.meterNumber}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Amount Paid
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                {appConfig.currency} {result.amount.toLocaleString()}
              </Text>
            </View>

            <Divider style={{ marginVertical: 16 }} />

            <Button mode="outlined" onPress={handleReset} style={styles.resetButton} icon="refresh">
              Generate Another
            </Button>
          </Surface>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 16 },
  title: { fontWeight: "bold" },
  card: { borderRadius: 16, padding: 24, marginBottom: 16 },
  input: { marginBottom: 12 },
  button: { borderRadius: 12 },
  buttonContent: { paddingVertical: 6 },
  buttonLabel: { fontSize: 16, fontWeight: "600" },
  resultCard: { borderRadius: 16, padding: 24, marginTop: 8 },
  resultHeader: { flexDirection: "row", alignItems: "center" },
  resultRow: { marginBottom: 12 },
  tokenText: { fontWeight: "bold", letterSpacing: 2, marginTop: 4, fontFamily: Platform.OS === "ios" ? "Courier" : "monospace" },
  resetButton: { borderRadius: 12 },
});

export default GenerateScreen;
