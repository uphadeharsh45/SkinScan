import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ScanHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Scan History</Text>
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
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ScanHistoryScreen;
