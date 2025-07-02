import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { productlist } from '../env/action';
import { useNavigation } from '@react-navigation/native';

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    productlist({}, (data) => {
      if (data.status === 1) {
        setProducts(data.data);
      }
      setLoading(false);
    });
  }, []);

  const handleProductClick = (product) => {
    navigation.navigate('ProductDetailScreen', { product });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Explore Products</Text>
      <View style={styles.gridContainer}>
        {products.length > 0 ? (
          products.map((product) => (
            <TouchableOpacity
              key={product.product_id}
              style={styles.card}
              onPress={() => handleProductClick(product)}
            >
              <Image source={{ uri: product.image }} style={styles.image} />
              <Text style={styles.name} numberOfLines={2}>{product.product_name}</Text>
              <Text style={styles.price}>₹{product.price}</Text>
              <Text style={styles.rating}>⭐ 4.9 (640)</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No products available.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 60) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2d3436',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#ccc',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginTop: 8,
    marginHorizontal: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 4,
    marginHorizontal: 10,
  },
  rating: {
    fontSize: 13,
    color: '#777',
    marginVertical: 8,
    marginHorizontal: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default ProductScreen;
