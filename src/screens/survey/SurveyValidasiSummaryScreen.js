import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchValidationSummary, resetSurveyValidasiState } from '../../redux/slices/surveyValidasiSlice';
import Button from '../../components/Button';

const SurveyValidasiSummaryScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { summary, isLoadingSummary, error } = useAppSelector(state => state.surveyValidasi);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load summary data when component mounts
  useEffect(() => {
    loadSummaryData();
  }, []);
  
  // Handle error
  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(resetSurveyValidasiState());
    }
  }, [error]);
  
  // Load summary data function
  const loadSummaryData = () => {
    dispatch(fetchValidationSummary());
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadSummaryData();
    setRefreshing(false);
  };
  
  // Handle navigation to validation list
  const handleViewValidationList = () => {
    navigation.navigate('SurveyValidasiList');
  };
  
  // Calculate percentage for progress bar
  const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return (value / total) * 100;
  };
  
  // Render progress bar
  const renderProgressBar = (value, total, color) => {
    const percentage = calculatePercentage(value, total);
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ringkasan Validasi</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadSummaryData}
          disabled={isLoadingSummary}
        >
          {isLoadingSummary ? (
            <ActivityIndicator size="small" color="#2E86DE" />
          ) : (
            <Text style={styles.refreshButtonText}>⟳</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2E86DE']}
          />
        }
      >
        {/* Main Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Status Validasi</Text>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalNumber}>{summary?.total || 0}</Text>
            <Text style={styles.totalLabel}>Total Survey</Text>
          </View>
          
          {/* Pending */}
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Menunggu Validasi</Text>
              <Text style={[styles.statValue, { color: '#f39c12' }]}>{summary?.pending || 0}</Text>
            </View>
            {renderProgressBar(summary?.pending || 0, summary?.total || 0, '#f39c12')}
          </View>
          
          {/* Layak */}
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Layak</Text>
              <Text style={[styles.statValue, { color: '#27ae60' }]}>{summary?.layak || 0}</Text>
            </View>
            {renderProgressBar(summary?.layak || 0, summary?.total || 0, '#27ae60')}
          </View>
          
          {/* Tidak Layak */}
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Tidak Layak</Text>
              <Text style={[styles.statValue, { color: '#e74c3c' }]}>{summary?.tidak_layak || 0}</Text>
            </View>
            {renderProgressBar(summary?.tidak_layak || 0, summary?.total || 0, '#e74c3c')}
          </View>
          
          {/* Tambah Kelayakan */}
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Tambah Kelayakan</Text>
              <Text style={[styles.statValue, { color: '#3498db' }]}>{summary?.tambah_kelayakan || 0}</Text>
            </View>
            {renderProgressBar(summary?.tambah_kelayakan || 0, summary?.total || 0, '#3498db')}
          </View>
        </View>
        
        {/* Actions Card */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Tindakan</Text>
          
          {summary?.pending > 0 ? (
            <View style={styles.actionInfo}>
              <Image 
                source={require('../../../assets/icon.png')} 
                style={styles.actionIcon}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>
                Terdapat <Text style={styles.actionHighlight}>{summary.pending}</Text> survey yang menunggu validasi
              </Text>
            </View>
          ) : (
            <View style={styles.actionInfo}>
              <Image 
                source={require('../../../assets/icon.png')} 
                style={styles.actionIcon}
                resizeMode="contain"
              />
              <Text style={styles.actionText}>
                Semua survey telah divalidasi
              </Text>
            </View>
          )}
          
          <Button
            title="Lihat Daftar Validasi"
            onPress={handleViewValidationList}
            style={styles.viewButton}
          />
        </View>
        
        {/* Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Informasi</Text>
          <Text style={styles.infoText}>
            • Survey yang berstatus "Layak" akan otomatis mengubah status CPB anak menjadi "CPB".
          </Text>
          <Text style={styles.infoText}>
            • Survey yang berstatus "Tidak Layak" tidak akan mengubah status anak.
          </Text>
          <Text style={styles.infoText}>
            • Survey dengan status "Tambah Kelayakan" adalah survey yang sebelumnya tidak layak dan telah diubah menjadi layak.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 20,
    color: '#2E86DE',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  statItem: {
    marginBottom: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  actionHighlight: {
    fontWeight: 'bold',
    color: '#f39c12',
  },
  viewButton: {
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

export default SurveyValidasiSummaryScreen;