import React, { useState, useContext, useCallback } from 'react';
import { Alert, Platform, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, View, Text, StyleSheet, Image, StatusBar, ActivityIndicator } from 'react-native';
import { login, signup } from '../env/action';
import { useGetUser } from "../contextApi/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useGetUser();

  const handleAuth = useCallback(() => {
    // Prevent multiple submissions
    if (loading) {
      return;
    }

    // Validation
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert('Invalid Input', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Invalid Input', 'Password must be at least 6 characters');
      return;
    }

    if (!isLogin) {
      if (!name || name.trim() === '') {
        Alert.alert('Invalid Input', 'Please enter your name');
        return;
      }
      if (!email || !email.includes('@')) {
        Alert.alert('Invalid Input', 'Please enter a valid email');
        return;
      }
    }

    const authDetails = {
      phone_number: phoneNumber,
      email: isLogin ? '' : email,
      password,
      name: isLogin ? '' : name,
    };

    setLoading(true);

    const callback = async (response) => {
      setLoading(false);
      
      if (response.status === 1) { 
        try {
          await AsyncStorage.setItem("userDetails", JSON.stringify(response.data));
          
          // Set user in context - this will automatically trigger AppNavigator
          // to show MainApp screens instead of Auth screen
          setUser(response.data);
          
          // No need for navigation.replace() - the AppNavigator will handle it
          Alert.alert(
            'Success', 
            isLogin ? 'Login successful!' : 'Account created successfully!'
          );
        } catch (error) {
          console.error('Error saving user details:', error);
          Alert.alert('Error', 'Failed to save login details');
        }
      } else {
        Alert.alert(
          isLogin ? 'Login Failed' : 'Signup Failed', 
          response.message || 'Something went wrong'
        );
      }
    };

    if (isLogin) {
      login(authDetails, callback);
    } else {
      signup(authDetails, callback);
    }
  }, [email, password, name, phoneNumber, isLogin, setUser, loading]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../assets/images/Oraklogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>ORAK</Text>
            <Text style={styles.tagline}>Powered by PurePetal</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </Text>

            {/* Name input - only for signup */}
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}

            {/* Phone Number - always visible */}
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={(text) => {
                // Only allow numbers
                const numericText = text.replace(/[^0-9]/g, '');
                setPhoneNumber(numericText);
              }}
              maxLength={10}
              keyboardType="phone-pad"
            />

            {/* Email - only for signup */}
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            )}

            {/* Password - always visible */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity 
              style={[styles.authButton, loading && styles.authButtonDisabled]} 
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.authButtonText}>
                  {isLogin ? 'Login' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => {
                if (loading) return; // Prevent switching while loading
                setIsLogin(!isLogin);
                // Clear fields when switching
                setEmail('');
                setPassword('');
                setName('');
                setPhoneNumber('');
              }}
              disabled={loading}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#00D084',
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00D084',
    letterSpacing: 3,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  authButton: {
    backgroundColor: '#00D084',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#00D084',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    minHeight: 50,
    justifyContent: 'center',
  },
  authButtonDisabled: {
    backgroundColor: '#99E6C8',
    opacity: 0.7,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchButtonText: {
    color: '#00D084',
    fontSize: 16,
    fontWeight: '600',
  },
});

/*
================================================================================
IMPORTANT: Android Manifest Configuration
================================================================================

To completely fix the screen shaking issue on Android, add this to your
android/app/src/main/AndroidManifest.xml file:

In the <activity> tag for MainActivity, add or modify:

<activity
  android:name=".MainActivity"
  android:windowSoftInputMode="adjustResize"
  ...
>
  ...
</activity>

Change "adjustResize" if you want different behavior:
- adjustResize: Screen resizes to make room for keyboard (RECOMMENDED)
- adjustPan: Screen pans/scrolls to show focused input
- adjustNothing: No adjustment (use with KeyboardAvoidingView)

================================================================================
*/