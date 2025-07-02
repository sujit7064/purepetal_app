import React from "react";
import { ScrollView, Text, StyleSheet, Image, View } from "react-native";

const AboutUsScreen = () => {
  return (
    <View style={styles.pageContainer}>
      {/* Root View with background color */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title Section */}
        <Text style={styles.title}>About Us</Text>

        {/* Hero Image */}
        <Image
          source={require("../assets/images/blog1.jpg")} // Your image path
          style={styles.heroImage}
        />

        {/* About Us Content */}
        <Text style={styles.paragraph}>
          Purepetal is a unique e-commerce platform dedicated to promoting and
          selling products crafted by the indigenous tribal communities of
          Simlipal, Mayurbhanj, Odisha, India. It is a pioneering effort to
          bridge the gap between local tribal artisans and a broader market,
          aiming to highlight the traditional and sustainable products crafted
          by tribal hands.
        </Text>

        <Text style={styles.paragraph}>
          Focusing on eco-friendly, locally-sourced items, Purepetal Alliance
          fosters an ecosystem that benefits both the environment and the
          community that produces these goods. With two Farmer Producer
          Companies (FPCs) and approximately 1,000 tribal farmers in the
          Simlipal region, Purepetal Alliance empowers tribal farmers by
          providing them with a fair marketplace for their products, thus
          enhancing their income and preserving their cultural heritage.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            This platform is a step toward building sustainable livelihoods and
            promoting the unique craftsmanship of the Simlipal tribes, fostering
            a sense of pride and economic independence within the community.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1, // Ensures full screen usage
    backgroundColor: "#E8F4F8", // Light blue background for the entire page
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2E3A59", // Darker text color for better contrast
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textShadowColor: "#E5E5E5",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  heroImage: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    marginBottom: 25,
    resizeMode: "cover",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 26,
    color: "#333", // Dark gray color for better readability
    marginBottom: 20,
    textAlign: "justify",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginVertical: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E3A59", // Matching card title color with the title
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
});

export default AboutUsScreen;
