// screens/ProductDetailsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    navigation.navigate("MainTabs", { screen: "Cart" });
  };

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.modalContainer}>
        {/* Close Button */}
        <Pressable style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Product Image */}
          <Image source={{ uri: product.image }} style={styles.image} />

          {/* Title + Price */}
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>₹{product.price}</Text>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description ||
              "This is a refreshing tea with natural flavors, perfect for daily energy and relaxation."}
          </Text>

          {/* Quantity Selector */}
          <View style={styles.qtyContainer}>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.qtyText}>-</Text>
            </Pressable>
            <Text style={styles.qtyCount}>{quantity}</Text>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Text style={styles.qtyText}>+</Text>
            </Pressable>
          </View>

          {/* Add to Cart Button */}
          <Pressable style={styles.addBtn} onPress={handleAddToCart}>
            <Text style={styles.addText}>Add to Cart</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // backdrop
    justifyContent: "flex-end",
  },
  modalContainer: {
    flex: 0.9,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 16,
    zIndex: 10,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  closeText: { fontSize: 18, fontWeight: "bold" },
  image: { width: "100%", height: 250, borderRadius: 12, marginBottom: 16 },
  name: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  price: { fontSize: 20, color: "#27ae60", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  description: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
    lineHeight: 22,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  qtyBtn: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
  },
  qtyText: { fontSize: 20, fontWeight: "700" },
  qtyCount: { marginHorizontal: 16, fontSize: 18, fontWeight: "600" },
  addBtn: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  addText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
