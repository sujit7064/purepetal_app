import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title Section */}
      <Text style={styles.title}>Privacy Policy</Text>

      {/* Privacy Policy Content */}
      <Text style={styles.paragraph}>
        At Purepetal, we respect your privacy and are committed to protecting
        your personal information. This Privacy Policy explains the types of
        information we collect, how we use it, and how we protect it.
      </Text>

      <Text style={styles.paragraph}>
        By using our website and services, you consent to the collection and use
        of your personal data as described in this Privacy Policy. Please read
        the policy carefully.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Information Collection</Text>
        <Text style={styles.paragraph}>
          We collect personal information when you use our services, including
          your name, email address, shipping information, and payment details.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          The information we collect is used to process orders, improve our
          services, and communicate with you about your account or transactions.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data Security</Text>
        <Text style={styles.paragraph}>
          We implement various security measures to protect your personal data
          from unauthorized access or disclosure.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, correct, or delete your personal data at
          any time. Please contact us if you wish to exercise these rights.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated effective date.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#EAEAEA", // Soft grey background for the overall page
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3E4A59", // Darker text color for better contrast
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
    textShadowColor: "#E1E1E1",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 26,
    color: "#555", // Dark gray for text readability
    marginBottom: 20,
    textAlign: "justify",
    backgroundColor: "#F9F9F9", // Light gray background for paragraphs
    padding: 10,
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#ffffff", // White background for the card
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E3A59", // Dark color for headings
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});

export default PrivacyPolicyScreen;
