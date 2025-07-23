import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { addtocart } from "../env/action";
import { useGetUser } from "../contextApi/UserContext";

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

  const [quantity, setQuantity] = useState(1);
  const { user } = useGetUser();
  const scrollRef = useRef(null); // Add this
  const images = [product.image, ...(product.multiple_image || [])];
  const [currentIndex, setCurrentIndex] = useState(0);
  const width = Dimensions.get("window").width - 32;
  const handleAddToCart = () => {
    const signupDetail = {
      buyer_id: user.user_id,
      product_id: product.product_id,
      quantity: quantity,
      price: product.price,
    };

    addtocart(signupDetail, (response) => {
      if (response.status === 1) {
        Alert.alert("Success", response.message);
        navigation.navigate("CartScreen");
      } else {
        Alert.alert("Error", response.message || "Failed to add to cart.");
      }
    });
  };
  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        {/* <Image source={{ uri: product.image }} style={styles.image} /> */}

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.imageGallery}
        >
          {[product.image, ...(product.multiple_image || [])].map(
            (img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={[styles.image, { width: width }]}
              />
            )
          )}
        </ScrollView>

        <Text style={styles.name}>{product.product_name}</Text>
        <Text style={styles.price}>₹{product.price}</Text>

        <Text style={styles.description}>
          {product.description ||
            "Experience the purity of hand-crafted, eco-friendly tribal products delivered to your doorstep."}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityNumber}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#eaeaea",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  quantityText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  quantityNumber: {
    fontSize: 18,
    marginHorizontal: 20,
    color: "#333",
  },
  addToCartButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  imageGallery: {
    marginBottom: 16,
  },

  image: {
    height: 280,
    borderRadius: 12,
    resizeMode: "cover",
    marginRight: 10,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    margin: 4,
  },
  activeDot: {
    backgroundColor: "#2ecc71",
  },
});

export default ProductDetailScreen;
