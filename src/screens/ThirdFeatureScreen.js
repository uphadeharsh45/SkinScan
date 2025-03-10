import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import skinCareTips from "../data/tips"; // Import the tips data

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

        const response = await fetch("http://192.168.180.182:5000/api/recent-scan", {
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const skinType = latestScan?.overallSkinHealth;
  const tips = skinCareTips[skinType] || null;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personalized Skincare Tips</Text>
      <Text style={styles.skinType}>Your Skin Type: {skinType || "Unknown"}</Text>

      {tips ? (
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.subheading}>💡 Skin Characteristics:</Text>
              <Text style={styles.description}>{tips.description}</Text>

              <Text style={styles.subheading}>🧴 Recommended Skincare Routine:</Text>
            </>
          }
          data={tips.skincareRoutine}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.listItem}>• {item}</Text>}
          ListFooterComponent={
            <>
              <Text style={styles.subheading}>✅ Best Ingredients for You:</Text>
              <Text style={styles.listItem}>{tips.bestIngredients.join(", ")}</Text>

              <Text style={styles.subheading}>🚫 Avoid These Ingredients:</Text>
              <Text style={styles.listItem}>{tips.avoidIngredients.join(", ")}</Text>

              <Text style={styles.subheading}>🥗 Diet & Lifestyle Tips:</Text>

              <FlatList
                data={tips.dietTips} // Adding this missing section
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.listItem}>• {item}</Text>}
              />
            </>
          }
          nestedScrollEnabled
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.errorText}>No specific tips available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  heading: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subheading: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  skinType: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  description: { fontSize: 14, marginBottom: 10 },
  listItem: { fontSize: 14, marginVertical: 5, paddingLeft: 10 },
  errorText: { fontSize: 14, color: "red", textAlign: "center", marginTop: 10 },
});

export default ThirdFeatureScreen;
