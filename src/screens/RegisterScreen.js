import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Feather } from "@expo/vector-icons";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need access to your gallery to select an image.");
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(`data:image/jpg;base64,${result.assets[0].base64}`);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !image) {
      Alert.alert("Error", "Please fill in all fields and select a photo.");
      return;
    }

    const userData = {
      name,
      email,
      password,
      age: Number(age),
      image,
    };

    try {
      const response = await fetch(`${apiUrl}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Registration Successful!", "You can now log in.");
        navigation.navigate("Login");
      } else {
        Alert.alert("Registration Failed", data.message || "Try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <LinearGradient colors={["#1E3C72", "#2A5298"]} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.heading}>Create Account</Text>

        <View style={styles.formContainer}>
          {/* Name Field */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={22} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#777"
            />
          </View>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={22} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#777"
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={22} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#777"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={22} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Age Field */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="calendar-today" size={22} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholderTextColor="#777"
            />
          </View>

          {/* Profile Image Selection */}
          <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
            <MaterialIcons name="image" size={24} color="#fff" />
            <Text style={styles.imagePickerText}>Select Photo</Text>
          </TouchableOpacity>

          {/* Image Preview */}
          {image && (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          )}

          {/* Register Button */}
          <TouchableOpacity onPress={handleRegister} style={styles.button}>
            <LinearGradient colors={["#007BFF", "#0056b3"]} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Register</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 25,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  button: {
    marginTop: 15,
    borderRadius: 8,
  },
  buttonGradient: {
    width: 150,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  loginText: {
    marginTop: 15,
    fontSize: 16,
    color: "#007BFF",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default RegisterScreen;
