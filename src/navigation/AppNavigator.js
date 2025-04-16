import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getToken } from '../utils/storage';
import { setCredentials } from '../redux/slices/authSlice';
import LoadingOverlay from '../components/LoadingOverlay';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
// Anak screens
import ChildrenListScreen from '../screens/children/ChildrenListScreen';
import ChildDetailScreen from '../screens/children/ChildDetailScreen';
import ChildFormScreen from '../screens/children/ChildFormScreen';

import { STORAGE_TOKEN_KEY } from '../utils/constants';
import { api } from '../api';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await getToken();
        
        if (token) {
          // Get profile data to validate token
          const profileData = await api.getProfile();
          if (profileData.success) {
            dispatch(setCredentials({
              user: profileData.user,
              adminShelter: profileData.admin_shelter,
              token: token,
            }));
          }
        }
      } catch (error) {
        console.log('Error loading token or profile:', error);
        await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
      } finally {
        setIsReady(true);
      }
    };

    loadToken();
  }, [dispatch]);

  if (!isReady) {
    return <LoadingOverlay />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            {/* Anak screens */}
            <Stack.Screen 
              name="ChildrenList" 
              component={ChildrenListScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="ChildDetail" 
              component={ChildDetailScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="AddChild" 
              component={ChildFormScreen}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="EditChild" 
              component={ChildFormScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;