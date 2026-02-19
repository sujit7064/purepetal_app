import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { categorylist, productbycategory } from "../env/action";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// ================= PRODUCT CARD COMPONENT =================
const ProductCard = ({ item, navigation }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  const discount = item.cut_price
    ? Math.round(((item.cut_price - item.price) / item.cut_price) * 100)
    : 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductDetailScreen", {
          product_id: item.product_id,
        })
      }
    >
      {/* Image Container with Placeholder */}
      <View style={styles.imageWrapper}>
        {/* Placeholder Logo */}
        {!imageLoaded && (
          <View style={styles.imagePlaceholder}>
            <Image
              source={require('../assets/images/Oraklogo.png')}
              style={styles.placeholderLogo}
              resizeMode="contain"
            />
          </View>
        )}
        
        {/* Actual Product Image */}
        <Image
          source={{ uri: item.image }}
          style={[styles.productImage, !imageLoaded && styles.imageHidden]}
          resizeMode="cover"
          onLoadEnd={() => setImageLoaded(true)}
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        {/* Product Name */}
        <Text numberOfLines={2} style={styles.productName}>
          {item.product_name}
        </Text>
        
        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>₹{item.price}</Text>
          {item.cut_price > 0 && (
            <Text style={styles.cutPrice}>₹{item.cut_price}</Text>
          )}
        </View>
        
        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#FFA500" />
          <Text style={styles.ratingText}>4.5</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CategoryScreen = ({ route }) => {
  const selectedFromHome = route?.params?.category_id;
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= LOAD CATEGORIES =================
  useEffect(() => {
    categorylist({}, (res) => {
      if (res.status === 1 && res.data.length > 0) {
        setCategories(res.data);
      }
    });
  }, []);

  // Set default category when categories loaded or route changes
  useEffect(() => {
    if (categories.length > 0) {
      const defaultCategoryId = selectedFromHome
        ? selectedFromHome
        : categories[0].category_id;

      setSelectedCategoryId(defaultCategoryId);
      loadProducts(defaultCategoryId);
    }
  }, [categories, selectedFromHome]);

  // ================= LOAD PRODUCTS =================
  const loadProducts = (categoryId) => {
    setLoading(true);

    productbycategory({ category_id: categoryId }, (res) => {
      if (res.status === 1) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
      setLoading(false);
    });
  };

  // Get selected category name
  const selectedCategory = categories.find(
    (cat) => cat.category_id === selectedCategoryId
  );

  // ================= CATEGORY ITEM =================
  const renderCategory = ({ item }) => {
    const isActive = selectedCategoryId === item.category_id;

    return (
      <TouchableOpacity
        style={[styles.categoryItem, isActive && styles.activeCategory]}
        onPress={() => {
          setSelectedCategoryId(item.category_id);
          loadProducts(item.category_id);
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.categoryImage}
          defaultSource={require("../assets/images/placeholder.png")}
        />
        <Text style={[styles.categoryText, isActive && styles.activeText]} numberOfLines={2}>
          {item.category_name}
        </Text>
      </TouchableOpacity>
    );
  };

  // ================= PRODUCT CARD =================
  const renderProduct = ({ item }) => {
    return <ProductCard item={item} navigation={navigation} />;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Categories</Text>
          {selectedCategory && (
            <Text style={styles.headerSubtitle}>{selectedCategory.category_name}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* LEFT CATEGORY LIST */}
        <View style={styles.leftPanel}>
          <Text style={styles.leftPanelTitle}>All Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.category_id.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* RIGHT PRODUCT GRID */}
        <View style={styles.rightPanel}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00D084" />
            </View>
          ) : (
            <>
              <Text style={styles.productCount}>
                {products.length} {products.length === 1 ? "Product" : "Products"}
              </Text>
              <FlatList
                data={products}
                numColumns={2}
                renderItem={renderProduct}
                keyExtractor={(item) => item.product_id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productGrid}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No products found</Text>
                }
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;

// ================= STYLES =================

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 140) / 2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    flex: 1,
    marginHorizontal: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#00D084",
    marginTop: 2,
  },

  container: {
    flex: 1,
    flexDirection: "row",
  },

  /* LEFT PANEL */
  leftPanel: {
    width: 120,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderColor: "#E0E0E0",
  },

  leftPanelTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },

  categoryItem: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },

  activeCategory: {
    backgroundColor: "#F0F9FF",
    borderLeftColor: "#00D084",
  },

  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },

  categoryText: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    lineHeight: 16,
  },

  activeText: {
    color: "#00D084",
    fontWeight: "700",
  },

  /* RIGHT PANEL */
  rightPanel: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  productCount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 12,
    paddingVertical: 16,
  },

  productGrid: {
    padding: 8,
    paddingBottom: 20,
  },

  /* PRODUCT CARD */
  card: {
    width: cardWidth,
    margin: 6,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 160,
    backgroundColor: "#F5F5F5",
  },

  imagePlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  placeholderLogo: {
    width: 50,
    height: 50,
    opacity: 0.3,
  },

  productImage: {
    width: "100%",
    height: 160,
  },

  imageHidden: {
    opacity: 0,
  },

  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF4444",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  productInfo: {
    padding: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
    height: 40,
    lineHeight: 20,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  productPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00D084",
    marginRight: 8,
  },

  cutPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    marginLeft: 4,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#999",
  },
});