import React, { useState, useContext, useCallback } from 'react';
import { Alert, Platform, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { login, signup } from '../env/action';
//import { UserContext } from '../contextApi/UserContext';
 import { useGetUser } from "../contextApi/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { setUser } = useGetUser();

  const handleAuth = useCallback(() => {
    const authDetails = {
      phone_number: phoneNumber,
      email: isLogin ? '' : email, // Include email only for signup
      password,
      name: isLogin ? '' : name, // Send name only for signup
    };

    const callback = async(response) => {
      if (response.status === 1) { 
        await AsyncStorage.setItem("userDetails", JSON.stringify(response.data));
        setUser(response.data);
        // Handle success message
        navigation.replace('MainApp'); // Navigate after successful login/signup
      } else {
        Alert.alert('Login Failed', response.message || 'Something went wrong');
      }
    };

    if (isLogin) {
      login(authDetails, callback); // Call login API
    } else {
      signup(authDetails, callback); // Call signup API
    }
  }, [email, password, name, phoneNumber, isLogin, setUser, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled" // Prevents the keyboard from hiding when tapping outside
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')} // Your logo image
            style={styles.logo}
          />
          <Text style={styles.appName}>PURE PETAL</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </Text>

          {/* Name input field appears only during signup */}
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
            keyboardType="phone-pad"
          />

          {/* Email input field appears only during signup */}
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
            <Text style={styles.authButtonText}>
              {isLogin ? 'Login' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)} // Switch between login and signup
          >
            <Text style={styles.switchButtonText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#2ecc71',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#2ecc71',
    fontSize: 16,
  },
});
