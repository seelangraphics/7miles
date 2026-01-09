import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from '@expo/vector-icons';
import { 
  auth, 
  db 
} from "../Firebase/Firebase";
import { 
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

export const Profile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editValue, setEditValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // "name", "email", "password", "delete"
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.reset({
                index: 0,
                routes: [{ name: "login" }],
              });
            } catch (error) {
              console.log("Logout error:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      setIsLoading(true);
      try {
        // Fetch from milesusers collection
        const userDocRef = doc(db, "milesusers", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserInfo({
            name: data.name || user.displayName || "",
            email: data.email || user.email || "",
            phone: data.phone || user.phoneNumber || "",
            role: data.role || "",
          });
        } else {
          // Use auth user info
          setUserInfo({
            name: user.displayName || "User",
            email: user.email || "",
            phone: user.phoneNumber || "",
            role: "Member",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Toast.show({
          type: "error",
          text1: "Failed to load profile",
          text2: error.message,
          position: "bottom",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (field, value) => {
    setEditValue(value);
    setModalType(field);
    setModalVisible(true);
  };

  const handleUpdateName = async () => {
    if (!editValue.trim()) {
      Toast.show({
        type: "error",
        text1: "Name cannot be empty",
        position: "bottom",
      });
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      // Update in milesusers collection
      const userDocRef = doc(db, "milesusers", user.uid);
      await updateDoc(userDocRef, {
        name: editValue.trim(),
        updatedAt: new Date(),
      });

      // Update local state
      setUserInfo(prev => ({ ...prev, name: editValue.trim() }));
      
      Toast.show({
        type: "success",
        text1: "Name updated successfully",
        position: "bottom",
      });
      
      setModalVisible(false);
      setEditValue("");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: error.message,
        position: "bottom",
      });
    }
  };

  const handleUpdateEmail = async () => {
    if (!editValue.trim() || !editValue.includes("@")) {
      Toast.show({
        type: "error",
        text1: "Please enter a valid email",
        position: "bottom",
      });
      return;
    }

    if (!currentPassword) {
      Toast.show({
        type: "error",
        text1: "Please enter current password",
        position: "bottom",
      });
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update email in Firebase Auth
      await updateEmail(user, editValue.trim());

      // Update in milesusers collection
      const userDocRef = doc(db, "milesusers", user.uid);
      await updateDoc(userDocRef, {
        email: editValue.trim(),
        updatedAt: new Date(),
      });

      // Update local state
      setUserInfo(prev => ({ ...prev, email: editValue.trim() }));
      
      Toast.show({
        type: "success",
        text1: "Email updated successfully",
        text2: "Please verify your new email",
        position: "bottom",
      });
      
      setModalVisible(false);
      setEditValue("");
      setCurrentPassword("");
    } catch (error) {
      console.error("Email update error:", error);
      let errorMessage = "Failed to update email";
      if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email already in use";
      }
      
      Toast.show({
        type: "error",
        text1: errorMessage,
        text2: error.message,
        position: "bottom",
      });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
        position: "bottom",
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password must be at least 6 characters",
        position: "bottom",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
        position: "bottom",
      });
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      
      Toast.show({
        type: "success",
        text1: "Password changed successfully",
        position: "bottom",
      });
      
      setModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);
      let errorMessage = "Failed to change password";
      if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect current password";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      }
      
      Toast.show({
        type: "error",
        text1: errorMessage,
        text2: error.message,
        position: "bottom",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentPassword) {
      Toast.show({
        type: "error",
        text1: "Please enter password to confirm",
        position: "bottom",
      });
      return;
    }

    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) throw new Error("No user logged in");

              // Re-authenticate user
              const credential = EmailAuthProvider.credential(user.email, currentPassword);
              await reauthenticateWithCredential(user, credential);

              // Delete from milesusers collection
              const userDocRef = doc(db, "milesusers", user.uid);
              await deleteDoc(userDocRef);

              // Delete user from Firebase Auth
              await deleteUser(user);
              
              Toast.show({
                type: "success",
                text1: "Account deleted successfully",
                position: "bottom",
              });
              
              navigation.replace("Login");
            } catch (error) {
              console.error("Delete account error:", error);
              let errorMessage = "Failed to delete account";
              if (error.code === "auth/wrong-password") {
                errorMessage = "Incorrect password";
              } else if (error.code === "auth/requires-recent-login") {
                errorMessage = "Please log in again and try";
              }
              
              Toast.show({
                type: "error",
                text1: errorMessage,
                text2: error.message,
                position: "bottom",
              });
            }
          }
        }
      ]
    );
  };



  const renderModalContent = () => {
    switch (modalType) {
      case "name":
        return (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: "#F3F4F6" }]}>
                <Ionicons name="person" size={28} color="#1F2937" />
              </View>
              <Text style={styles.modalTitle}>Edit Name</Text>
            </View>
            
            <TextInput
              style={styles.input}
              value={editValue}
              onChangeText={setEditValue}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditValue("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateName}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "email":
        return (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: "#F3F4F6" }]}>
                <Ionicons name="mail" size={28} color="#1F2937" />
              </View>
              <Text style={styles.modalTitle}>Change Email</Text>
            </View>
            
            <Text style={styles.modalSubtitle}>Enter your new email address</Text>
            
            <TextInput
              style={styles.input}
              value={editValue}
              onChangeText={setEditValue}
              placeholder="New email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
            />
            
            <Text style={styles.modalSubtitle}>Confirm with current password</Text>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styles.togglePassword}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditValue("");
                  setCurrentPassword("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateEmail}
              >
                <Text style={styles.saveButtonText}>Update Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "password":
        return (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: "#F3F4F6" }]}>
                <Ionicons name="lock-closed" size={28} color="#1F2937" />
              </View>
              <Text style={styles.modalTitle}>Change Password</Text>
            </View>
            
            <Text style={styles.modalSubtitle}>Enter your current password</Text>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styles.togglePassword}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>Enter new password</Text>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!passwordVisible}
              />
            </View>
            
            <Text style={styles.modalSubtitle}>Confirm new password</Text>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!passwordVisible}
              />
            </View>
            
            {/* <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity> */}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleChangePassword}
              >
                <Text style={styles.saveButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case "delete":
        return (
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconContainer, { backgroundColor: "#FEF2F2" }]}>
                <Ionicons name="warning" size={28} color="#DC2626" />
              </View>
              <Text style={[styles.modalTitle, { color: "#DC2626" }]}>Delete Account</Text>
            </View>
            
            <Text style={styles.deleteWarning}>
              This action cannot be undone. All your data, including orders, addresses, and preferences will be permanently deleted.
            </Text>
            
            <Text style={styles.modalSubtitle}>Enter password to confirm</Text>
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                style={styles.togglePassword}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setCurrentPassword("");
                }}
              >
                <Text style={styles.cancelButtonText}>Keep Account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.deleteButtonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderCard}>
          <ActivityIndicator size="large" color="#e7272b" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
 

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userInfo.name?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userInfo.name || "User Name"}</Text>
              <Text style={styles.userEmail}>{userInfo.email || "No email"}</Text>
       
            </View>
            
            {/* <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit("name", userInfo.name)}
            >
              <Ionicons name="create-outline" size={14} color="#6B7280" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity> */}
          </View>

 

          {/* Account Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleEdit("name", userInfo.name)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: "#F3F4F6" }]}>
                    <Ionicons name="person-outline" size={20} color="#1F2937" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>Name</Text>
                    <Text style={styles.menuSubtitle}>{userInfo.name || "Not set"}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleEdit("email", userInfo.email)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: "#F3F4F6" }]}>
                    <Ionicons name="mail-outline" size={20} color="#1F2937" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>Email</Text>
                    <Text style={styles.menuSubtitle}>{userInfo.email || "Not set"}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setModalType("password") || setModalVisible(true)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: "#F3F4F6" }]}>
                    <Ionicons name="lock-closed-outline" size={20} color="#1F2937" />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>Password</Text>
                    <Text style={styles.menuSubtitle}>••••••••</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              {userInfo.phone && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {}}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: "#F3F4F6" }]}>
                      <Ionicons name="call-outline" size={20} color="#1F2937" />
                    </View>
                    <View style={styles.menuTextContainer}>
                      <Text style={styles.menuTitle}>Phone Number</Text>
                      <Text style={styles.menuSubtitle}>{userInfo.phone}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Security Section */}
          <View style={styles.section}>
            {/* <Text style={styles.sectionTitle}>Security</Text> */}
            <View style={styles.sectionContent}>
                          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
            </View>
          </View>



       
        </ScrollView>

        {/* Edit Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalWrapper}
            >
              <View style={styles.modalContent}>
                {renderModalContent()}
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerRight: {
    width: 40,
  },
  // Loading Styles
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loaderCard: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  // Profile Card
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e7272b",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  memberText: {
    fontSize: 11,
    color: "#92400E",
    fontWeight: "700",
    marginLeft: 4,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  // Stats Container
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
  },
  // Section Styles
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  // App Info Card
  appInfoCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 20,
    padding: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  appLogo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appLogoText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  appName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  // Logout Button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  footerDivider: {
    fontSize: 13,
    color: "#D1D5DB",
    marginHorizontal: 12,
  },
  copyright: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 12,
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalWrapper: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    marginTop: 16,
    fontWeight: "600",
  },
  // Input Styles
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  togglePassword: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 1,
  },
  // Delete Warning
  deleteWarning: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    fontWeight: "500",
  },
  // Forgot Password
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#e7272b",
    fontSize: 14,
    fontWeight: "600",
  },
  // Modal Buttons
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelButtonText: {
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#e7272b",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default Profile;