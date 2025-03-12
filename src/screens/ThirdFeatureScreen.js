import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import skinCareTips from "../data/tips";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const ThirdFeatureScreen = () => {
  const [latestScan, setLatestScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentScan = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          setLoading(false);
          return;
        }

        const response = await fetch(`${apiUrl}/api/recent-scan`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setLatestScan(data);
        } else {
          console.error("Error fetching latest scan:", data.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentScan();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  const skinType = latestScan?.overallSkinHealth;
  const tips = skinCareTips[skinType] || null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personalized Skincare Tips</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="person" size={18} color="#007BFF" />
          <Text style={styles.skinType}>Your Skin Type: {skinType || "Unknown"}</Text>
        </View>

        {tips ? (
          <>
            <View style={styles.row}>
              <Ionicons name="bulb" size={18} color="#FFA500" />
              <Text style={styles.subheading}>Skin Characteristics:</Text>
            </View>
            <Text style={styles.description}>{tips.description}</Text>

            <View style={styles.row}>
              <Ionicons name="flask" size={18} color="#32CD32" />
              <Text style={styles.subheading}>Recommended Skincare Routine:</Text>
            </View>
            <FlatList
              data={tips.skincareRoutine}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.listItem}>• {item}</Text>}
            />

            <View style={styles.row}>
              <Ionicons name="checkmark-circle" size={18} color="#28A745" />
              <Text style={styles.subheading}>Best Ingredients for You:</Text>
            </View>
            <Text style={styles.listItem}>{tips.bestIngredients.join(", ")}</Text>

            <View style={styles.row}>
              <Ionicons name="close-circle" size={18} color="#DC3545" />
              <Text style={styles.subheading}>Avoid These Ingredients:</Text>
            </View>
            <Text style={styles.listItem}>{tips.avoidIngredients.join(", ")}</Text>

            <View style={styles.row}>
              <Ionicons name="nutrition" size={18} color="#FFD700" />
              <Text style={styles.subheading}>Diet & Lifestyle Tips:</Text>
            </View>
            <FlatList
              data={tips.dietTips}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.listItem}>• {item}</Text>}
            />
          </>
        ) : (
          <Text style={styles.errorText}>No specific tips available.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5", alignItems: "center" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#333" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },
  skinType: { fontSize: 16, fontWeight: "bold", color: "#007BFF" },
  subheading: { fontSize: 16, fontWeight: "bold", color: "#555" },
  description: { fontSize: 14, marginBottom: 10, color: "#333" },
  listItem: { fontSize: 14, marginVertical: 5, paddingLeft: 10, color: "#666" },
  errorText: { fontSize: 14, color: "red", textAlign: "center", marginTop: 10 },
});

export default ThirdFeatureScreen;
