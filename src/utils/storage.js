import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_TOKEN_KEY } from './constants';

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};