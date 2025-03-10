import React, { useState, useEffect, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import RecentScanScreen from "../screens/RecentScanScreen";
import ScanHistoryScreen from "../screens/ScanHistoryScreen";
import ThirdFeatureScreen from "../screens/ThirdFeatureScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check authentication token
  const checkAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      setIsAuthenticated(!!token); // Convert token to boolean
    } catch (error) {
      console.error("Error reading auth token:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-run checkAuthToken when the screen is focused
  useFocusEffect(
    useCallback(() => {
      checkAuthToken();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={DashboardScreen} />
            <Stack.Screen name="RecentScan" component={RecentScanScreen} />
            <Stack.Screen name="ScanHistory" component={ScanHistoryScreen} />
            <Stack.Screen name="ThirdFeature" component={ThirdFeatureScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
