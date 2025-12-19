import React, { useState, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/Firebase/Firebase";

// ✅ Your existing components

import BottomNavigation from "./components/BottomNavigation/BottomNavigation";
import CategoriesScreen from "./components/Categories/CategoriesScreen";
import ProductDetailsScreen from "./components/ProductDetails/ProductDetailsScreen";
import CartScreen from "./components/CartScreen/CartScreen";
import OrderSuccessScreen from "./components/Success/OrderSuccessScreen";
import { CartProvider } from "./components/context/CartContext";
import AuthScreen from "./components/AuthScreen/Login";
import Toast from "react-native-toast-message";
import Address from "./components/Deliveryaddress/Address";
import Payment from "./components/Payment/Payment";
import { Youraddress } from "./components/Youraddress/Youraddress";
import TopBar from "./components/Topbar/Topbar";
import OrdersHistory from "./components/Yourorders/Yourorder";
// import { useCart } from "./components/context/CartContext";
import Ediblefoods from "./components/SevenMile/Ediblefoods";
import Oil from "./components/SevenMile/Oil";
import Powder from "./components/SevenMile/Powder";

const Stack = createNativeStackNavigator();

function AppContent() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>

          {/* Bottom Tabs */}
          <Stack.Screen
            name="MainTabs"
            component={BottomNavigation}
            options={{ headerShown: false }}
          />

          {/* Login */}
          <Stack.Screen
            name="login"
            component={AuthScreen}
            options={{ headerShown: false }}
          />

          {/* Categories TopBar */}
          <Stack.Screen
            name="Categories"
            options={{
              header: ({ navigation }) => (
                <TopBar
                  title="Categories"
                  onBackPress={() => navigation.goBack()}
                />
              ),
            }}
          >
            {(props) => <CategoriesScreen {...props} />}
          </Stack.Screen>

          <Stack.Screen
            name="ProductDetails"
            options={{
              header: ({ navigation, route }) => {
                // Get cart count from context or pass as prop


                return (
                  <TopBar
                    title="Product Details"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                  />
                );
              },
            }}
          >
            {(props) => <ProductDetailsScreen {...props} />}
          </Stack.Screen>

          {/* Cart */}
          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{ title: "Cart", headerShown: true }}
          />

          {/* Delivery */}
          <Stack.Screen
            name="delivery"
            component={Address}
            options={{ title: "Delivery Address", headerShown: true }}
          />
          <Stack.Screen
            name="address"
            component={Youraddress}
            options={{ title: "Your Address", headerShown: true }}
          />
          {/* My Orders */}
          <Stack.Screen
            name="orders"
            component={OrdersHistory}
            options={{ title: "Your Orders", headerShown: true }}
          />

          {/* Payment */}
          <Stack.Screen
            name="payment"
            component={Payment}
            options={{ title: "Payment", headerShown: true }}
          />
          <Stack.Screen
            name="ediblefoods"
            component={Ediblefoods}
            options={{ title: "ediblefoods", headerShown: true }}
          />
          <Stack.Screen
            name="oil"
            component={Oil}
            options={{ title: "Oil", headerShown: true }}
          />

          <Stack.Screen
            name="powder"
            options={{
              header: ({ navigation, route }) => {
                // Get cart count from context or pass as prop


                return (
                  <TopBar
                    title="Powder"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                  />
                );
              },
            }}
          >
            {(props) => <Powder {...props} />}
          </Stack.Screen>

          {/* Checkout */}
          <Stack.Screen
            name="OrderSuccess"
            component={OrderSuccessScreen}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      </NavigationContainer>

      <Toast />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
