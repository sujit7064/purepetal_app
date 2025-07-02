import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { UserProvider } from "./contextApi/UserContext";
// Screens
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProductScreen from "./screens/ProductScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import RazorpayWebView from "./screens/RazorpayWebView";
import OrderHistory from "./screens/OrderHistory";
import PendingOrders from "./screens/PendingOrders";
import { navigationRef } from "./Navigationservice";
import AllAddressesScreen from "./screens/AllAddressesScreen";
import AboutUsScreen from "./screens/AboutUsScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import ContactUsScreen from "./screens/ContactUsScreen";
import { useGetUser } from "./contextApi/UserContext";
import AppNavigator from "./screens/AppNavigator";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

export default function App() {

  return (
    <UserProvider>
       <AppNavigator/>
    </UserProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
