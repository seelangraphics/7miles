// BottomNavigation.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../Firebase/Firebase";

import HomeScreen from "../HomeScreen/HomeScreen";
import CategoriesScreen from "../Categories/CategoriesScreen";

import AccountScreen from "../AccountScreen/AccountScreen";
import Hellp from "../Help/Hellp";
import OrdersHistory from "../Yourorders/Yourorder";

const Tab = createBottomTabNavigator();

export default function BottomNavigation({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
           height: 100,
  paddingBottom: 20,
     
          borderTopWidth: 1,
          borderTopColor: "#eee",
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

        tabBarIcon: ({ focused, color }) => {
          let iconName;

         if (route.name === "Home") {
  iconName = focused ? "home-sharp" : "home-outline";
}

if (route.name === "Categories") {
  iconName = focused ? "apps" : "apps-outline";
}

if (route.name === "Orders") {
  iconName = focused ? "bag-check" : "bag-check-outline";
}

if (route.name === "Help") {
  iconName = focused ? "headset" : "headset-outline";
}

if (route.name === "Account") {
  iconName = focused ? "person-circle" : "person-circle-outline";
}


          return <Ionicons name={iconName} size={22} color={color} />;
        },

        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#666",
      })}
    >

      {/* HOME SCREEN → HIDE HEADER */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      {/* CATEGORIES → TOPBAR WILL COME FROM STACK */}
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />

      {/* HELP → SHOW DEFAULT HEADER */}
      <Tab.Screen
        name="Help"
        component={Hellp}
        options={{
          headerShown: true,
          title: "Help & Support",
        }}
      />

      {/* ORDERS DEFAULT HEADER */}
      <Tab.Screen
        name="Orders"
        component={OrdersHistory}
        options={{
          headerShown: true,
          title: "Your Orders",
        }}
      />

      {/* ACCOUNT DEFAULT HEADER + LOGIN LOGIC */}
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          headerShown: true,
          title: "Account",
        }}
        listeners={() => ({
          tabPress: (e) => {
            const user = auth.currentUser;
            if (!user) {
              e.preventDefault();
              navigation.navigate("login");
            }
          },
        })}
      />

    </Tab.Navigator>
  );
}
