import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Surface,
  Button,
  Avatar,
  Divider,
  Switch,
  List,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useAppTheme } from "../../contexts/ThemeContext";
import { appConfig } from "../../config/appConfig";

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useAppTheme();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Profile header */}
      <Surface
        style={[styles.header, { backgroundColor: theme.colors.primary }]}
        elevation={0}
      >
        <Avatar.Text
          size={80}
          label={initials}
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        />
        <Text variant="headlineSmall" style={styles.name}>
          {user?.name ?? "Guest"}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {user?.email ?? "guest@example.com"}
        </Text>
      </Surface>

      <View style={styles.content}>
        {/* Settings section */}
        <Surface
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Settings
          </Text>

          <List.Item
            title="Dark Mode"
            description={isDark ? "Dark theme active" : "Light theme active"}
            left={(props) => (
              <List.Icon
                {...props}
                icon={isDark ? "weather-night" : "white-balance-sunny"}
              />
            )}
            right={() => <Switch value={isDark} onValueChange={toggleTheme} />}
          />

          <Divider />

          <List.Item
            title="App Version"
            description="1.0.0"
            left={(props) => (
              <List.Icon {...props} icon="information-outline" />
            )}
          />

          <Divider />

          <List.Item
            title="API Base URL"
            description={appConfig.apiBaseUrl}
            left={(props) => <List.Icon {...props} icon="server-network" />}
            descriptionNumberOfLines={2}
          />

          <Divider />

          <List.Item
            title="Mock API"
            description={
              appConfig.useMockApi ? "Using mock data" : "Using real backend"
            }
            left={(props) => <List.Icon {...props} icon="database-outline" />}
          />
        </Surface>

        {/* Account info */}
        <Surface
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Account
          </Text>

          <List.Item
            title="Name"
            description={user?.name ?? "—"}
            left={(props) => <List.Icon {...props} icon="account-outline" />}
          />
          <Divider />
          <List.Item
            title="Email"
            description={user?.email ?? "—"}
            left={(props) => <List.Icon {...props} icon="email-outline" />}
          />
          {user?.phone && (
            <>
              <Divider />
              <List.Item
                title="Phone"
                description={user.phone}
                left={(props) => <List.Icon {...props} icon="phone-outline" />}
              />
            </>
          )}
        </Surface>

        {/* About section */}
        <Surface
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            About
          </Text>
          <View style={styles.aboutContent}>
            <MaterialCommunityIcons
              name="cellphone-check"
              size={32}
              color={theme.colors.primary}
            />
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              {appConfig.appName} — A generic mobile app template for National
              Examinations. Built with Expo + React Native + TypeScript.
            </Text>
          </View>
        </Surface>

        {/* Logout */}
        <Button
          mode="contained"
          onPress={logout}
          style={styles.logoutButton}
          contentStyle={styles.logoutContent}
          labelStyle={styles.logoutLabel}
          buttonColor="#EF4444"
          icon="logout"
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  name: { color: "#FFFFFF", fontWeight: "bold", marginTop: 12 },
  email: { color: "rgba(255,255,255,0.8)", marginTop: 4 },
  content: { padding: 16 },
  card: { borderRadius: 16, marginBottom: 16, overflow: "hidden" },
  sectionTitle: {
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  aboutContent: { alignItems: "center", padding: 24 },
  logoutButton: { borderRadius: 12, marginTop: 8, marginBottom: 32 },
  logoutContent: { paddingVertical: 6 },
  logoutLabel: { fontSize: 16, fontWeight: "600" },
});

export default ProfileScreen;
