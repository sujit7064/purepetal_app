// screens/ContactUsScreen.js
import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ContactUsScreen = () => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Contact Us</Text>

    <Text style={styles.paragraph}>
      We'd love to hear from you! Whether you have questions, feedback, or want
      to get involved, feel free to reach out.
    </Text>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        <Icon name="mail-outline" size={20} color="#2E3A59" /> Email
      </Text>
      <Text
        style={styles.link}
        onPress={() => Linking.openURL("mailto:purepetalsimilipal@gmail.com")}
      >
        purepetalsimilipal@gmail.com
      </Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        <Icon name="call-outline" size={20} color="#2E3A59" /> Phone
      </Text>
      <Text style={styles.paragraph}>+91 99389 54453</Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        <Icon name="location-outline" size={20} color="#2E3A59" /> Location
      </Text>
      <Text style={styles.paragraph}>Similipal, Mayurbhanj, Odisha, India</Text>
    </View>

    <TouchableOpacity
      style={styles.contactButton}
      onPress={() => Linking.openURL("https://purepetls.com/contact/")}
    >
      <Text style={styles.contactText}>Visit Website</Text>
    </TouchableOpacity>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#E3F2FD", // light blue background
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 20,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 15,
    textAlign: "justify",
  },
  card: {
    backgroundColor: "#FAFAFA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2E3A59",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 5,
  },
  link: {
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  contactButton: {
    backgroundColor: "#2E3A59",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ContactUsScreen;
