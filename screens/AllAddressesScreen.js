import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { alladdresslist } from "../env/action";
import { useGetUser } from "../contextApi/UserContext";
import { useNavigation } from "@react-navigation/native";

const AllAddressesScreen = () => {
  const navigation = useNavigation();
  const { user } = useGetUser();
  const user_id = user?.user_id;

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = () => {
    alladdresslist({ user_id }, (res) => {
      if (res?.status === 1) {
        setAddresses(res.data.address);
      } else {
        Alert.alert("Error", "Failed to load addresses");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading your addresses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Ionicons name="location" size={22} color="#007bff" />
          <Text style={styles.headerTitle}>My Addresses</Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: cardColors[index % cardColors.length] },
            ]}
          >
            <Text style={styles.label}>
              <Text style={styles.field}>Address:</Text> {item.address}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.field}>City:</Text> {item.city}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.field}>District:</Text> {item.dist}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.field}>State:</Text> {item.state}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.field}>Pincode:</Text> {item.pincode}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noData}>
            No addresses found. Try adding some!
          </Text>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const cardColors = [
  "#f2f7ff",
  "#e6f2ff",
  "#f0f8ff",
  "#f7fbff",
  "#eef6fb",
  "#f5faff",
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
    color: "#111",
  },

  // Cards
  card: {
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: "#34495e",
  },
  field: {
    fontWeight: "bold",
    color: "#007bff",
  },

  // Loading
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 15,
    color: "#555",
  },

  noData: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#999",
  },
});

export default AllAddressesScreen;
