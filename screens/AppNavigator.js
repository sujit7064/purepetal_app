import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
// Screens
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";
import CartScreen from "./CartScreen";
import ProfileScreen from "./ProfileScreen";
import ProductScreen from "./ProductScreen";
import ProductDetailScreen from "./ProductDetailScreen";
import CheckoutScreen from "./CheckoutScreen";
import RazorpayWebView from "./RazorpayWebView";
import OrderHistory from "./OrderHistory";
import PendingOrders from "./PendingOrders";
import { navigationRef } from "../Navigationservice";
import AllAddressesScreen from "./AllAddressesScreen";
import AboutUsScreen from "./AboutUsScreen";
import PrivacyPolicyScreen from "./PrivacyPolicyScreen";
import ContactUsScreen from "./ContactUsScreen";
import { useGetUser } from "../contextApi/UserContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainApp() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Cart") {
              iconName = focused ? "cart" : "cart-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Product") {
              iconName = focused ? "basket" : "basket-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#2ecc71",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Product" component={ProductScreen} />
        <Tab.Screen name="Cart" component={CartScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  }
function AppNavigator() {
    const { user,loading } = useGetUser();
    if (loading) {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#2ecc71" />
          </View>
        );
      }
    
    return (
      <NavigationContainer ref={navigationRef}>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          
        {user ? (
          <>
            <Stack.Screen name="MainApp" component={MainApp} />
            <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
            <Stack.Screen name="RazorpayWebView" component={RazorpayWebView} />
            <Stack.Screen name="OrderHistory" component={OrderHistory} />
            <Stack.Screen name="PendingOrders" component={PendingOrders} />
            <Stack.Screen name="ProductScreen" component={ProductScreen} />
            <Stack.Screen name="AllAddressesScreen" component={AllAddressesScreen} />
            <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
            <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
            <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  export default AppNavigator;