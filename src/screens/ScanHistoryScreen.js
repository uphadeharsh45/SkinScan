import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const ScanHistoryScreen = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          setLoading(false);
          return;
        }

        const response = await fetch(`${apiUrl}/api/all-scans`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setScans(data);
        } else {
          console.error("Error fetching scan history:", data.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Scan History</Text>
      {scans.length === 0 ? (
        <Text style={styles.noData}>No scan history available.</Text>
      ) : (
        <FlatList
          data={scans}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.scanCard}>
              <View style={styles.row}>
                <Ionicons name="calendar" size={18} color="#007BFF" />
                <Text style={styles.date}>{new Date(item.timestamp).toLocaleString()}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="heart" size={18} color="#FF6347" />
                <Text style={styles.health}>Overall Skin Health: {item.overallSkinHealth}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="list" size={18} color="#555" />
                <Text style={styles.results}>Results:</Text>
              </View>
              {Object.entries(item.results).map(([condition, probability]) => (
                <Text key={condition} style={styles.resultText}>
                  {condition}: {(probability * 100).toFixed(2)}%
                </Text>
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  scanCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
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
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  health: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  results: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  resultText: {
    fontSize: 14,
    marginLeft: 10,
    color: "#666",
  },
});

export default ScanHistoryScreen;