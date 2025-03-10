import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

        const response = await fetch("http://192.168.180.182:5000/api/recent-scan", {
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent Scan Results</Text>
      {scanData ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            <Text style={styles.boldText}>Overall Skin Health:</Text> {scanData.overallSkinHealth}
          </Text>
          <Text style={styles.boldText}>Detection Results:</Text>
          {Object.entries(scanData.results).map(([condition, probability]) => (
            <Text key={condition} style={styles.resultText}>
              {condition}: {(probability * 100).toFixed(2)}%
            </Text>
          ))}
          <Text style={styles.timestamp}>Scanned on: {new Date(scanData.timestamp).toLocaleString()}</Text>
        </View>
      ) : (
        <Text style={styles.resultText}>No recent scans found.</Text>
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
  resultContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    elevation: 3,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  timestamp: {
    marginTop: 10,
    fontStyle: "italic",
    color: "gray",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default RecentScanScreen;
