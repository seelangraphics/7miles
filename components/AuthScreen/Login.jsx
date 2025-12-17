// src/Component/Login/AuthScreen.jsx
import React, { useState ,useEffect} from "react";
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
  collection,
  query,
  where,
  getDocs,
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


  const navigateToCart = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Cart" }],
      })
    );
  };




const handleSignup = async () => {
  // ---------- VALIDATION ----------
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

    // ---------- CREATE AUTH USER ----------
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const user = userCredential.user;

    // ---------- SAVE USER DATA ----------
    await setDoc(doc(db, "milesusers", user.uid), {
      name: name.trim(),
      email: user.email,
      phone: phone.trim(),
      createdAt: serverTimestamp(),
    });

    // ---------- SUCCESS ----------
    Toast.show({
      type: "success",
      text1: "Signup Successful 🎉",
      text2: `Welcome, ${name}!`,
    });

    // ---------- NAVIGATION ----------
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Cart" }],
      })
    );
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







  // ✅ Login

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

    // 🔥 If Firestore doc missing, CREATE it
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

    navigateToCart();
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






return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <StatusBar barStyle="light-content" />

    <LinearGradient
      colors={["#0EA5E9", "#1E40AF", "#3730A3"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Animated Background Elements */}
      <View style={styles.backgroundBubbles}>
        <View style={[styles.bubble, styles.bubble1]} />
        <View style={[styles.bubble, styles.bubble2]} />
        <View style={[styles.bubble, styles.bubble3]} />
      </View>

      {/* Top Logo Section */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            {/* <Image
              source={require("../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            /> */}
          </View>
          <Text style={styles.appName}>Welcome</Text>
          <Text style={styles.appTagline}>
            {mode === "signup" ? "Create your account" : "Sign in to your account"}
          </Text>
        </View>
      </View>

      {/* Modern Card Design */}
      <View style={styles.bottomSection}>
        <View style={styles.curve} />
        <View style={styles.cardContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              {/* Header with Icon */}
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>
                    {mode === "signup" ? "👤" : "🔐"}
                  </Text>
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

                  <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>
                      Already have an account?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => setMode("login")}>
                      <Text style={styles.link}>Sign In</Text>
                    </TouchableOpacity>
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
                        color={rememberMe ? "#0EA5E9" : undefined}
                      />
                      <Text style={styles.rememberMeText}>Remember me</Text>
                    </View>
                    <TouchableOpacity>
                      <Text style={styles.forgotPassword}>
                        Forgot password?
                      </Text>
                    </TouchableOpacity>
                  </View>

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
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  </KeyboardAvoidingView>
);

}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradient: {
    flex: 1
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  appTagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  curve: {
    height: 40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 30,
    borderRadius: 30,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    marginTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    backgroundColor: '#F0F9FF',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#0EA5E9",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 18,
    borderRadius: 15,
    color: "#111",
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
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
  rememberMeText: {
    color: "#64748B",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  forgotPassword: {
    color: "#0EA5E9",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: "#0EA5E9",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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
    opacity: 0.7
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#64748B',
    fontSize: 14,
    marginHorizontal: 15,
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  socialIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#64748B',
  },
  socialText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  switchText: {
    color: "#64748B",
    fontSize: 15,
    fontWeight: '500',
  },
  link: {
    color: "#0EA5E9",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default AuthScreen
