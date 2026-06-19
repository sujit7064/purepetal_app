import React, { useState, useCallback } from 'react';
import {
  Alert, Platform, KeyboardAvoidingView, ScrollView,
  TextInput, TouchableOpacity, View, Text, StyleSheet,
  Image, StatusBar, ActivityIndicator
} from 'react-native';
import { login, signup } from '../env/action';
import {
  sendRegistrationOtp,
  verifyRegistrationOtp,
  sendForgotPasswordOtp,
  resetPassword,
} from '../env/action';
import { useGetUser } from '../contextApi/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── SCREEN STATES ───────────────────────────────────────────────────────────
// 'LOGIN'            → login form
// 'FORGOT_EMAIL'     → enter email for forgot password
// 'FORGOT_OTP'       → enter OTP for forgot password
// 'RESET_PASSWORD'   → enter new password
// 'SIGNUP_EMAIL'     → enter email to start signup
// 'SIGNUP_OTP'       → verify OTP for signup email
// 'SIGNUP_FORM'      → full registration form (name, phone, password)
// ─────────────────────────────────────────────────────────────────────────────

export default function AuthScreen() {
  const { setUser } = useGetUser();
  const [screen, setScreen] = useState('LOGIN');
  const [loading, setLoading] = useState(false);

  // Shared fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Signup full form fields
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Login fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const resetAllFields = () => {
    setEmail(''); setOtp(''); setPassword(''); setConfirmPassword('');
    setName(''); setPhoneNumber(''); setLoginPhone(''); setLoginPassword('');
  };

  // ── 1. LOGIN ───────────────────────────────────────────────────────────────
  const handleLogin = useCallback(() => {
    if (loading) return;
    if (!loginPhone || loginPhone.length !== 10) {
      return Alert.alert('Invalid Input', 'Enter a valid 10-digit phone number');
    }
    if (!loginPassword || loginPassword.length < 6) {
      return Alert.alert('Invalid Input', 'Password must be at least 6 characters');
    }
    setLoading(true);
    login(
      { phone_number: loginPhone, password: loginPassword, email: '', name: '' },
      async (res) => {
        setLoading(false);
        if (res.status === 1) {
          try {
            await AsyncStorage.setItem('userDetails', JSON.stringify(res.data));
            setUser(res.data);
          } catch {
            Alert.alert('Error', 'Failed to save login details');
          }
        } else {
          Alert.alert('Login Failed', res.message || 'Something went wrong');
        }
      }
    );
  }, [loading, loginPhone, loginPassword, setUser]);

  // ── 2. SIGNUP: Send OTP to email ──────────────────────────────────────────
  const handleSendSignupOtp = useCallback(() => {
    if (loading) return;
    if (!email || !email.includes('@')) {
      return Alert.alert('Invalid Input', 'Enter a valid email address');
    }
    setLoading(true);
    sendRegistrationOtp({ email }, (res) => {
      setLoading(false);
      if (res.status === 1) {
        setScreen('SIGNUP_OTP');
      } else {
        Alert.alert('Error', res.message || 'Failed to send OTP');
      }
    });
  }, [loading, email]);

  // ── 3. SIGNUP: Verify OTP ─────────────────────────────────────────────────
  const handleVerifySignupOtp = useCallback(() => {
    if (loading) return;
    if (!otp || otp.length !== 6) {
      return Alert.alert('Invalid Input', 'Enter the 6-digit OTP');
    }
    setLoading(true);
    verifyRegistrationOtp({ email, otp }, (res) => {
      setLoading(false);
      if (res.status === 1) {
        setScreen('SIGNUP_FORM');
      } else {
        Alert.alert('Invalid OTP', res.message || 'OTP verification failed');
      }
    });
  }, [loading, email, otp]);

  // ── 4. SIGNUP: Full Registration ──────────────────────────────────────────
  const handleSignup = useCallback(() => {
    if (loading) return;
    if (!name || name.trim() === '') {
      return Alert.alert('Invalid Input', 'Enter your full name');
    }
    if (!phoneNumber || phoneNumber.length !== 10) {
      return Alert.alert('Invalid Input', 'Enter a valid 10-digit phone number');
    }
    if (!password || password.length < 6) {
      return Alert.alert('Invalid Input', 'Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Invalid Input', 'Passwords do not match');
    }
    setLoading(true);
    signup(
      { name, phone_number: phoneNumber, email, password },
      async (res) => {
        setLoading(false);
        if (res.status === 1) {
          try {
            await AsyncStorage.setItem('userDetails', JSON.stringify(res.data));
            setUser(res.data);
          } catch {
            Alert.alert('Error', 'Failed to save user details');
          }
        } else {
          Alert.alert('Signup Failed', res.message || 'Something went wrong');
        }
      }
    );
  }, [loading, name, phoneNumber, email, password, confirmPassword, setUser]);

  // ── 5. FORGOT: Send OTP to email ──────────────────────────────────────────
  const handleForgotSendOtp = useCallback(() => {
    if (loading) return;
    if (!email || !email.includes('@')) {
      return Alert.alert('Invalid Input', 'Enter a valid email address');
    }
    setLoading(true);
    sendForgotPasswordOtp({ email }, (res) => {
      setLoading(false);
      if (res.status === 1) {
        setScreen('FORGOT_OTP');
      } else {
        Alert.alert('Error', res.message || 'Failed to send OTP');
      }
    });
  }, [loading, email]);

  // ── 6. FORGOT: Verify OTP → show reset form ───────────────────────────────
  const handleForgotVerifyOtp = useCallback(() => {
    if (loading) return;
    if (!otp || otp.length !== 6) {
      return Alert.alert('Invalid Input', 'Enter the 6-digit OTP');
    }
    // Just move to reset screen; actual OTP check happens on reset
    setScreen('RESET_PASSWORD');
  }, [loading, otp]);

  // ── 7. FORGOT: Reset Password ─────────────────────────────────────────────
  const handleResetPassword = useCallback(() => {
    if (loading) return;
    if (!password || password.length < 6) {
      return Alert.alert('Invalid Input', 'Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Invalid Input', 'Passwords do not match');
    }
    setLoading(true);
    resetPassword({ email, otp, password }, (res) => {
      setLoading(false);
      if (res.status === 1) {
        Alert.alert('Success', 'Password reset successful! Please login.', [
          { text: 'OK', onPress: () => { resetAllFields(); setScreen('LOGIN'); } }
        ]);
      } else {
        Alert.alert('Error', res.message || 'Reset failed');
      }
    });
  }, [loading, email, otp, password, confirmPassword]);

  // ─── RENDER HELPERS ───────────────────────────────────────────────────────

  const Logo = () => (
    <View style={styles.logoContainer}>
      <View style={styles.logoCircle}>
        <Image
          source={require('../assets/images/Oraklogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.tagline}>Powered by PurePetal</Text>
    </View>
  );

  const PrimaryButton = ({ label, onPress }) => (
    <TouchableOpacity
      style={[styles.authButton, loading && styles.authButtonDisabled]}
      onPress={onPress}
      disabled={loading}
    >
      {loading
        ? <ActivityIndicator size="small" color="#fff" />
        : <Text style={styles.authButtonText}>{label}</Text>
      }
    </TouchableOpacity>
  );

  const BackLink = ({ label, onPress }) => (
    <TouchableOpacity style={styles.switchButton} onPress={onPress} disabled={loading}>
      <Text style={styles.switchButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  // ─── SCREENS ──────────────────────────────────────────────────────────────

  const renderLogin = () => (
    <>
      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#999"
        value={loginPhone}
        onChangeText={t => setLoginPhone(t.replace(/[^0-9]/g, ''))}
        maxLength={10}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={loginPassword}
        onChangeText={setLoginPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.forgotLink}
        onPress={() => { resetAllFields(); setScreen('FORGOT_EMAIL'); }}
        disabled={loading}
      >
        <Text style={styles.forgotLinkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <PrimaryButton label="Login" onPress={handleLogin} />

      <BackLink
        label="Don't have an account? Sign Up"
        onPress={() => { resetAllFields(); setScreen('SIGNUP_EMAIL'); }}
      />
    </>
  );

  const renderSignupEmail = () => (
    <>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Enter your email to get started</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <PrimaryButton label="Send OTP" onPress={handleSendSignupOtp} />

      <BackLink
        label="Already have an account? Login"
        onPress={() => { resetAllFields(); setScreen('LOGIN'); }}
      />
    </>
  );

  const renderSignupOtp = () => (
    <>
      <Text style={styles.title}>Verify Email</Text>
      <Text style={styles.subtitle}>OTP sent to {email}</Text>

      <TextInput
        style={[styles.input, styles.otpInput]}
        placeholder="Enter 6-digit OTP"
        placeholderTextColor="#999"
        value={otp}
        onChangeText={t => setOtp(t.replace(/[^0-9]/g, ''))}
        maxLength={6}
        keyboardType="number-pad"
      />

      <PrimaryButton label="Verify OTP" onPress={handleVerifySignupOtp} />

      <BackLink
        label="← Change Email"
        onPress={() => { setOtp(''); setScreen('SIGNUP_EMAIL'); }}
      />
    </>
  );

  const renderSignupForm = () => (
    <>
      <Text style={styles.title}>Almost Done!</Text>
      <Text style={styles.subtitle}>Complete your profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#999"
        value={phoneNumber}
        onChangeText={t => setPhoneNumber(t.replace(/[^0-9]/g, ''))}
        maxLength={10}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <PrimaryButton label="Create Account" onPress={handleSignup} />
    </>
  );

  const renderForgotEmail = () => (
    <>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your registered email address</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <PrimaryButton label="Send OTP" onPress={handleForgotSendOtp} />

      <BackLink
        label="← Back to Login"
        onPress={() => { resetAllFields(); setScreen('LOGIN'); }}
      />
    </>
  );

  const renderForgotOtp = () => (
    <>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>OTP sent to {email}</Text>

      <TextInput
        style={[styles.input, styles.otpInput]}
        placeholder="Enter 6-digit OTP"
        placeholderTextColor="#999"
        value={otp}
        onChangeText={t => setOtp(t.replace(/[^0-9]/g, ''))}
        maxLength={6}
        keyboardType="number-pad"
      />

      <PrimaryButton label="Verify OTP" onPress={handleForgotVerifyOtp} />

      <BackLink
        label="← Change Email"
        onPress={() => { setOtp(''); setScreen('FORGOT_EMAIL'); }}
      />
    </>
  );

  const renderResetPassword = () => (
    <>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your new password</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <PrimaryButton label="Reset Password" onPress={handleResetPassword} />
    </>
  );

  const screenMap = {
    LOGIN: renderLogin,
    SIGNUP_EMAIL: renderSignupEmail,
    SIGNUP_OTP: renderSignupOtp,
    SIGNUP_FORM: renderSignupForm,
    FORGOT_EMAIL: renderForgotEmail,
    FORGOT_OTP: renderForgotOtp,
    RESET_PASSWORD: renderResetPassword,
  };

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Logo />
          <View style={styles.formContainer}>
            {screenMap[screen]?.()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },

  // Logo
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#F0F9FF',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3, borderColor: '#00D084',
  },
  logo: { width: 100, height: 100 },
  tagline: { fontSize: 13, color: '#666', fontWeight: '500', letterSpacing: 0.5 },

  // Form
  formContainer: { paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#333' },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24 },

  // Inputs
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15, borderRadius: 10, marginBottom: 15,
    fontSize: 16, color: '#333',
    borderWidth: 1, borderColor: '#e0e0e0',
  },
  otpInput: { textAlign: 'center', fontSize: 22, letterSpacing: 8, fontWeight: 'bold' },

  // Buttons
  authButton: {
    backgroundColor: '#00D084',
    padding: 15, borderRadius: 10,
    alignItems: 'center', marginTop: 10,
    elevation: 2,
    shadowColor: '#00D084', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3,
    minHeight: 50, justifyContent: 'center',
  },
  authButtonDisabled: { backgroundColor: '#99E6C8', opacity: 0.7 },
  authButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  switchButton: { marginTop: 20, alignItems: 'center', paddingVertical: 10 },
  switchButtonText: { color: '#00D084', fontSize: 16, fontWeight: '600' },

  forgotLink: { alignSelf: 'flex-end', marginBottom: 4, paddingVertical: 4 },
  forgotLinkText: { color: '#00D084', fontSize: 14, fontWeight: '600' },
});