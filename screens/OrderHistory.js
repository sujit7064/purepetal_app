import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { allorderlist } from '../env/action';
import { useGetUser } from '../contextApi/UserContext';

const OrderHistory = () => {
  const { user } = useGetUser();
  const buyer_id = user?.user_id || '3';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    allorderlist({ buyer_id }, (res) => {
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
        <Text style={styles.text}><Text style={styles.label}>Qty:</Text> {item.product_quantity}</Text>
        <Text style={styles.text}><Text style={styles.label}>Total:</Text> ₹{item.total_amount}</Text>
        <Text style={styles.text}><Text style={styles.label}>Order Date:</Text> {item.order_date || 'N/A'}</Text>
      </View>
<       Text style={styles.deliveredLabel}>Delivered</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Order History</Text>
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No past orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 28,               // Bigger font
    fontWeight: 'bold',         
    color: '#2e7d32',           // Highlighted green color
    textAlign: 'center',        // Center the title
    marginBottom: 24,
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
  },
  label: {
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
  deliveredLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#27ae60',
    fontWeight: '600',
  },  
});

export default OrderHistory;
