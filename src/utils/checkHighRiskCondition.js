import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default async function checkHighRiskCondition() {
  try {
    console.log("Checking high-risk condition...");

    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      console.log("❌ No auth token found. Exiting.");
      return;
    }

    // Step 1: Fetch recent scan results
    console.log("Fetching recent scan results...");
    let response;
    try {
      response = await fetch(`${apiUrl}/api/recent-scan`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (fetchError) {
      console.log("❌ Fetch request failed:", fetchError);
      return;
    }

    if (!response.ok) {
      console.log("❌ Failed to fetch scan results. Response not OK.");
      return;
    }

    const data = await response.json();
    console.log("✅ Scan results fetched:", data);

    const { results, timestamp, userId } = data;
    if (!results) {
      console.log("❌ No results found in scan data. Exiting.");
      return;
    }

    if (!userId) {
      console.log("❌ No userId found in scan data. Exiting.");
      return;
    }

    // Step 2: Fetch user email using userId
    console.log(`Fetching user email for userId: ${userId}...`);
    const userResponse = await fetch(`${apiUrl}/api/user/get-user-email/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      console.log("❌ Failed to fetch user email. Response not OK.");
      return;
    }

    const userData = await userResponse.json();
    console.log("✅ User email fetched:", userData);

    if (!userData.email) {
      console.log("❌ No email found for user. Exiting.");
      return;
    }

    const email = userData.email;

    // Prevent duplicate alerts
    const lastAlertTimestamp = await AsyncStorage.getItem("lastAlertTimestamp");
    if (lastAlertTimestamp === timestamp) {
      console.log("❌ Duplicate alert detected. Exiting.");
      return;
    }

    // Step 3: Check for high-risk condition
    console.log("Checking for high-risk condition...");
    const highRiskCondition = Object.entries(results).find(([disease, probability]) => probability > 0.5);

    if (!highRiskCondition) {
      console.log("✅ No high-risk condition detected. Exiting.");
      return;
    }

    const [disease, probability] = highRiskCondition;
    const message = `High probability (${(probability * 100).toFixed(2)}%) of ${disease}. Consult a doctor.`;
    console.log("🚨 High-risk condition found:", message);

    // Step 4: Send email via backend
    console.log(`Sending email to ${email}...`);
    const emailResponse = await fetch(`${apiUrl}/api/send-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        subject: "Health Alert 🚨",
        message,
      }),
    });

    if (!emailResponse.ok) {
      console.log("❌ Failed to send email. Response not OK.");
      return;
    }

    const emailData = await emailResponse.json();
    console.log("✅ Email sent successfully:", emailData);

    // Store timestamp to prevent duplicate alerts
    await AsyncStorage.setItem("lastAlertTimestamp", timestamp);
    console.log("✅ Alert timestamp stored.");
  } catch (error) {
    console.error("❌ Error checking high-risk condition:", error);
  }
}
