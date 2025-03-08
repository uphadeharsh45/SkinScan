import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RecentScanScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent Scan Results</Text>
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

export default RecentScanScreen;
