import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser, resetAuthError } from '../../redux/slices/authSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
      dispatch(resetAuthError());
    }
  }, [error, dispatch]);

  const validateInputs = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = () => {
    if (validateInputs()) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <LoadingOverlay />}
      
      <View style={styles.logoContainer}>
        {/* <Image 
          source={require('../../../assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <Text style={styles.title}>Berbagi Pendidikan</Text>
        <Text style={styles.subtitle}>Admin Shelter Portal</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          error={emailError}
        />
        
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          error={passwordError}
        />
        
        <Button
          title="Login"
          onPress={handleLogin}
          isLoading={isLoading}
          style={styles.loginButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButton: {
    marginTop: 15,
  },
});

export default LoginScreen;