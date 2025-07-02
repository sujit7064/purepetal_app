import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { alladdresslist } from '../env/action';
import { useGetUser } from '../contextApi/UserContext';

const AllAddressesScreen = () => {
  const { user } = useGetUser();
  const user_id = user.user_id;

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = () => {
    alladdresslist({ user_id }, (res) => {
      if (res?.status === 1) {
        setAddresses(res.data.address);
      } else {
        Alert.alert('Error', 'Failed to load addresses');
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading your addresses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Title */}
      <Text style={styles.pageTitle}>📍 My Addresses</Text>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.card, { backgroundColor: cardColors[index % cardColors.length] }]}>
            <Text style={styles.label}><Text style={styles.field}>Address:</Text> {item.address}</Text>
            <Text style={styles.label}><Text style={styles.field}>City:</Text> {item.city}</Text>
            <Text style={styles.label}><Text style={styles.field}>District:</Text> {item.dist}</Text>
            <Text style={styles.label}><Text style={styles.field}>State:</Text> {item.state}</Text>
            <Text style={styles.label}><Text style={styles.field}>Pincode:</Text> {item.pincode}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noData}>No addresses found. Try adding some!</Text>
        }
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const cardColors = [
  '#f2f7ff',  // soft light blue
  '#e6f2ff',
  '#f0f8ff',
  '#f7fbff',
  '#eef6fb',
  '#f5faff',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#f9fcff', // soft clean background
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50', // dark blue/blackish tone
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginHorizontal: 8,
    backgroundColor: '#f0f0f0', // fallback background (overridden by cardColors)
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#34495e',
  },
  field: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fcff',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#999',
  },
});

export default AllAddressesScreen;
