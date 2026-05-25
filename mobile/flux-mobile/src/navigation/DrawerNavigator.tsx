import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../contexts/ThemeContext";
import { appConfig } from "../config/appConfig";

import TabNavigator from "./TabNavigator";
import ValidateScreen from "../screens/validate/ValidateScreen";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { theme } = useAppTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: theme.colors.surface, width: 280 },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerLabelStyle: { fontSize: 15, fontWeight: "500", marginLeft: -16 },
        drawerItemStyle: { borderRadius: 12, marginHorizontal: 8 },
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{
          title: appConfig.appName,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Validate"
        component={ValidateScreen}
        options={{
          title: "Validate Token",
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.onSurface,
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="check-decagram-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
