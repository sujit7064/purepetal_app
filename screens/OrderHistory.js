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
  StatusBar,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { allorderlist, returnOrder } from "../env/action";
import { useGetUser } from "../contextApi/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");

const OrderHistory = () => {
  const navigation = useNavigation();
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
    Alert.alert(
      "Return Order",
      "Are you sure you want to return this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            returnOrder({ order_id }, (res) => {
              if (res?.status === 1) {
                Alert.alert("Success", res.message || "Return request submitted successfully");
                fetchOrders();
              } else {
                Alert.alert("Error", res.message || "Unable to return order");
              }
            });
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const getStatusColor = (status_no) => {
    switch (status_no) {
      case 1: return "#FFA500"; // Pending - Orange
      case 2: return "#2196F3"; // Processing - Blue
      case 3: return "#9C27B0"; // Shipped - Purple
      case 4: return "#FF9800"; // Out for Delivery - Amber
      case 5: return "#4CAF50"; // Delivered - Green
      case 6: return "#F44336"; // Cancelled - Red
      case 7: return "#607D8B"; // Returned - Grey
      default: return "#999";
    }
  };

  const getStatusIcon = (status_no) => {
    switch (status_no) {
      case 1: return "time-outline";
      case 2: return "hourglass-outline";
      case 3: return "airplane-outline";
      case 4: return "bicycle-outline";
      case 5: return "checkmark-circle";
      case 6: return "close-circle";
      case 7: return "return-down-back";
      default: return "ellipsis-horizontal";
    }
  };

  const renderItem = ({ item }) => {
    const isReturnable = item.status_no === 5; // "Delivered"
    const statusColor = getStatusColor(item.status_no);
    const statusIcon = getStatusIcon(item.status_no);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.orderCard}>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderIdSection}>
            {/* <Text style={styles.orderIdLabel}>Order #{item.id}</Text> */}
            <Text style={styles.orderDate}>{item.order_date || "N/A"}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Ionicons name={statusIcon} size={14} color="#fff" />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.productSection}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.productImage} 
            resizeMode="cover"
          />
          
          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.product_name || "Product"}
            </Text>
            
            <View style={styles.productMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="cube-outline" size={14} color="#666" />
                <Text style={styles.metaText}>Qty: {item.product_quantity}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Ionicons name="pricetag-outline" size={14} color="#666" />
                <Text style={styles.metaText}>₹{item.product_price}</Text>
              </View>
            </View>

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>₹{item.total_amount}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
         

          {isReturnable && (
            <TouchableOpacity
              style={styles.returnBtn}
              onPress={() => handleReturn(item.id)}
            >
              <Ionicons name="return-down-back-outline" size={18} color="#fff" />
              <Text style={styles.returnBtnText}>Return</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      </SafeAreaView>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
            style={styles.container}
            edges={['top', 'left', 'right']}
          >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order History</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D084" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
   <SafeAreaView
        style={styles.container}
        edges={['top', 'left', 'right']}
      >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Orders List */}
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="receipt-outline" size={80} color="#D0D0D0" />
          </View>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            You haven't placed any orders yet.{"\n"}Start shopping now!
          </Text>
          <TouchableOpacity 
            style={styles.shopNowBtn}
            onPress={() => navigation.navigate("MainApp", { screen: "Product" })}
          >
            <Text style={styles.shopNowText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },

  // List
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Order Card
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  orderIdSection: {
    flex: 1,
  },

  orderIdLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },

  orderDate: {
    fontSize: 12,
    color: "#666",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 4,
  },

  // Product Section
  productSection: {
    flexDirection: "row",
    marginBottom: 12,
  },

  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    marginRight: 12,
  },

  productDetails: {
    flex: 1,
    justifyContent: "space-between",
  },

  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },

  productMeta: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },

  metaText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },

  totalSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  totalLabel: {
    fontSize: 13,
    color: "#666",
    marginRight: 8,
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00D084",
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  detailsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00D084",
    backgroundColor: "#fff",
  },

  detailsBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00D084",
    marginLeft: 6,
  },

  returnBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#FF9800",
    elevation: 2,
    shadowColor: "#FF9800",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  returnBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 6,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  shopNowBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#00D084",
    elevation: 3,
    shadowColor: "#00D084",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  shopNowText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

export default OrderHistory;