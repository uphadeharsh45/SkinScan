import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ThirdFeatureScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Third Feature</Text>
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

export default ThirdFeatureScreen;
