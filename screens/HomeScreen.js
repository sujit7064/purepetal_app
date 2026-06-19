import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { categorylist, bannerproduct, productlist } from "../env/action";
import { SafeAreaView } from "react-native-safe-area-context";
import banner1 from "../assets/images/dishbanner.jpg";
import banner2 from "../assets/images/banner2.png";
import banner3 from "../assets/images/banner.png";

const { width } = Dimensions.get("window");

/* ---------- FALLBACK IMAGE ---------- */
const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x200.png?text=Natural+Products";

const HomeScreen = () => {
  const navigation = useNavigation();
  const scrollRef = useRef();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  const banners = [banner1, banner2, banner3];

  /* ================= API CALLS ================= */
  useEffect(() => {
    categorylist({}, (res) => {
      if (res?.status === 1) {
        setCategories(res.data || []);
      }
    });
  }, []);

  useEffect(() => {
    bannerproduct({}, (res) => {
      if (res?.status === 1) {
        setFeaturedProducts(res.data || []);
      }
    });
  }, []);

  // Load all products for search
  useEffect(() => {
    productlist({}, (res) => {
      if (res?.status === 1) {
        setAllProducts(res.data || []);
      }
    });
  }, []);

  /* ================= AUTO BANNER SLIDE ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = bannerIndex + 1;
      if (nextIndex >= banners.length) nextIndex = 0;

      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });

      setBannerIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerIndex]);

  /* ================= SEARCH HANDLER ================= */
  const handleSearchChange = (text) => {
    setSearch(text);

    if (text.trim() === "") {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filter products based on search text
    const filtered = allProducts.filter((product) =>
      product.product_name.toLowerCase().includes(text.toLowerCase())
    );

    setSearchSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (product) => {
    setSearch("");
    setShowSuggestions(false);
    navigation.navigate("ProductDetailScreen", {
      product_id: product.product_id,
    });
  };

  const handleSearchSubmit = () => {
    if (search.trim()) {
      setShowSuggestions(false);
      navigation.navigate("Product", { keyword: search.trim() });
      setSearch("");
    }
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View style={styles.logoIcon}>
              <Image
                source={require("../assets/images/Oraklogo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.appName}>ORAK</Text>
              <Text style={styles.appTagline}>powered by PurePetal</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate("OrderHistory")}
            >
              <Ionicons name="receipt-outline" size={24} color="#111" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate("Cart")}
            >
              <Ionicons name="cart-outline" size={24} color="#111" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBar}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search for products..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              style={styles.searchInput}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => {
                setSearch("");
                setShowSuggestions(false);
              }}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {searchSuggestions.map((item) => (
                <TouchableOpacity
                  key={item.product_id}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionClick(item)}
                >
                  <Image
                    source={{ uri: item.image || FALLBACK_IMAGE }}
                    style={styles.suggestionImage}
                  />
                  <View style={styles.suggestionTextContainer}>
                    <Text style={styles.suggestionName} numberOfLines={2}>
                      {item.product_name}
                    </Text>
                    <Text style={styles.suggestionPrice}>₹{item.price}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {showSuggestions && searchSuggestions.length === 0 && search.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={32} color="#D0D0D0" />
                <Text style={styles.noResultsText}>No products found</Text>
                <TouchableOpacity
                  style={styles.searchAllBtn}
                  onPress={handleSearchSubmit}
                >
                  <Text style={styles.searchAllText}>Search anyway</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* ================= BANNER SLIDER ================= */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
          >
            {banners.map((img, index) => (
              <TouchableOpacity key={index} activeOpacity={0.9}>
                <Image source={img} style={styles.bannerImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Dots */}
          <View style={styles.dotsContainer}>
            {banners.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, bannerIndex === i && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        {/* ================= QUICK INFO CARDS ================= */}
        <View style={styles.infoCardsContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="flash" size={20} color="#00D084" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Free Delivery</Text>
              <Text style={styles.infoSubtitle}>On orders above ₹499</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#00D084" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>100% Organic</Text>
              <Text style={styles.infoSubtitle}>Natural products</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="ribbon" size={20} color="#00D084" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Best Quality</Text>
              <Text style={styles.infoSubtitle}>Premium selection</Text>
            </View>
          </View>
        </View>

        {/* ================= FEATURED PRODUCTS ================= */}
        {featuredProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Featured Products</Text>
                <Text style={styles.sectionSubtitle}>Handpicked for you</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("Product", {})}
              >
                <Text style={styles.seeAllText}>See All →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {featuredProducts.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.featuredCard}
                  onPress={() =>
                    navigation.navigate("ProductDetailScreen", {
                      product_id: item.product_id,
                    })
                  }
                >
                  <View style={styles.featuredImageContainer}>
                    <Image
                      source={{ uri: item.image || FALLBACK_IMAGE }}
                      style={styles.featuredImage}
                    />
                   
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.product_name}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.productPrice}>₹{item.price}</Text>
                      {item.cut_price > 0 && (
                        <Text style={styles.productCutPrice}>
                          ₹{item.cut_price}
                        </Text>
                      )}
                    </View>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#FFA500" />
                      <Text style={styles.ratingText}>4.5</Text>
                      <Text style={styles.reviewCount}>(230)</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ================= SHOP BY CATEGORY ================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Shop by Category</Text>
              <Text style={styles.sectionSubtitle}>
                Explore our collections
              </Text>
            </View>
          </View>

          <View style={styles.categoryGrid}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() =>
                  navigation.navigate("Product", {
                    category_id: cat.category_id,
                  })
                }
              >
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={{ uri: cat.image || FALLBACK_IMAGE }}
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={styles.categoryText} numberOfLines={2}>
                  {cat.category_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  logoSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  logoImage: {
    width: 36,
    height: 36,
  },

  appName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  appTagline: {
    fontSize: 11,
    color: "#00D084",
    fontWeight: "600",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  // Search Bar
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    position: "relative",
    zIndex: 1000,
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
    color: "#111",
  },

  // Search Suggestions
  suggestionsContainer: {
    position: "absolute",
    top: 72,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    zIndex: 1001,
  },

  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },

  suggestionImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    marginRight: 12,
  },

  suggestionTextContainer: {
    flex: 1,
  },

  suggestionName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },

  suggestionPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00D084",
  },

  noResultsContainer: {
    alignItems: "center",
    padding: 24,
  },

  noResultsText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    marginBottom: 12,
  },

  searchAllBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00D084",
  },

  searchAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00D084",
  },

  /* Banner */
  bannerImage: {
    width: width,
    height: 200,
    borderRadius: 0,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 8,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#00D084",
    width: 20,
  },

  // Info Cards
  infoCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },

  infoCard: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F8F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  infoContent: {
    alignItems: "center",
  },

  infoTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },

  infoSubtitle: {
    fontSize: 9,
    color: "#666",
    textAlign: "center",
  },

  // Section
  section: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: "#666",
  },

  seeAllText: {
    fontSize: 14,
    color: "#00D084",
    fontWeight: "600",
  },

  // Featured Products
  featuredCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  featuredImageContainer: {
    position: "relative",
  },

  featuredImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F8F9FA",
  },

  wishlistBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  productInfo: {
    padding: 10,
  },

  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
    height: 36,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#00D084",
    marginRight: 6,
  },

  productCutPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
    marginLeft: 4,
  },

  reviewCount: {
    fontSize: 11,
    color: "#999",
    marginLeft: 4,
  },

  // Categories
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },

  categoryItem: {
    width: "48%",
    marginHorizontal: "1%",
    marginBottom: 16,
  },

  categoryImageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  categoryImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#F8F9FA",
  },

  categoryText: {
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
    fontSize: 14,
    color: "#111",
  },
});