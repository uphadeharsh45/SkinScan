import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      <Button title="View Recent Scan Results" onPress={() => navigation.navigate("RecentScan")} />
      <Button title="View Scan History" onPress={() => navigation.navigate("ScanHistory")} />
      <Button title="Third Feature" onPress={() => navigation.navigate("ThirdFeature")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default DashboardScreen;
