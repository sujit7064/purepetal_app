import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useGetUser } from "../contextApi/UserContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import * as app from "../app.json";

const HomeScreen = () => {
  const { user } = useGetUser();
  const navigation = useNavigation();

  // Hero slider images
  const heroImages = [
    require("../assets/images/blog1.jpg"),
    require("../assets/images/blog2.jpg"),
    require("../assets/images/blog3.jpg"),
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Featured products array
  const featuredProducts = [
    {
      name: "Simlipal Wild Honey",
      price: "₹89.00 – ₹349.00",
      image: require("../assets/images/banner3.jpg"),
    },
    {
      name: "Bio Disposable Sal Leaf Plate",
      price: "₹79.00 – ₹129.00",
      image: require("../assets/images/banner1.jpg"),
    },
    {
      name: "Natural Citronella Essential Oil (10ml)",
      price: "₹179.00",
      image: require("../assets/images/banner2.jpg"),
    },
    {
      name: "Shine Toilet Cleaner",
      price: "₹159.00",
      image: require("../assets/images/homecare.jpg"),
    },
  ];

  // Testimonials array
  const testimonials = [
    {
      quote:
        "Purepetal's products are not only eco-friendly but also of exceptional quality. Highly recommend!",
      name: "M jyotiprakash",
    },
    {
      quote:
        "The best online shopping experience for eco-conscious products. Love the tribal empowerment aspect.",
      name: "Aniket Dash",
    },
    {
      quote:
        "Incredible quality and great customer service. Will definitely buy again!",
      name: "Shaswat Mishra",
    },
  ];

  // Categories array
  const categories = [
    { title: "Food & Wellness", image: require("../assets/images/food.jpg") },
    { title: "Essential Oils", image: require("../assets/images/oils.jpg") },
    {
      title: "Disposable Plates",
      image: require("../assets/images/plates.jpg"),
    },
    { title: "Home Care", image: require("../assets/images/homecare.jpg") },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <Ionicons name="person-circle-outline" size={22} color="#333" />
          <Text style={styles.versionText}>V{app.expo.version}</Text>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image
          source={heroImages[currentImageIndex]}
          style={styles.heroImage}
        />
        <Text style={styles.heroTitle}>
          Purepetal: Empowering Tribes, Enriching Lives
        </Text>
        <Text style={styles.heroSubtitle}>
          Discover 100% biodegradable and natural products crafted with care by
          tribal communities.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("Product")}
        >
          <Text style={styles.ctaButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Offer Section */}
      <View style={styles.welcomeOffer}>
        <Text style={styles.welcomeHeading}>Welcome</Text>
        <Text style={styles.offerSubheading}>
          Order now to avail exciting offers!
        </Text>
        <View style={styles.offerBox}>
          <View style={styles.offerItem}>
            <Text style={styles.offerIcon}>💰</Text>
            <Text style={styles.offerTitle}>Flat ₹50 OFF</Text>
            <Text style={styles.offerSubtitle}>
              on your <Text style={styles.bold}>first order</Text>
            </Text>
            <Text style={styles.offerNote}>above ₹299</Text>
          </View>
          <View style={styles.offerDivider}>
            <Text style={{ fontSize: 24, color: "#bbb" }}>+</Text>
          </View>
          <View style={styles.offerItem}>
            <Text style={styles.offerIcon}>🚚</Text>
            <Text style={styles.offerTitle}>Free Delivery</Text>
            <Text style={styles.offerSubtitle}>
              on first <Text style={styles.bold}>10 orders</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Featured Products Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredProducts.map((product, idx) => (
            <View style={styles.productItem} key={idx}>
              <Image source={product.image} style={styles.productImage} />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <TouchableOpacity
                style={styles.shopNowButton}
                onPress={() => navigation.navigate("Product")}
              >
                <Text style={styles.shopNowButtonText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Shop by Category */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.categoryItem}
              onPress={() => navigation.navigate("Product")}
            >
              <Image source={cat.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Our Impact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Impact</Text>
        <Text style={styles.sectionContent}>
          Every purchase empowers tribal artisans, providing them with
          sustainable livelihoods while preserving traditional skills.
        </Text>
        <Image
          source={require("../assets/images/tribal_community.jpg")}
          style={styles.wideImage}
        />
      </View>

      {/* Testimonials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Our Customers Say</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {testimonials.map((testimonial, idx) => (
            <View style={styles.testimonialItem} key={idx}>
              <Text style={styles.testimonial}>{testimonial.quote}</Text>
              <Text style={styles.testimonialName}>– {testimonial.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Purepetal</Text>

        <View style={styles.footerLinks}>
          {[
            { title: "Home", screen: "Home" },
            { title: "Shop", screen: "Product" },
            { title: "About Us", screen: "AboutUsScreen" },
            { title: "Contact", screen: "ContactUsScreen" },
          ].map((link, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => navigation.navigate(link.screen)}
            >
              <Text style={styles.footerLink}>{link.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerSocial}>
          {[
            { name: "Facebook", emoji: "📘" },
            { name: "Instagram", emoji: "📸" },
            { name: "Twitter", emoji: "🐦" },
          ].map((social, idx) => (
            <TouchableOpacity key={idx}>
              <Text style={styles.footerSocialLink}>
                {social.emoji} {social.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerContactBox}>
          <Text style={styles.footerContact}>📧 info.purepetal@gmail.com</Text>
          <Text style={styles.footerContact}>📞 +91 8984952722</Text>
        </View>

        <Text style={styles.footerCopyright}>
          © {new Date().getFullYear()} Purepetal. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // your same styles...
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  hero: {
    backgroundColor: "#f87256",
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  heroImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
    resizeMode: "cover",
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#ffece6",
    marginVertical: 15,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 2,
  },
  ctaButtonText: {
    color: "#f87256",
    fontWeight: "bold",
    fontSize: 16,
  },
  welcomeOffer: {
    backgroundColor: "#FFF8E1",
    padding: 20,
    alignItems: "center",
  },
  welcomeHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8D4F00",
  },
  offerSubheading: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
    marginBottom: 20,
  },
  offerBox: {
    flexDirection: "row",
    backgroundColor: "#fff9ec",
    borderRadius: 12,
    padding: 20,
    justifyContent: "space-around",
    width: "100%",
  },
  offerItem: {
    flex: 1,
    alignItems: "center",
  },
  offerIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  offerTitle: {
    fontSize: 18,
    color: "#2ecc71",
    fontWeight: "bold",
  },
  offerSubtitle: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  offerNote: {
    marginTop: 4,
    fontSize: 12,
    color: "#999",
  },
  offerDivider: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d3a2a",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  productItem: {
    width: 180,
    marginRight: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  ctaButtonSmall: {
    marginTop: 10,
    backgroundColor: "#f87256",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 5,
  },
  ctaButtonTextSmall: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  ctaButtonOutline: {
    marginTop: 15,
    borderColor: "#f87256",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  ctaButtonTextOutline: {
    color: "#f87256",
    fontSize: 16,
    fontWeight: "bold",
  },
  testimonialItem: {
    marginRight: 15,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    width: 280,
  },
  testimonial: {
    fontStyle: "italic",
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  testimonialName: {
    fontSize: 14,
    color: "#333",
    textAlign: "right",
    fontWeight: "bold",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "48%",
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  categoryText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#2d3a2a",
    paddingVertical: 8,
  },
  wideImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  footer: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  footerLinks: {
    flexDirection: "row",
    marginBottom: 20,
  },
  footerLink: {
    fontSize: 16,
    color: "#555",
    marginHorizontal: 15,
  },
  footerSocial: {
    flexDirection: "row",
    marginBottom: 15,
  },
  footerSocialLink: {
    fontSize: 16,
    color: "#555",
    marginHorizontal: 15,
  },
  footerContact: {
    fontSize: 14,
    color: "#555",
  },
  footer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#1e2a38",
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  footerLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  footerLink: {
    color: "#bbb",
    marginHorizontal: 10,
    fontSize: 16,
    paddingVertical: 5,
  },
  footerSocial: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  footerSocialLink: {
    color: "#fff",
    fontSize: 16,
    marginHorizontal: 8,
  },
  footerContactBox: {
    alignItems: "center",
    marginBottom: 15,
  },
  footerContact: {
    color: "#ccc",
    fontSize: 14,
  },
  footerCopyright: {
    fontSize: 12,
    color: "#888",
    marginTop: 10,
  },
  shopNowButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  shopNowButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  versionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
});

export default HomeScreen;
