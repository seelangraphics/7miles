import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { Alert } from "react-native";



const Account = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "login" }],
        });
        return;
      }

      try {
        const docRef = doc(db, "milesusers", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.log("Firestore fetch error:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
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








  const handleShare = async () => {
    await Share.share({
      message: "Check out this amazing app 🚀 Download now!",
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!userData) return null;

  const firstLetter = userData.name?.charAt(0).toUpperCase();

  const MenuItem = ({ icon, title, onPress, color }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={color || "#374151"} />
      <Text style={[styles.menuText, color && { color }]}>{title}</Text>
      <Ionicons
        name="chevron-forward"
        size={20}
        color="#9CA3AF"
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ===== PROFILE HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
          <Text style={styles.phone}>{userData.phone}</Text>
        </View>
      </View>

      {/* ===== MENU ===== */}
      <View style={styles.menu}>
        <MenuItem
          icon="person-outline"
          title="Account"
          onPress={() => navigation.navigate("Profile")}
        />

        <MenuItem
          icon="location-outline"
          title="Your Address"
          onPress={() => navigation.navigate("address")}
        />

        <MenuItem
          icon="bag-outline"
          title="Your Orders"
          onPress={() => navigation.navigate("Orders")}
        />

        <MenuItem
          icon="share-social-outline"
          title="Share App"
          onPress={handleShare}
        />

        <MenuItem
          icon="help-circle-outline"
          title="Help"
          onPress={() => navigation.navigate("Help")}
        />

        <MenuItem
          icon="log-out-outline"
          title="Logout"
          color="red"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  userInfo: {
    marginLeft: 15,
  },

  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  phone: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 10,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },

  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#111827",
    fontWeight: "500",
  },
});
