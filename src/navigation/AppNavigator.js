import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setCredentials } from '../redux/slices/authSlice';
import { getToken } from '../utils/storage';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
// Anak screens
import DetailAnakScreen from '../screens/anak/DetailAnakScreen';
import ListAnakScreen from '../screens/anak/ListAnakScreen';


// New Anak Detail Menu Screens
import HistoriDetailScreen from '../screens/anak/HistoriDetailScreen';
import HistoriFormScreen from '../screens/anak/HistoriFormScreen';
import CeritaScreen from '../screens/anak/menuAnakScreens/CeritaScreen';
import InformasiAnakScreen from '../screens/anak/menuAnakScreens/InformasiAnakScreen';
import NilaiAnakScreen from '../screens/anak/menuAnakScreens/NilaiAnakScreen';
import PrestasiScreen from '../screens/anak/menuAnakScreens/PrestasiScreen';
import RaporShelterScreen from '../screens/anak/menuAnakScreens/RaporShelterScreen';
import RaportDetailScreen from '../screens/anak/menuAnakScreens/RaportDetailScreen';
import RaportScreen from '../screens/anak/menuAnakScreens/RaportScreen';
import RiwayatScreen from '../screens/anak/menuAnakScreens/RiwayatScreen';
import SuratScreen from '../screens/anak/menuAnakScreens/SuratScreen';
import PrestasiDetailScreen from '../screens/anak/PrestasiDetailScreen';
import PrestasiFormScreen from '../screens/anak/PrestasiFormScreen';
import RaportFormScreen from '../screens/anak/RaportFormScreen';
import SuratAbFormScreen from '../screens/anak/SuratAbFormScreen';
import SuratDetailScreen from '../screens/anak/SuratDetailScreen';

// Tutor screens
import FormTutorScreen from '../screens/tutor/FormTutorScreen';
import TutorDetailScreen from '../screens/tutor/TutorDetailScreen';
import TutorListScreen from '../screens/tutor/TutorListScreen';

//Kelompok screen
import AnakKelompokScreen from '../screens/kelompok/AnakKelompokScreen';
import DetailKelompokScreen from '../screens/kelompok/DetailKelompokScreen';
import FormKelompokScreen from '../screens/kelompok/FormKelompokScreen';
import KelompokListScreen from '../screens/kelompok/KelompokListScreen';
import TambahAnakKelompokScreen from '../screens/kelompok/TambahAnakKelompokScreen';

//Keluarga Screen
import TambahKeluargaScreen from '../screens/keluarga/formKeluarga/TambahKeluargaScreen';
import KeluargaDetailScreen from '../screens/keluarga/KeluargaDetailScreen';
import KeluargaFormSelectionScreen from '../screens/keluarga/KeluargaFormSelectionScreen';
import KeluargaListScreen from '../screens/keluarga/KeluargaListScreen';
import PengajuanAnakFormScreen from '../screens/keluarga/PengajuanAnakFormScreen';
import PengajuanAnakScreen from '../screens/keluarga/PengajuanAnakScreen';
//Aktvitas Screen

import { authApi } from '../api';
import { STORAGE_TOKEN_KEY } from '../utils/constants';
import AktivitasListScreen from '../screens/aktivitas/AktivitasListScreen';
import AktivitasDetailScreen from '../screens/aktivitas/AktivitasDetailScreen';
import AktivitasFormScreen from '../screens/aktivitas/AktivitasFormScreen';
import FotoAktivitasScreen from '../screens/aktivitas/FotoAktivitasScreen';
import AbsenScreen from '../screens/aktivitas/AbsenScreen';

