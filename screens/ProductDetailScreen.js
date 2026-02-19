// screens/ProductDetailsScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import banner1 from "../assets/images/unnamed.jpg";
import { productdetails, addtocart } from "../env/action";
import { useGetUser } from "../contextApi/UserContext";
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

export default function ProductDetailsScreen({ route, navigation }) {
  const { product_id } = route.params;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { user } = useGetUser();
  const buyer_id = user?.user_id;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Fetch product
  useEffect(() => {
    productdetails({ product_id }, (response) => {
      if (response?.status === 1) {
        setProduct(response.data);
        // Animate in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Alert.alert("Error", response.message);
      }
      setLoading(false);
    });
  }, []);

  // Discount %
  const discount =
    product && product.cut_price
      ? Math.round(
          ((product.cut_price - product.price) / product.cut_price) * 100
        )
      : 0;

  // Update quantity locally
  const updateQuantity = (newQuantity) => {
    if (newQuantity < 0) return;
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (quantity <= 0) {
      Alert.alert("Select quantity", "Please select quantity to add to cart");
      return;
    }

    const data = {
      buyer_id,
      product_id: product.product_id,
      quantity,
      price: product.price,
    };

    setLoading(true);

    addtocart(data, (response) => {
      setLoading(false);

      if (response?.status === 1) {
        setQuantity(0); // reset quantity
        navigation.navigate("MainApp", { screen: "Cart" });
      } else {
        Alert.alert("Error", response?.message);
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00D084" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) return null;

  // Mock images array (replace with actual product images if available)
  const productImages = [
    product.image,
    product.image, // Add more images if available from your API
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Product Details</Text>
        <Pressable style={styles.headerBtn}>
          <Text style={styles.headerIcon}>♡</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Product Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / width
              );
              setSelectedImageIndex(index);
            }}
          >
            {productImages.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.productImage}
                resizeMode="contain"
              />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {productImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  selectedImageIndex === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>

          {/* Discount Badge */}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Product Info Card */}
          <View style={styles.infoCard}>
            {/* Product Name */}
            <Text style={styles.productName}>{product.product_name}</Text>

            {/* Rating & Reviews */}
            <View style={styles.ratingContainer}>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingText}>★ 4.5</Text>
              </View>
              <Text style={styles.reviewText}>2,348 reviews</Text>
              <View style={styles.dot} />
              <Text style={styles.soldText}>5k+ sold</Text>
            </View>

            {/* Price Section */}
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{product.price}</Text>
                {product.cut_price > 0 && (
                  <Text style={styles.cutPrice}>₹{product.cut_price}</Text>
                )}
              </View>
              <Text style={styles.taxText}>Inclusive of all taxes</Text>
            </View>

            {/* Quantity Selector */}
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.qtyContainer}>
                <Pressable
                  style={[styles.qtyBtn, quantity <= 0 && styles.qtyBtnDisabled]}
                  onPress={() => updateQuantity(Math.max(0, quantity - 1))}
                >
                  <Text
                    style={[styles.qtyText, quantity <= 0 && styles.qtyTextDisabled]}
                  >
                    −
                  </Text>
                </Pressable>

                <View style={styles.qtyCountBox}>
                  <Text style={styles.qtyCount}>{quantity}</Text>
                </View>

                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(quantity + 1)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Offers Section */}
          <View style={styles.offersCard}>
            <Text style={styles.sectionTitle}>Available Offers</Text>
            <View style={styles.offerItem}>
              <Text style={styles.offerIcon}>🏷️</Text>
              <View style={styles.offerContent}>
                <Text style={styles.offerTitle}>Bank Offer</Text>
                <Text style={styles.offerDesc}>
                  10% instant discount on SBI Credit Cards
                </Text>
              </View>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerIcon}>💳</Text>
              <View style={styles.offerContent}>
                <Text style={styles.offerTitle}>Cashback Offer</Text>
                <Text style={styles.offerDesc}>
                  Get 5% cashback on your first purchase
                </Text>
              </View>
            </View>
          </View>

          {/* Product Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <Text style={styles.description}>
              {product.description ||
                "100% Natural & Pure product. Made with premium quality ingredients. Eco-friendly and safe for daily use. Experience the difference with our carefully crafted product."}
            </Text>

            {/* Key Features */}
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>✓</Text>
                </View>
                <Text style={styles.featureText}>100% Natural</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>★</Text>
                </View>
                <Text style={styles.featureText}>Premium Quality</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>♻</Text>
                </View>
                <Text style={styles.featureText}>Eco Friendly</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>⚡</Text>
                </View>
                <Text style={styles.featureText}>Fast Delivery</Text>
              </View>
            </View>
          </View>

          {/* Promotional Banner */}
          <Image source={banner1} style={styles.promoBanner} resizeMode="cover" />

          {/* Delivery & Services */}
          <View style={styles.servicesCard}>
            <Text style={styles.sectionTitle}>Delivery & Services</Text>

            <View style={styles.serviceItem}>
              <View style={styles.serviceIconBox}>
                <Text style={styles.serviceEmoji}>🚚</Text>
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Free Delivery</Text>
                <Text style={styles.serviceDesc}>On orders above ₹499</Text>
              </View>
            </View>

            <View style={styles.serviceItem}>
              <View style={styles.serviceIconBox}>
                <Text style={styles.serviceEmoji}>💰</Text>
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Cash on Delivery</Text>
                <Text style={styles.serviceDesc}>Available for this product</Text>
              </View>
            </View>

            <View style={styles.serviceItem}>
              <View style={styles.serviceIconBox}>
                <Text style={styles.serviceEmoji}>↩️</Text>
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>7 Days Return</Text>
                <Text style={styles.serviceDesc}>Easy return & exchange</Text>
              </View>
            </View>

            <View style={styles.serviceItem}>
              <View style={styles.serviceIconBox}>
                <Text style={styles.serviceEmoji}>🛡️</Text>
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>Secure Payment</Text>
                <Text style={styles.serviceDesc}>100% secure transactions</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          android_ripple={{ color: "#00B870" }}
        >
          <Text style={styles.addToCartIcon}>🛒</Text>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// Keep your original styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 12, fontSize: 14, color: "#666" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F8F9FA", alignItems: "center", justifyContent: "center" },
  headerIcon: { fontSize: 20, color: "#111" },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  imageContainer: { width: width, height: width * 0.9, backgroundColor: "#fff", position: "relative" },
  productImage: { width: width, height: width * 0.9 },
  imageIndicators: { position: "absolute", bottom: 16, left: 0, right: 0, flexDirection: "row", justifyContent: "center", alignItems: "center" },
  indicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#D0D0D0", marginHorizontal: 4 },
  activeIndicator: { width: 20, backgroundColor: "#00D084" },
  discountBadge: { position: "absolute", top: 16, right: 16, backgroundColor: "#FF3B30", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  discountBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  infoCard: { backgroundColor: "#fff", padding: 16, marginTop: 8 },
  productName: { fontSize: 20, fontWeight: "700", color: "#111", lineHeight: 28, marginBottom: 8 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  ratingBox: { backgroundColor: "#00D084", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  ratingText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  reviewText: { fontSize: 13, color: "#666" },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#999", marginHorizontal: 8 },
  soldText: { fontSize: 13, color: "#666" },
  priceSection: { marginBottom: 20 },
  priceRow: { flexDirection: "row", alignItems: "baseline", marginBottom: 4 },
  price: { fontSize: 28, fontWeight: "800", color: "#111", marginRight: 12 },
  cutPrice: { fontSize: 18, textDecorationLine: "line-through", color: "#999" },
  taxText: { fontSize: 12, color: "#666" },
  quantitySection: { paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F0F0F0" },
  quantityLabel: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 12 },
  qtyContainer: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#00D084", alignItems: "center", justifyContent: "center", elevation: 2, shadowColor: "#00D084", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
  qtyBtnDisabled: { backgroundColor: "#E0E0E0" },
  qtyText: { fontSize: 20, fontWeight: "700", color: "#fff" },
  qtyTextDisabled: { color: "#999" },
  qtyCountBox: { minWidth: 60, paddingHorizontal: 20, alignItems: "center" },
  qtyCount: { fontSize: 18, fontWeight: "700", color: "#111" },
  offersCard: { backgroundColor: "#fff", padding: 16, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 12 },
  offerItem: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  offerIcon: { fontSize: 24, marginRight: 12 },
  offerContent: { flex: 1 },
  offerTitle: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 2 },
  offerDesc: { fontSize: 13, color: "#666", lineHeight: 18 },
  detailsCard: { backgroundColor: "#fff", padding: 16, marginTop: 8 },
  description: { fontSize: 14, color: "#555", lineHeight: 22, marginBottom: 16 },
  featuresGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 },
  featureItem: { width: "50%", flexDirection: "row", alignItems: "center", paddingHorizontal: 8, marginBottom: 12 },
  featureIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center", marginRight: 10 },
  featureIconText: { fontSize: 16, color: "#00D084" },
  featureText: { fontSize: 13, fontWeight: "500", color: "#333", flex: 1 },
  promoBanner: { width: width - 32, height: 100, marginTop: 8, marginHorizontal: 16, borderRadius: 12 },
  servicesCard: { backgroundColor: "#fff", padding: 16, marginTop: 8 },
  serviceItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F5F5F5" },
  serviceIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#F0F9FF", alignItems: "center", justifyContent: "center", marginRight: 12 },
  serviceEmoji: { fontSize: 20 },
  serviceContent: { flex: 1 },
  serviceTitle: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 2 },
  serviceDesc: { fontSize: 12, color: "#666" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#F0F0F0", elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  addToCartBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#00D084", paddingVertical: 16, borderRadius: 12, elevation: 3, shadowColor: "#00D084", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  addToCartIcon: { fontSize: 18, marginRight: 8 },
  addToCartText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
