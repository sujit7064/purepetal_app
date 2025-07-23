import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { allorderlist, returnOrder } from "../env/action";
import { useGetUser } from "../contextApi/UserContext";

const { width } = Dimensions.get("window");

const OrderHistory = () => {
  const { user } = useGetUser();
  const buyer_id = user?.user_id || "3";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    allorderlist({ buyer_id }, (res) => {
      if (res?.status === 1) {
        setOrders(res.data.orders || []);
      }
      setLoading(false);
    });
  };

  const handleReturn = (order_id) => {
    console.log("Trying to return order:", order_id);
    returnOrder({ order_id }, (res) => {
      console.log("Return response:", res);
      if (res?.status === 1) {
        Alert.alert("Success", res.message);
        fetchOrders();
      } else {
        Alert.alert("Error", res.message || "Unable to return order");
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const renderItem = ({ item }) => {
    const isReturnable = item.status_no === 5; // "Delivered"

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.text}>
            <Text style={styles.label}>Qty:</Text> {item.product_quantity}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Total:</Text> ₹{item.total_amount}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Order Date:</Text>{" "}
            {item.order_date || "N/A"}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.label}>Status:</Text> {item.status}
          </Text>

          <TouchableOpacity
            style={[
              styles.returnButton,
              { backgroundColor: isReturnable ? "#27ae60" : "#aaa" },
            ]}
            onPress={() => isReturnable && handleReturn(item.id)}
            disabled={!isReturnable}
          >
            <Text style={styles.returnButtonText}>
              {isReturnable ? "Return" : "Not Returnable"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Order History</Text>
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No past orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    width: "100%",
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  details: {
    flex: 1,
    justifyContent: "space-around",
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
  returnButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  returnButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default OrderHistory;
