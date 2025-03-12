import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";


const apiUrl = process.env.EXPO_PUBLIC_API_URL;


export default async function checkHighRiskCondition() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) return;

    const response = await fetch(`${apiUrl}/api/recent-scan`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) return;

    const { results, timestamp } = data;
    if (!results) return;

    // Prevent duplicate alerts
    const lastAlertTimestamp = await AsyncStorage.getItem("lastAlertTimestamp");
    if (lastAlertTimestamp === timestamp) return;

    // Check if any disease has a probability > 50%
    const highRiskCondition = Object.entries(results).find(([disease, probability]) => probability > 0.5);

    if (highRiskCondition) {
      const [disease, probability] = highRiskCondition;
      const message = `⚠️ High probability (${(probability * 100).toFixed(2)}%) of ${disease}. Consult a doctor.`;

      // Send a push notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Health Alert 🚨",
          body: message,
          sound: "default",
        },
        trigger: null, // Send immediately
      });

      // Store timestamp to prevent duplicate alerts
      await AsyncStorage.setItem("lastAlertTimestamp", timestamp);
    }
  } catch (error) {
    console.error("Error checking high-risk condition:", error);
  }
}
