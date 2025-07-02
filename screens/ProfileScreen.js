import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useGetUser } from "../contextApi/UserContext";
import { profiledetails } from "../env/action";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MenuItem = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#666" />
    <View style={styles.menuItemText}>
      <Text style={styles.menuItemTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={24} color="#666" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useGetUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.user_id) {
      profiledetails({ user_id: user.user_id }, (res) => {
        if (res?.status === 1) {
          setProfile(res.data);
        }
      });
    }
  }, [user]);

  const handleLogout = async() => {
    // Optional: Clear any stored tokens or user info here

    // Reset user context
    await AsyncStorage.clear();
    setUser(null);

    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.number}>{profile?.phone_number}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>
      </View>

      {/* Orders Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Orders</Text>
        <MenuItem
          icon="receipt-outline"
          title="Order History"
          subtitle="View your past orders"
          onPress={() => navigation.navigate("OrderHistory")}
        />
        <MenuItem
          icon="time-outline"
          title="Pending Orders"
          subtitle="Track your current orders"
          onPress={() => navigation.navigate("PendingOrders")}
        />
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        {/* <MenuItem
          icon="person-outline"
          title="Edit Profile"
          onPress={() => console.log('Edit profile pressed')}
        /> */}
        <MenuItem
          icon="location-outline"
          title="Shipping Addresses"
          onPress={() => navigation.navigate("AllAddressesScreen")}
        />
        <MenuItem
          icon="information-circle-outline"
          title="About Us"
          onPress={() => navigation.navigate("AboutUsScreen")}
        />
        <MenuItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          onPress={() => navigation.navigate("PrivacyPolicyScreen")}
        />
        <MenuItem
          icon="call-outline"
          title="Contact Us"
          onPress={() => navigation.navigate("ContactUsScreen")}
        />
      </View>

      {/* Preferences
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <MenuItem
          icon="notifications-outline"
          title="Notifications"9
          onPress={() => console.log('Notifications pressed')}
        />
        <MenuItem
          icon="lock-closed-outline"
          title="Privacy Settings"
          onPress={() => console.log('Privacy pressed')}
        />
      </View> */}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#fff",
  },
  profileHeader: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemText: {
    flex: 1,
    marginLeft: 16,
  },
  menuItemTitle: {
    fontSize: 16,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  logoutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: "#ff6b6b",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
