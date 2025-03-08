import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import RecentScanScreen from "../screens/RecentScanScreen";
import ScanHistoryScreen from "../screens/ScanHistoryScreen";
import ThirdFeatureScreen from "../screens/ThirdFeatureScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={DashboardScreen} />
        <Stack.Screen name="RecentScan" component={RecentScanScreen} />
        <Stack.Screen name="ScanHistory" component={ScanHistoryScreen} />
        <Stack.Screen name="ThirdFeature" component={ThirdFeatureScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
