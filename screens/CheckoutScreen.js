import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { addaddress, alladdresslist } from '../env/action';
import { useGetUser } from '../contextApi/UserContext';

const CheckoutScreen = () => {
  const { user } = useGetUser();
  const user_id = user.user_id;

  const route = useRoute();
  const navigation = useNavigation();
  const { buyer_id, to_pay, total_amount, delivery_charge } = route.params;

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    city: '',
    dist: '',
    state: '',
    pincode: '',
    address: '',
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleInputChange = (field, value) => {
    setAddressForm({ ...addressForm, [field]: value });
  };

  const handleAddAddress = () => {
    if (!addressForm.city || !addressForm.pincode || !addressForm.address) {
      Alert.alert('Validation', 'Please fill in all required fields.');
      return;
    }

    addaddress({ ...addressForm, user_id }, (res) => {
      if (res?.status === 1) {
        Alert.alert('Success', 'Address added successfully!');
        fetchAddresses();
        setAddressForm({ city: '', dist: '', state: '', pincode: '', address: '' });
        setShowAddressForm(false);
      } else {
        Alert.alert('Error', 'Failed to add address');
      }
    });
  };

  const fetchAddresses = () => {
    alladdresslist({ user_id }, (res) => {
      if (res?.status === 1) {
        setAddresses(res.data.address);
      }
    });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handlePayment = () => {
    if (!selectedAddressId) {
      Alert.alert('Required', 'Please select an address to proceed.');
      return;
    }

    navigation.navigate('RazorpayWebView', {
      amount: to_pay * 100,
      email: user.email,
      contact: user.phone_number,
      buyer_id,
      selected_address_id: selectedAddressId,
      total_amount,
      delivery_charge,
      to_pay,
    });
  };

  return (
    <FlatList
      data={addresses}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Text style={styles.pageTitle}>🛒 Checkout</Text>

          <Text style={styles.title}>Your Addresses</Text>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowAddressForm(!showAddressForm)}
          >
            <Text style={styles.toggleButtonText}>
              {showAddressForm ? 'Cancel' : '➕ Add New Address'}
            </Text>
          </TouchableOpacity>

          {showAddressForm && (
            <View style={styles.formCard}>
              <TextInput
                placeholder="City"
                style={styles.input}
                value={addressForm.city}
                onChangeText={(val) => handleInputChange('city', val)}
              />
              <TextInput
                placeholder="District"
                style={styles.input}
                value={addressForm.dist}
                onChangeText={(val) => handleInputChange('dist', val)}
              />
              <TextInput
                placeholder="State"
                style={styles.input}
                value={addressForm.state}
                onChangeText={(val) => handleInputChange('state', val)}
              />
              <TextInput
                placeholder="Pincode"
                style={styles.input}
                keyboardType="number-pad"
                value={addressForm.pincode}
                onChangeText={(val) => handleInputChange('pincode', val)}
              />
              <TextInput
                placeholder="Address"
                style={styles.input}
                value={addressForm.address}
                onChangeText={(val) => handleInputChange('address', val)}
              />

              <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
                <Text style={styles.addButtonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.addressCard,
            selectedAddressId === item.id && styles.selectedCard,
          ]}
          onPress={() => setSelectedAddressId(item.id)}
        >
          <Text style={styles.addressText}>
            {item.address}, {item.city}, {item.dist}, {item.state} - {item.pincode}
          </Text>
        </TouchableOpacity>
      )}
      ListFooterComponent={
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Price Summary</Text>
            <View style={styles.summaryRow}>
              <Text>Total Amount</Text>
              <Text>₹{total_amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Delivery Charge</Text>
              <Text>₹{delivery_charge}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ fontWeight: 'bold' }}>To Pay</Text>
              <Text style={{ fontWeight: 'bold' }}>₹{to_pay}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </>
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f6ff', // ✅ Light blue background (not boring white)
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#007bff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    marginTop: 12,
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  toggleButton: {
    marginVertical: 14,
    backgroundColor: '#e0ebff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  addressCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    backgroundColor: '#fff',
  },
  selectedCard: {
    borderColor: '#28a745',
    backgroundColor: '#e8ffe8',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  summaryCard: {
    backgroundColor: '#eaf0f6',
    padding: 16,
    borderRadius: 10,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  payButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
  },
  payButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  formCard: {
    marginTop: 10,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
});

export default CheckoutScreen;
