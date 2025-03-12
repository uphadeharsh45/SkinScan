import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const RecentScanScreen = () => {
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecentScan = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          setError("User not authenticated.");
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

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch recent scan.");
        }

        setScanData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentScan();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Fetching latest scan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={24} color="red" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent Scan Results</Text>
      {scanData ? (
        <View style={styles.card}>
          <Text style={styles.resultText}>
            <Ionicons name="heart-circle" size={22} color="#28a745" />
            <Text style={styles.boldText}> Overall Skin Health: </Text>{scanData.overallSkinHealth}
          </Text>
          <Text style={styles.boldText}>Detection Results:</Text>
          {Object.entries(scanData.results).map(([condition, probability]) => (
            <Text key={condition} style={styles.resultText}>
              <Ionicons name="checkmark-circle" size={18} color="#007BFF" /> {condition}: {(probability * 100).toFixed(2)}%
            </Text>
          ))}
          <Text style={styles.timestamp}>
            <Ionicons name="time" size={18} color="gray" /> Scanned on: {new Date(scanData.timestamp).toLocaleString()}
          </Text>
        </View>
      ) : (
        <Text style={styles.noScanText}>No recent scans found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  timestamp: {
    marginTop: 10,
    fontStyle: "italic",
    color: "gray",
  },
  noScanText: {
    fontSize: 16,
    color: "gray",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
});

export default RecentScanScreen;