// Survey Screen
import SurveyListScreen from '../screens/survey/SurveyListScreen';
import SurveyFormScreen from '../screens/survey/SurveyFormScreen';
import SurveyDetailScreen from '../screens/survey/SurveyDetailScreen';
import SurveyValidasiListScreen from '../screens/survey/SurveyValidasiListScreen';
import SurveyValidasiFormScreen from '../screens/survey/SurveyValidasiFormScreen';
import SurveyValidasiSummaryScreen from '../screens/survey/SurveyValidasiSummaryScreen';

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
          const profileData = await authApi.getProfile();
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
              name="ListAnak" 
              component={ListAnakScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="DetailAnak" 
              component={DetailAnakScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
           
           
           
            <Stack.Screen 
              name="InformasiAnak" 
              component={InformasiAnakScreen}
              options={{
                animation: 'slide_from_right',
                title: 'Informasi Anak',
              }}
            />
            <Stack.Screen 
              name="Raport" 
              component={RaportScreen}
              options={{
                animation: 'slide_from_right',
                title: 'Raport',
              }}
            />
            <Stack.Screen 
              name="RaportDetail" 
              component={RaportDetailScreen}
              options={{
                animation: 'slide_from_right',
                title: 'Detail Raport',
              }}
            />
            <Stack.Screen 
  name="TambahRaport" 
  component={RaportFormScreen}
  options={{
    animation: 'slide_from_bottom',
    title: 'Tambah Raport',
  }}
/>


<Stack.Screen 
  name="Prestasi" 
  component={PrestasiScreen}
  options={{
    animation: 'slide_from_right',
    title: 'Prestasi',
  }}
/>
<Stack.Screen 
  name="PrestasiDetail" 
  component={PrestasiDetailScreen}
  options={{
    animation: 'slide_from_right',
    title: 'Detail Prestasi',
  }}
/>
<Stack.Screen 
  name="TambahPrestasi" 
  component={PrestasiFormScreen}
  options={{
    animation: 'slide_from_bottom',
    title: 'Tambah Prestasi',
  }}
/>
<Stack.Screen 
  name="EditPrestasi" 
  component={PrestasiFormScreen}
  options={{
    animation: 'slide_from_right',
    title: 'Edit Prestasi',
  }}
/>  

            <Stack.Screen 
              name="Riwayat" 
              component={RiwayatScreen}
              options={{
                animation: 'slide_from_right',
                title: 'Riwayat',
              }}
            />
            <Stack.Screen 
              name="Cerita" 
              component={CeritaScreen}
              options={{
                animation: 'slide_from_right',
                title: 'Cerita',
              }}
            />
            <Stack.Screen 
              name="NilaiAnak" 
              component={NilaiAnakScreen}
              options={{
                animation: 'slide_from_right',
                title: 'Nilai Anak',
              }}
            />
            <Stack.Screen 
              name="RaporShelter" 
              component={RaporShelterScreen}
              options={{
                animation: 'slide_from_right',
                title: 'Rapor Shelter',
              }}
            />
           
            <Stack.Screen 
              name="TutorList" 
              component={TutorListScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="TutorDetail" 
              component={TutorDetailScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
  name="FormTutor" 
  component={FormTutorScreen}
  options={{
    animation: 'slide_from_bottom',
    title: 'Form Tutor',
  }}
/>
             {/* Kelompok Routes */}
  <Stack.Screen 
    name="KelompokList" 
    component={KelompokListScreen}
    options={{
      animation: 'slide_from_right',
      headerShown: false
    }}
  />
  <Stack.Screen 
    name="DetailKelompok" 
    component={DetailKelompokScreen}
    options={{
      animation: 'slide_from_right',
      headerShown: false
    }}
  />
  <Stack.Screen 
    name="FormKelompok" 
    component={FormKelompokScreen}
    options={{
      animation: 'slide_from_bottom',
      headerShown: false
    }}
  />
  <Stack.Screen 
    name="AnakKelompok" 
    component={AnakKelompokScreen}
    options={{
      animation: 'slide_from_right',
      headerShown: false
    }}
  />
  <Stack.Screen 
    name="TambahAnakKelompok" 
    component={TambahAnakKelompokScreen}
    options={{
      animation: 'slide_from_right',
      headerShown: false
    }}
  />
            <Stack.Screen 
              name="Surat" 
              component={SuratScreen}
              options={{
                animation: 'slide_from_right',
                title: 'Surat',
              }}
            />
            <Stack.Screen 
              name="SuratDetail" 
              component={SuratDetailScreen}
              options={{
                animation: 'slide_from_right',
                title: 'Detail Surat',
              }}
            />
            <Stack.Screen 
              name="TambahSurat" 
              component={SuratAbFormScreen}
              options={{
                animation: 'slide_from_bottom',
                title: 'Tambah Surat',
              }}
            />
             <Stack.Screen 
    name="HistoriDetail" 
    component={HistoriDetailScreen}
    options={{
      animation: 'slide_from_right',
      title: 'Detail Riwayat',
    }}
  />
  <Stack.Screen 
    name="TambahHistori" 
    component={HistoriFormScreen}
    options={{
      animation: 'slide_from_bottom',
      title: 'Tambah Riwayat',
    }}
  />
  <Stack.Screen 
    name="EditHistori" 
    component={HistoriFormScreen}
    options={{
      animation: 'slide_from_right',
      title: 'Edit Riwayat',
    }}
  />
  {/* Rute-rute Keluarga */}
  <Stack.Screen 
  name="KeluargaList" 
  component={KeluargaListScreen}
  options={{
    animation: 'slide_from_right',
  }}
/>
<Stack.Screen 
  name="KeluargaDetail" 
  component={KeluargaDetailScreen}
  options={{
    animation: 'slide_from_right',
  }}
/>
<Stack.Screen 
  name="KeluargaFormSelection" 
  component={KeluargaFormSelectionScreen}
  options={{
    animation: 'slide_from_right',
  }}
/>
<Stack.Screen 
  name="TambahKeluarga" 
  component={TambahKeluargaScreen}
  options={{
    animation: 'slide_from_right',
  }}
/>
<Stack.Screen 
  name="EditKeluarga" 
  component={TambahKeluargaScreen}
  options={{
    animation: 'slide_from_right',
  }}
/>
<Stack.Screen 
  name="PengajuanAnak" 
  component={PengajuanAnakScreen}
  options={{
    animation: 'slide_from_right',
  }}
/>
<Stack.Screen 
  name="PengajuanAnakForm" 
  component={PengajuanAnakFormScreen}
  options={{
    animation: 'slide_from_right',
  }}
/>
{/* Rute-rute Aktivitas */}
<Stack.Screen 
  name="AktivitasList" 
  component={AktivitasListScreen}
  options={{
    animation: 'slide_from_right',
    headerShown: false
  }}
/>
<Stack.Screen 
  name="AktivitasDetail" 
  component={AktivitasDetailScreen}
  options={{
    animation: 'slide_from_right',
    headerShown: false
  }}
/>
<Stack.Screen 
  name="AktivitasForm" 
  component={AktivitasFormScreen}
  options={{
    animation: 'slide_from_bottom',
    headerShown: false
  }}
/>
<Stack.Screen 
  name="FotoAktivitas" 
  component={FotoAktivitasScreen}
  options={{
    animation: 'slide_from_right',
    headerShown: false
  }}
/>
<Stack.Screen 
  name="Absen" 
  component={AbsenScreen}
  options={{
    animation: 'slide_from_right',
    headerShown: false
  }}
/> 

<Stack.Screen 
  name="SurveyList" 
  component={SurveyListScreen}
  options={{
    animation: 'slide_from_right',
    headerShown: false
  }}
/>
<Stack.Screen 
  name="SurveyForm" 
  component={SurveyFormScreen}
  options={{
    animation: 'slide_from_right',
    headerShown: false
  }}
/>
<Stack.Screen 
  name="SurveyDetail" 
  component={SurveyDetailScreen}
  options={{
    animation: 'slide_from_right',
    headerShown: false
  }}
/>

<Stack.Screen 
  name="SurveyValidasiSummary" 
  component={SurveyValidasiSummaryScreen}
  options={{
    animation: 'slide_from_right',
    headerShown: false
  }}
/>
<Stack.Screen 
  name="SurveyValidasiList" 
  component={SurveyValidasiListScreen}
  options={{
    animation: 'slide_from_right',
    headerShown: false
  }}
/>
<Stack.Screen 
  name="SurveyValidasiForm" 
  component={SurveyValidasiFormScreen}
  options={{
    animation: 'slide_from_right',
    headerShown: false
  }}
/>

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;