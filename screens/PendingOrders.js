import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { pendingorders } from '../env/action';
import { useGetUser } from '../contextApi/UserContext';

const PendingOrders = () => {
  const { user } = useGetUser();
  const buyer_id = user?.user_id || '3';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    pendingorders({ buyer_id }, (res) => {
      if (res?.status === 1) {
        setOrders(res.data.orders || []);
      } else {
        // Alert.alert('Error', 'Failed to fetch orders');
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.text}>
          <Text style={styles.label}>Qty: </Text>{item.product_quantity}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Total: </Text>₹{item.total_amount}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Order Date: </Text>{item.order_date || 'N/A'}
        </Text>
      </View>
      <Image
        source={require('../assets/images/pending.png')}
        style={styles.pendingIcon}
      />
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      {/* Updated Fancy Header */}
      <Text style={styles.title}>🛒 Pending Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No past orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,          // Bigger and bold
    fontWeight: 'bold',
    color: '#4A148C',       // Dark purple color
    marginBottom: 20,
    textAlign: 'center',    // Centered
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  details: {
    flex: 1,
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
  pendingIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
});

export default PendingOrders;
