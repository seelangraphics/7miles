import React, { useState, useEffect } from "react";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/Firebase/Firebase";



import BottomNavigation from "./components/BottomNavigation/BottomNavigation";
import CategoriesScreen from "./components/Categories/CategoriesScreen";
import ProductDetailsScreen from "./components/ProductDetails/ProductDetailsScreen";
import CartScreen from "./components/CartScreen/CartScreen";
import OrderSuccessScreen from "./components/Success/OrderSuccessScreen";
import { CartProvider, useCart } from "./components/context/CartContext";
import AuthScreen from "./components/AuthScreen/Login";
import Toast from "react-native-toast-message";
import Address from "./components/Deliveryaddress/Address";
import Payment from "./components/Payment/Payment";
import { Youraddress } from "./components/Youraddress/Youraddress";
import TopBar from "./components/Topbar/Topbar";
import OrdersHistory from "./components/Yourorders/Yourorder";
import OrderProcessingScreen from "./components/Payment/Orderprocess";
// import { useCart } from "./components/context/CartContext";
import Ediblefoods from "./components/SevenMile/Ediblefoods";
import Oil from "./components/SevenMile/Oil";
import Powder from "./components/SevenMile/Powder";
import WishlistScreen from "./components/WishlistScreen/WishlistScreen";
import Herbalfacepack from "./components/HerbalFacePack/Herbalfacepack";
import Help from "./components/Help/Help";
import TermsOfService from "./components/AccountScreen/TermsOfService";
import RefundPolicy from "./components/AccountScreen/RefundPolicy";
import ShippingPolicy from "./components/AccountScreen/ShippingPolicy";
import { MainAccount, Profile } from "./components/AccountScreen/Profile";

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
                  onCartPress={() => navigation.navigate("Cart")}
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
            name="OrderProcessingScreen"
            component={OrderProcessingScreen}
            options={{ title: "order process", headerShown: false }}
          />
          <Stack.Screen
            name="Help"
            component={Help}

          />
          <Stack.Screen
            name="TermsOfService"
            component={TermsOfService}
            options={{ title: "Terms of Service ", headerShown: false }}
          />
          <Stack.Screen
            name="Privacypolicy"
            component={TermsOfService}
            options={{ title: "PrivacyPolicy", headerShown: false }}
          />
          <Stack.Screen
            name="ShippingPolicy"
            component={ShippingPolicy}
            options={{ title: "ShippingPolicy", headerShown: false }}
          />
          <Stack.Screen
            name="RefundPolicy"
            component={RefundPolicy}
            options={{ title: "RefundPolicy", headerShown: false }}
          />

          <Stack.Screen
            name="Wishlist"
            options={{
              header: ({ navigation, route }) => {
                // Get cart count from context or pass as prop


                return (
                  <TopBar
                    title="Wishlist"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                  />
                );
              },
            }}
          >
            {(props) => <WishlistScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen
            name="address"
            component={Youraddress}
            options={{ title: "Your Address", headerShown: true }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ title: "Profile", headerShown: true }}
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
            options={{
              header: ({ navigation }) => (
                <TopBar
                  title="Herbal Face Packs"
                  showBackButton
                  onBackPress={() => navigation.goBack()}
                  onCartPress={() => navigation.navigate("Cart")}
                />
              )
            }}
          />

          {/* <Stack.Screen
            name="oil"
            component={Oil}
            options={{ title: "Oil", headerShown: true }}
          /> */}
          <Stack.Screen
            name="herbalfacepack"
            component={Herbalfacepack}
            options={{
              header: ({ navigation }) => (
                <TopBar
                  title="Herbal Face Packs"
                  showBackButton
                  onBackPress={() => navigation.goBack()}
                  onCartPress={() => navigation.navigate("Cart")}
                />
              )
            }}
          />
          <Stack.Screen
            name="oil"
            options={{
              header: ({ navigation, route }) => {
                // Get cart count from context or pass as prop


                return (
                  <TopBar
                    title="Oil"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                  />
                );
              },
            }}
          >
            {(props) => <Oil {...props} />}
          </Stack.Screen>

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
