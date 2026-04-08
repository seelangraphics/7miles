// src/Component/Login/AuthScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { useNavigation, CommonActions } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../Firebase/Firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

const Checkbox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity
      style={[styles.checkbox, value && styles.checkboxChecked]}
      onPress={() => onValueChange(!value)}
    >
      {value && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );
};

const AuthScreen = () => {
  const navigation = useNavigation();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setRememberMe(false);
  }, [mode]);

  const navigateToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "MainTabs" }], // Changed from "Cart" to "Home"
      })
    );
  };

  const handleSignup = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      return Toast.show({
        type: "error",
        text1: "All fields required",
        text2: "Please fill in every detail",
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return Toast.show({
        type: "error",
        text1: "Invalid Email",
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return Toast.show({
        type: "error",
        text1: "Invalid Phone Number",
        text2: "Enter a valid 10-digit number",
      });
    }

    if (password.length < 6) {
      return Toast.show({
        type: "error",
        text1: "Weak Password",
        text2: "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return Toast.show({
        type: "error",
        text1: "Password Mismatch",
        text2: "Both passwords should match",
      });
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "milesusers", user.uid), {
        name: name.trim(),
        email: user.email,
        phone: phone.trim(),
        createdAt: serverTimestamp(),
      });

      Toast.show({
        type: "success",
        text1: "Signup Successful 🎉",
        text2: `Welcome, ${name}!`,
      });

      navigateToHome(); // Changed to navigate to home
    } catch (error) {
      console.error("Signup Error:", error);
      let message = "Something went wrong";

      if (error.code === "auth/email-already-in-use") {
        message = "Email already registered. Please login.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      }

      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please enter email and password",
      });
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;
      const userRef = doc(db, "milesusers", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          createdAt: serverTimestamp(),
        });
      }

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back!`,
      });

      navigateToHome(); // Changed to navigate to home
    } catch (err) {
      console.error("Login Error:", err);
      let msg = "Invalid credentials";
      if (err.code === "auth/user-not-found")
        msg = "No account found. Please signup.";
      if (err.code === "auth/wrong-password")
        msg = "Incorrect password. Try again.";

      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkipLogin = () => {
    Toast.show({
      type: "info",
      text1: "Skipped Login",
      text2: "You can login later from profile",
    });
    navigateToHome();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f3eeea" />

      <LinearGradient
        colors={["#f3eeea", "#f3eeea", "#f3eeea"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Elements */}
        <View style={styles.backgroundBubbles}>
          <View style={[styles.bubble, styles.bubble1]} />
          <View style={[styles.bubble, styles.bubble2]} />
          <View style={[styles.bubble, styles.bubble3]} />
        </View>

        {/* Top Logo Section */}
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.appName}>Welcome to 7 Miles</Text>
            <Text style={styles.appTagline}>
              {mode === "signup" ? "Create your account" : "Sign in to your account"}
            </Text>
          </View>
        </View>

        {/* Modern Card Design */}
        <View style={styles.bottomSection}>
          <View style={styles.cardContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.scrollView}
            >
              <View style={styles.card}>
                {/* Header with Icon */}
                <View style={styles.header}>
                  <View style={styles.iconContainer}>
                    <View style={styles.logoBackground}>
                      <Image
                        source={{ uri: "https://s3.ap-south-1.amazonaws.com/www.7miles.co.in/assets/Nav/7_miles_final_logo_PRINT_FILE-Photoroom.png" }}
                        style={styles.logoImage}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                  <Text style={styles.title}>
                    {mode === "signup" ? "Create Account" : "Welcome Back"}
                  </Text>
                  <Text style={styles.subtitle}>
                    {mode === "signup"
                      ? "Please fill in your details to continue"
                      : "Enter your credentials to continue"
                    }
                  </Text>
                </View>

                {mode === "signup" ? (
                  // Modern Signup Form
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Email Address</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email address"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Phone Number</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your phone number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Confirm Password</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm your password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    {/* Fixed Bottom Button Container for Signup */}
                    <View style={styles.bottomButtonContainer}>
                      <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={loading}
                      >
                        {loading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <>
                            <Text style={styles.buttonText}>Create Account</Text>
                            <Text style={styles.buttonIcon}>→</Text>
                          </>
                        )}
                      </TouchableOpacity>

                      {/* Skip Login Button - Added for signup */}
                      <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkipLogin}
                      >
                        <Text style={styles.skipButtonText}>Skip for now</Text>
                      </TouchableOpacity>

                      <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>
                          Already have an account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => setMode("login")}>
                          <Text style={styles.link}>Sign In</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                ) : (
                  // Modern Login Form
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#94A3B8"
                      />
                    </View>

                    <View style={styles.loginOptions}>
                      <View style={styles.rememberMeContainer}>
                        <Checkbox
                          value={rememberMe}
                          onValueChange={setRememberMe}
                          color={rememberMe ? "#d6433c" : undefined}
                        />
                        <Text style={styles.rememberMeText}>Remember me</Text>
                      </View>
                      <TouchableOpacity>
                        <Text style={styles.forgotPassword}>
                          Forgot password?
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Fixed Bottom Button Container for Login */}
                    <View style={styles.bottomButtonContainer}>
                      <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                      >
                        {loading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <>
                            <Text style={styles.buttonText}>Sign In</Text>
                            <Text style={styles.buttonIcon}>→</Text>
                          </>
                        )}
                      </TouchableOpacity>

                      {/* Skip Login Button - Added for login */}
                      <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkipLogin}
                      >
                        <Text style={styles.skipButtonText}>Skip Login</Text>
                      </TouchableOpacity>

                      <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.dividerLine} />
                      </View>

                      <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>
                          Don't have an account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => setMode("signup")}>
                          <Text style={styles.link}>Sign Up</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
              </View>
              
              {/* Extra padding at bottom for better mobile touch */}
              <View style={styles.bottomPadding} />
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  backgroundBubbles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(214, 67, 60, 0.05)',
  },
  bubble1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  bubble2: {
    width: 150,
    height: 150,
    bottom: '30%',
    left: -50,
  },
  bubble3: {
    width: 100,
    height: 100,
    bottom: '40%',
    right: 50,
  },
  topSection: {
    height: '28%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  logoContainer: {
    alignItems: "center",
    width: '100%',
  },
  logoBackground: {
    borderRadius: 20,
    marginBottom: 15,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appTagline: {
    fontSize: 15,
    color: "#666",
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#f3eeea',
  },
  scrollView: {
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 30,
    minHeight: '100%',
  },
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 25,
    borderRadius: 25,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  icon: {
    fontSize: 22,
    color: "#d6433c",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    color: "#000",
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "#eee",
    fontWeight: '500',
  },
  loginOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 5,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#d6433c',
    borderColor: '#d6433c',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rememberMeText: {
    color: "#666",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  forgotPassword: {
    color: "#d6433c",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomButtonContainer: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: 20,
  },
  button: {
    backgroundColor: "#d6433c",
    paddingVertical: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10, // Reduced margin for skip button
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: "#d6433c",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  // New Skip Button Styles
  skipButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: '#d6433c',
  },
  skipButtonText: {
    color: "#d6433c",
    fontWeight: "bold",
    fontSize: 15,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#888',
    fontSize: 14,
    marginHorizontal: 15,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  switchText: {
    color: "#666",
    fontSize: 15,
    fontWeight: '500',
  },
  link: {
    color: "#d6433c",
    fontWeight: "bold",
    fontSize: 15,
  },
  bottomPadding: {
    height: 30,
  },
});

export default AuthScreen;