import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const DashboardScreen = ({ onLogout }) => {
  const navigation = useNavigation();
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

  const features = [
    { name: "View Scan History", icon: "time", color: "#FF6347", screen: "ScanHistory" },
    { name: "Personalized Skin Tips", icon: "leaf", color: "#32CD32", screen: "ThirdFeature" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>

      {/* Recent Scan Results */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="heart" size={22} color="#FF6347" />
          <Text style={styles.cardTitle}>Recent Scan</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : scanData ? (
          <View>
            <Text style={styles.resultText}><Text style={styles.boldText}>Skin Health:</Text> {scanData.overallSkinHealth}</Text>
            {Object.entries(scanData.results).map(([condition, probability]) => (
              <Text key={condition} style={styles.resultText}>{condition}: {(probability * 100).toFixed(2)}%</Text>
            ))}
            <View style={styles.row}>
              <Ionicons name="calendar" size={18} color="#007BFF" />
              <Text style={styles.timestamp}>Scanned on: {new Date(scanData.timestamp).toLocaleString()}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.resultText}>No recent scans found.</Text>
        )}
      </View>

      {/* Feature Cards */}
      {features.map((feature, index) => (
        <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate(feature.screen)}>
          <View style={styles.row}>
            <Ionicons name={feature.icon} size={22} color={feature.color} />
            <Text style={styles.cardText}>{feature.name}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Logout Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={onLogout}>
        <Ionicons name="log-out" size={24} color="#fff" />
      </TouchableOpacity>
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
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    marginVertical: 10,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  boldText: {
    fontWeight: "bold",
  },
  timestamp: {
    fontStyle: "italic",
    color: "gray",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "red",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default DashboardScreen;
