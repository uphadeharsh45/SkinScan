import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import RecentScanScreen from "./src/screens/RecentScanScreen";
import ScanHistoryScreen from "./src/screens/ScanHistoryScreen";
import ThirdFeatureScreen from "./src/screens/ThirdFeatureScreen";

const Stack = createStackNavigator();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
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

  // Run on mount & every time App re-renders
  useEffect(() => {
    checkAuthToken();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    setIsAuthenticated(false); // Force UI update
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <>
                <Stack.Screen name="Home">
                  {() => <DashboardScreen onLogout={handleLogout} />}
                </Stack.Screen>
                <Stack.Screen name="RecentScan" component={RecentScanScreen} />
                <Stack.Screen name="ScanHistory" component={ScanHistoryScreen} />
                <Stack.Screen name="ThirdFeature" component={ThirdFeatureScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login">
                  {() => <LoginScreen onLogin={checkAuthToken} />}
                </Stack.Screen>
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
