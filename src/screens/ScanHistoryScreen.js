import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

        const response = await fetch("http://192.168.180.182:5000/api/all-scans", {
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
        <ActivityIndicator size="large" color="#0000ff" />
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
            <View style={styles.scanItem}>
              <Text style={styles.date}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
              <Text style={styles.health}>Overall Skin Health: {item.overallSkinHealth}</Text>
              <Text style={styles.results}>Results:</Text>
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
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  scanItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  health: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  results: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default ScanHistoryScreen;
