import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text, TextInput, Button, Surface, Chip } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../../contexts/ThemeContext";
import { appConfig } from "../../config/appConfig";
import { EntityItem } from "../../types";
import { createItem, updateItem } from "../../services/entityService";

const ItemFormScreen = ({ navigation, route }: any) => {
  const { theme } = useAppTheme();
  const existingItem: EntityItem | undefined = route.params?.item;
  const isEditing = !!existingItem;

  // Build zod schema dynamically from config
  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    appConfig.entityFields.forEach((field) => {
      let validator: z.ZodTypeAny;
      if (field.type === "number") {
        validator = z
          .string()
          .min(1, `${field.label} is required`)
          .refine((v) => !isNaN(Number(v)), "Must be a number");
      } else {
        validator = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional();
      }
      shape[field.name] = validator as z.ZodTypeAny;
    });
    return z.object(shape);
  }, []);

  type FormData = z.infer<typeof schema>;

  const defaults = useMemo(() => {
    const d: Record<string, string> = {};
    appConfig.entityFields.forEach((field) => {
      d[field.name] = existingItem
        ? String(existingItem[field.name] ?? "")
        : "";
    });
    return d;
  }, [existingItem]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Convert number fields
      const payload: Record<string, unknown> = { ...data };
      appConfig.entityFields.forEach((f) => {
        if (f.type === "number" && payload[f.name]) {
          payload[f.name] = Number(payload[f.name]);
        }
      });

      if (isEditing) {
        await updateItem(existingItem!.id, payload as Partial<EntityItem>);
        Toast.show({
          type: "success",
          text1: "Updated",
          text2: `${appConfig.entityName.singular} updated`,
        });
      } else {
        await createItem(payload as Omit<EntityItem, "id">);
        Toast.show({
          type: "success",
          text1: "Created",
          text2: `${appConfig.entityName.singular} added`,
        });
      }
      navigation.goBack();
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Error", text2: err.message });
    }
  };

  const renderField = (field: (typeof appConfig.entityFields)[number]) => {
    if (field.type === "select" && field.options) {
      return (
        <Controller
          key={field.name}
          control={control}
          name={field.name}
          render={({ field: { onChange, value } }) => (
            <View style={styles.fieldContainer}>
              <Text
                variant="labelLarge"
                style={[styles.fieldLabel, { color: theme.colors.onSurface }]}
              >
                {field.label}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipScrollContent}
              >
                {field.options!.map((opt) => {
                  const isSelected = value === opt;
                  return (
                    <Chip
                      key={opt}
                      selected={isSelected}
                      onPress={() => onChange(opt)}
                      style={[
                        styles.selectChip,
                        isSelected && { backgroundColor: theme.colors.primary },
                      ]}
                      textStyle={[
                        styles.selectChipText,
                        isSelected && { color: "#FFFFFF" },
                      ]}
                      showSelectedCheck={false}
                    >
                      {opt}
                    </Chip>
                  );
                })}
              </ScrollView>
              {errors[field.name] && (
                <Text style={styles.errorText}>
                  {(errors[field.name] as any)?.message}
                </Text>
              )}
            </View>
          )}
        />
      );
    }

    return (
      <Controller
        key={field.name}
        control={control}
        name={field.name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.fieldContainer}>
            <TextInput
              label={field.label}
              mode="outlined"
              value={String(value ?? "")}
              onChangeText={onChange}
              onBlur={onBlur}
              error={!!errors[field.name]}
              placeholder={field.placeholder}
              keyboardType={field.type === "number" ? "numeric" : "default"}
              style={styles.input}
            />
            {errors[field.name] && (
              <Text style={styles.errorText}>
                {(errors[field.name] as any)?.message}
              </Text>
            )}
          </View>
        )}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Surface
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            variant="titleLarge"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            {isEditing
              ? `Edit ${appConfig.entityName.singular}`
              : `Add ${appConfig.entityName.singular}`}
          </Text>

          {appConfig.entityFields.map(renderField)}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {isEditing ? "Update" : "Create"}
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 16 },
  card: { borderRadius: 16, padding: 24 },
  title: { fontWeight: "bold", marginBottom: 20 },
  fieldContainer: { marginBottom: 12 },
  fieldLabel: { marginBottom: 8 },
  input: { marginBottom: 2 },
  chipScrollContent: { gap: 8, paddingVertical: 4 },
  selectChip: { borderRadius: 20 },
  selectChipText: { fontSize: 14 },
  errorText: { color: "#EF4444", fontSize: 12, marginTop: 2, marginLeft: 4 },
  button: { marginTop: 20, borderRadius: 12 },
  buttonContent: { paddingVertical: 6 },
  buttonLabel: { fontSize: 16, fontWeight: "600" },
  cancelButton: { marginTop: 10, borderRadius: 12 },
});

export default ItemFormScreen;
