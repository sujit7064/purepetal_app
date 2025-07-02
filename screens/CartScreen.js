import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { cartitemlist, cancelcartitem } from '../env/action';
import { useGetUser } from '../contextApi/UserContext';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const CartScreen = () => {
  const { user } = useGetUser();
  const buyer_id = user.user_id;
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (user?.user_id) {
        fetchCart();
       // handleCancelItem(); // ✅ call your fetchCart method when screen is focused
      }
    }, [user?.user_id])
  );

  const fetchCart = () => {
    cartitemlist({ buyer_id }, (response) => {
      if (response?.status === 1) {
        const items = response.data.cart_items || [];
        setCartItems(items);
        if (items.length === 0) {
          setSummary(null); // clear summary when cart is empty
        } else {
          setSummary({
            total_amount: response.data.total_amount,
            delivery_charge: response.data.delivery_charge,
            to_pay: response.data.to_pay,
          });
        }
      } else {
        setCartItems([]);
        setSummary(null);
      }
      setLoading(false); // ✅ Ensure loading is turned off after all logic
    });
  };
  

  const handleCancelItem = (cart_item_id) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          setLoading(true);
          cancelcartitem({ buyer_id, cart_item_id }, (res) => {
            if (res?.status === 1) {
              fetchCart();
            } else {
              Alert.alert('Error', 'Failed to remove item');
              setLoading(false);
            }
          });
        },
      },
    ]);
  };

  const renderItem = (item) => (
    <View style={styles.card} key={item.cart_item_id}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.text}><Text style={styles.label}>Qty:</Text> {item.product_quantity}</Text>
        <Text style={styles.text}><Text style={styles.label}>Price:</Text> ₹{item.product_price}</Text>
        <Text style={styles.text}><Text style={styles.label}>Total:</Text> ₹{item.total_amount}</Text>
        <Text style={styles.text}><Text style={styles.label}>Order:</Text> {item.order_date}</Text>
        <Text style={styles.text}><Text style={styles.label}>Delivery:</Text> {item.delivery_date}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleCancelItem(item.cart_item_id)}
        >
          <Text style={styles.deleteButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSummary = () => {
    if (!summary) return null;
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Price Details</Text>
        <View style={styles.summaryRow}>
          <Text>Total Amount:</Text>
          <Text>₹{summary.total_amount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Delivery Charges:</Text>
          <Text>₹{summary.delivery_charge}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Amount Payable:</Text>
          <Text style={styles.totalLabel}>₹{summary.to_pay}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>No items in cart.</Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
          {cartItems.map(renderItem)}
          {renderSummary()}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => navigation.navigate('ProductScreen')}
            >
              {<Text style={styles.buttonText}>Continue Shopping</Text> }
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() =>
                navigation.navigate('CheckoutScreen', {
                  buyer_id,
                  to_pay: summary.to_pay,
                    total_amount: summary.total_amount,
                    delivery_charge: summary.delivery_charge,
                })
              }
            >
              <Text style={styles.buttonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
  },
  details: {
    flex: 1,
    justifyContent: 'space-around',
  },
  text: {
    fontSize: 14,
    marginVertical: 2,
  },
  label: {
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff5252',
    padding: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  summaryContainer: {
    marginTop: 20,
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  continueButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 6,
  },
  checkoutButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CartScreen;
