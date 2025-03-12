import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import checkHighRiskCondition from "./src/utils/checkHighRiskCondition"; 

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import RecentScanScreen from "./src/screens/RecentScanScreen";
import ScanHistoryScreen from "./src/screens/ScanHistoryScreen";
import ThirdFeatureScreen from "./src/screens/ThirdFeatureScreen";

const Stack = createStackNavigator();
const BACKGROUND_FETCH_TASK = "background-health-alert";



// Define Background Task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log("Running background health alert check...");
  
  try {
    await checkHighRiskCondition();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Error in background task:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Function to check if background fetch is enabled and register the task
const registerBackgroundTask = async () => {
  const status = await BackgroundFetch.getStatusAsync();

  if (status === BackgroundFetch.BackgroundFetchStatus.Restricted || status === BackgroundFetch.BackgroundFetchStatus.Denied) {
    console.log("Background fetch is disabled");
    return;
  }

  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
  
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 12*60*60, // Every 12 hours
        stopOnTerminate: false, 
        startOnBoot: true,
      });
      console.log("Background task registered!");
    } catch (error) {
      console.error("Failed to register background task:", error);
    }
  
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  const checkAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      setIsAuthenticated(!!token); 
    } catch (error) {
      console.error("Error reading auth token:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  // Request Notification Permissions
  useEffect(() => {
    const setupApp = async () => {
      // const { status } = await Notifications.requestPermissionsAsync();
      // if (status !== "granted") {
      //   Alert.alert("Permission Required", "Enable notifications to receive health alerts.");
      // }
      await checkAuthToken();
      await registerBackgroundTask();
    };
    setupApp();
  }, []);

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
