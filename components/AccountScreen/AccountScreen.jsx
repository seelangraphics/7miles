import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  ScrollView,
  Alert,
  Linking,
  Image
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import Constants from 'expo-constants';

const Account = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const LOGO_URL = Constants.expoConfig.extra?.LOGO_URL || "https://s3.eu-north-1.amazonaws.com/www.seelangraphics.com/projects/sevenMiles/assets/Nav/7_miles_final_logo_PRINT_FILE-Photoroom.png";

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
    try {
      await Share.share({
        message: "Check out 7miles - Your premium shopping destination! 🛍️✨",
        title: "Share 7miles App",
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "How would you like to contact us?",
      [
        {
          text: "Call Us",
          onPress: () => Linking.openURL("tel:+1234567890"),
        },
        {
          text: "Email",
          onPress: () => Linking.openURL("mailto:support@7miles.com"),
        },
        {
          text: "WhatsApp",
          onPress: () =>
            Linking.openURL("https://wa.me/1234567890?text=Hello%207miles"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <View style={styles.loaderCard}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </View>
    );
  }

  if (!userData) return null;

  const firstLetter = userData.name?.charAt(0).toUpperCase();
  const memberSince = userData.createdAt
    ? new Date(userData.createdAt.toDate()).getFullYear()
    : "2024";

  const MenuSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    color = "#1F2937",
    iconComponent = "Ionicons",
    showChevron = true 
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          {iconComponent === "MaterialCommunityIcons" ? (
            <MaterialCommunityIcons name={icon} size={20} color={color} />
          ) : iconComponent === "Feather" ? (
            <Feather name={icon} size={20} color={color} />
          ) : (
            <Ionicons name={icon} size={20} color={color} />
          )}
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </View>
          <View style={styles.verifyBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          </View>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
      
        </View>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="create-outline" size={18} color="#6B7280" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>


      {/* Account Section */}
      <MenuSection title="Account">
        <MenuItem
          icon="person-outline"
          title="Personal Information"
          subtitle="Update your name, email & phone"
          onPress={() => navigation.navigate("Profile")}
          color="#e7272b"
        />
        <MenuItem
          icon="location-outline"
          title="Saved Addresses"
          subtitle="Manage your delivery addresses"
          onPress={() => navigation.navigate("address")}
          color="#e7272b"
        />
     
      </MenuSection>

      {/* Orders Section */}
      <MenuSection title="Orders">
        <MenuItem
          icon="bag-outline"
          title="Your Orders"
          subtitle="Track, return or buy again"
          onPress={() => navigation.navigate("Orders")}
          color="#e7272b"
        />
      
     
      </MenuSection>

      {/* Support Section */}
      <MenuSection title="Support & Information">
        <MenuItem
          icon="help-circle-outline"
          title="Help Center"
          subtitle="FAQs & guides"
          onPress={() => navigation.navigate("Help")}
          color="#e7272b"
        />
      
        <MenuItem
          icon="share-social-outline"
          title="Share App"
          subtitle="Invite friends & earn rewards"
          onPress={handleShare}
          color="#e7272b"
        />
      </MenuSection>

      {/* Legal Section */}
      <MenuSection title="Legal">
        <MenuItem
          icon="document-text-outline"
          title="Terms of Service"
          onPress={() => navigation.navigate("TermsOfService")}
          color="#e7272b"
        />
        <MenuItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={() => navigation.navigate("Privacypolicy")}
          color="#e7272b"
        />
        <MenuItem
          icon="arrow-undo-outline"
          title="Refund Policy"
          onPress={() => navigation.navigate("RefundPolicy")}
          color="#e7272b"
        />
        <MenuItem
          icon="cube-outline"
          title="Shipping Policy"
          onPress={() => navigation.navigate("ShippingPolicy")}
          color="#e7272b"
        />
    
      </MenuSection>

      {/* App Info */}
      <View style={styles.appInfoCard}>
                  <View style={styles.appLogo}>
                    <Image
                        source={{ uri: LOGO_URL }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
        {/* <Text style={styles.appName}>7miles</Text> */}
        <Text style={styles.appVersion}>Version 1.0</Text>
        <Text style={styles.appTagline}>Premium Shopping Experience</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer Links */}
      <View style={styles.footer}>
      
       
        <Text style={styles.copyright}>© 2026 7miles. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  logo: {
        width: 90,
        height: 50,
    },

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
  verifyBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 2,
    elevation: 2,
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
});