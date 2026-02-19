import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { addaddress, alladdresslist, proceedtobuy } from '../env/action';
import { useGetUser } from '../contextApi/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleInputChange = (field, value) => {
    setAddressForm({ ...addressForm, [field]: value });
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

  const handleAddAddress = () => {
    if (!addressForm.city || !addressForm.pincode || !addressForm.address) {
      Alert.alert('Validation', 'Please fill required fields');
      return;
    }

    addaddress({ ...addressForm, user_id }, (res) => {
      if (res?.status === 1) {
        fetchAddresses();
        setShowAddressForm(false);
        setAddressForm({
          city: '',
          dist: '',
          state: '',
          pincode: '',
          address: '',
        });
      }
    });
  };

 const handleCODPayment = () => {
  if (!selectedAddressId) {
    Alert.alert('Select address first');
    return;
  }

  const payload = {
    buyer_id: Number(buyer_id),
    address_id: Number(selectedAddressId),
    total_product_amount: Number(total_amount),
    delivery_charges: Number(delivery_charge),
    total_amount: Number(to_pay),
    payment_method: 'cod',
    payment_status: 'paid',
    transaction_id: null,
  };

  console.log('COD Payload:', payload); // debug

  proceedtobuy(payload, (res) => {
    if (res.status === 1) {
      Alert.alert('Order placed successfully');
      navigation.navigate('MainApp');
    } else {
      Alert.alert('Order failed');
    }
  });
};

  const handleRazorpayPayment = () => {
    if (!selectedAddressId) {
      Alert.alert('Select address first');
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

  const renderAddress = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.addressCard,
        selectedAddressId === item.id && styles.selectedAddressCard,
      ]}
      onPress={() => setSelectedAddressId(item.id)}
    >
      <Text style={styles.addressText}>{item.address}</Text>
      <Text style={styles.addressSubText}>
        {item.city}, {item.dist}, {item.state} - {item.pincode}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>

        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAddress}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListHeaderComponent={
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>

              <TouchableOpacity
                style={styles.addAddressBtn}
                onPress={() => setShowAddressForm(!showAddressForm)}
              >
                <Text style={styles.addAddressText}>
                  {showAddressForm ? 'Cancel' : 'Add New Address'}
                </Text>
              </TouchableOpacity>

              {showAddressForm && (
                <View style={styles.formContainer}>
                  <TextInput
                    placeholder="City"
                    style={styles.input}
                    value={addressForm.city}
                    onChangeText={(v) => handleInputChange('city', v)}
                  />
                  <TextInput
                    placeholder="District"
                    style={styles.input}
                    value={addressForm.dist}
                    onChangeText={(v) => handleInputChange('dist', v)}
                  />
                  <TextInput
                    placeholder="State"
                    style={styles.input}
                    value={addressForm.state}
                    onChangeText={(v) => handleInputChange('state', v)}
                  />
                  <TextInput
                    placeholder="Pincode"
                    style={styles.input}
                    keyboardType="number-pad"
                    value={addressForm.pincode}
                    onChangeText={(v) => handleInputChange('pincode', v)}
                  />
                  <TextInput
                    placeholder="Full Address"
                    style={[styles.input, { height: 80 }]}
                    multiline
                    value={addressForm.address}
                    onChangeText={(v) => handleInputChange('address', v)}
                  />

                  <TouchableOpacity style={styles.saveBtn} onPress={handleAddAddress}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          }
          ListFooterComponent={
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Summary</Text>

              <View style={styles.summaryCard}>
                <View style={styles.row}>
                  <Text>Subtotal</Text>
                  <Text>₹{total_amount}</Text>
                </View>

                <View style={styles.row}>
                  <Text>Delivery</Text>
                  <Text>{delivery_charge === 0 ? 'FREE' : `₹${delivery_charge}`}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.totalText}>Total</Text>
                  <Text style={styles.totalText}>₹{to_pay}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.payBtn} onPress={handleRazorpayPayment}>
                <Text style={styles.payText}>Pay Online</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.codBtn} onPress={handleCODPayment}>
                <Text style={styles.payText}>Cash on Delivery</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },

  addAddressBtn: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addAddressText: {
    color: '#3b82f6',
    fontWeight: '600',
  },

  formContainer: {
    backgroundColor: '#ffffff',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },

  saveBtn: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  addressCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  selectedAddressCard: {
    borderColor: '#3b82f6',
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },

  addressText: {
    fontWeight: '600',
  },
  addressSubText: {
    color: '#555',
    marginTop: 4,
  },

  summaryCard: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  totalText: {
    fontWeight: '700',
    fontSize: 16,
  },

  payBtn: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  codBtn: {
    backgroundColor: '#f59e0b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
