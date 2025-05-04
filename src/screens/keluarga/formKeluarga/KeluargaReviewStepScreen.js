import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { 
  prevStep,
  goToStep
} from '../../../redux/slices/keluargaSlice';
import FormButtons from '../../../components/FormButtons';
import Button from '../../../components/Button';

const KeluargaReviewStepScreen = ({ onSubmit }) => {
  const dispatch = useAppDispatch();
  const { formData, isLoading } = useAppSelector((state) => state.keluarga);
  
  // Handler for back button
  const handleBack = () => {
    dispatch(prevStep());
  };
  
  // Handler for editing a specific section
  const handleEditSection = (stepNumber) => {
    dispatch(goToStep(stepNumber));
  };
  
  // Helper function to render a section header with edit button
  const renderSectionHeader = (title, stepNumber) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => handleEditSection(stepNumber)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Helper function to render info row
  const renderInfo = (label, value, isHighlighted = false) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[
        styles.infoValue, 
        isHighlighted && styles.highlightedValue
      ]}>
        {value || '-'}
      </Text>
    </View>
  );
  
  // Render parent status badge
  const renderStatusBadge = (status) => {
    let badgeStyle = styles.statusYatim;
    let textStyle = styles.statusYatimText;
    
    switch(status) {
      case 'yatim':
        badgeStyle = styles.statusYatim;
        textStyle = styles.statusYatimText;
        break;
      case 'piatu':
        badgeStyle = styles.statusPiatu;
        textStyle = styles.statusPiatuText;
        break;
      case 'yatim piatu':
        badgeStyle = styles.statusYatimPiatu;
        textStyle = styles.statusYatimPiatuText;
        break;
      case 'dhuafa':
        badgeStyle = styles.statusDhuafa;
        textStyle = styles.statusDhuafaText;
        break;
      case 'non dhuafa':
        badgeStyle = styles.statusNonDhuafa;
        textStyle = styles.statusNonDhuafaText;
        break;
      default:
        break;
    }
    
    return (
      <View style={[styles.statusBadge, badgeStyle]}>
        <Text style={[styles.statusText, textStyle]}>{status}</Text>
      </View>
    );
  };
  
  // Helper function to format income range
  const formatIncome = (income) => {
    if (!income) return '-';
    
    const incomeMap = {
      'dibawah_500k': 'Di bawah Rp 500.000',
      '500k_1500k': 'Rp 500.000 - Rp 1.500.000',
      '1500k_2500k': 'Rp 1.500.000 - Rp 2.500.000',
      '2500k_3500k': 'Rp 2.500.000 - Rp 3.500.000',
      '3500k_5000k': 'Rp 3.500.000 - Rp 5.000.000',
      '5000k_7000k': 'Rp 5.000.000 - Rp 7.000.000',
      '7000k_10000k': 'Rp 7.000.000 - Rp 10.000.000',
      'diatas_10000k': 'Di atas Rp 10.000.000'
    };
    
    return incomeMap[income] || income;
  };
  
  // Helper function to format education level
  const formatEducation = (level) => {
    if (!level) return '-';
    
    const educationMap = {
      'belum_sd': 'Belum Sekolah',
      'sd': 'SD / Sederajat',
      'smp': 'SMP / Sederajat',
      'sma': 'SMA / Sederajat',
      'perguruan_tinggi': 'Perguruan Tinggi'
    };
    
    return educationMap[level] || level;
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Review Data Keluarga</Text>
      <Text style={styles.subtitle}>
        Silakan periksa kembali semua data sebelum menyimpan
      </Text>
      
      {/* Family Information Section */}
      <View style={styles.sectionContainer}>
        {renderSectionHeader('Informasi Keluarga', 1)}
        <View style={styles.infoContainer}>
          <View style={styles.statusContainer}>
            {renderStatusBadge(formData.keluarga.status_ortu)}
          </View>
          {renderInfo('Nomor KK', formData.keluarga.no_kk, true)}
          {renderInfo('Kepala Keluarga', formData.keluarga.kepala_keluarga, true)}
          
          <View style={styles.divider} />
          
          {renderInfo('Kantor Cabang', formData.keluarga.id_kacab)}
          {renderInfo('Wilayah Binaan', formData.keluarga.id_wilbin)}
          {renderInfo('Shelter', formData.keluarga.id_shelter)}
          
          {formData.keluarga.bank_choice === 'yes' && (
            <>
              <View style={styles.divider} />
              {renderInfo('Bank', formData.keluarga.id_bank)}
              {renderInfo('Nomor Rekening', formData.keluarga.no_rek)}
              {renderInfo('Atas Nama', formData.keluarga.an_rek)}
            </>
          )}
          
          {formData.keluarga.telp_choice === 'yes' && (
            <>
              <View style={styles.divider} />
              {renderInfo('Nomor Telepon', formData.keluarga.no_tlp)}
              {renderInfo('Atas Nama', formData.keluarga.an_tlp)}
            </>
          )}
        </View>
      </View>
      
      {/* Education Information Section */}
      <View style={styles.sectionContainer}>
        {renderSectionHeader('Informasi Pendidikan', 2)}
        <View style={styles.infoContainer}>
          {renderInfo('Jenjang Pendidikan', formatEducation(formData.anakPendidikan.jenjang), true)}
          
          {(['sd', 'smp', 'sma'].includes(formData.anakPendidikan.jenjang)) && (
            <>
              {renderInfo('Kelas', formData.anakPendidikan.kelas)}
              {renderInfo('Nama Sekolah', formData.anakPendidikan.nama_sekolah)}
              {renderInfo('Alamat Sekolah', formData.anakPendidikan.alamat_sekolah)}
            </>
          )}
          
          {formData.anakPendidikan.jenjang === 'perguruan_tinggi' && (
            <>
              {renderInfo('Nama Perguruan Tinggi', formData.anakPendidikan.nama_pt)}
              {renderInfo('Jurusan', formData.anakPendidikan.jurusan)}
              {renderInfo('Semester', formData.anakPendidikan.semester)}
              {renderInfo('Alamat Perguruan Tinggi', formData.anakPendidikan.alamat_pt)}
            </>
          )}
        </View>
      </View>
      
      {/* Child Information Section */}
      <View style={styles.sectionContainer}>
        {renderSectionHeader('Informasi Anak', 3)}
        <View style={styles.infoContainer}>
          {/* Child Photo */}
          {formData.anak.foto && (
            <View style={styles.photoContainer}>
              <Image 
                source={{ uri: formData.anak.foto.uri }} 
                style={styles.photo}
              />
            </View>
          )}
          
          {renderInfo('NIK', formData.anak.nik_anak)}
          {renderInfo('Nama Lengkap', formData.anak.full_name, true)}
          {renderInfo('Nama Panggilan', formData.anak.nick_name)}
          {renderInfo('Anak ke', `${formData.anak.anak_ke} dari ${formData.anak.dari_bersaudara} bersaudara`)}
          {renderInfo('Tempat, Tanggal Lahir', `${formData.anak.tempat_lahir}, ${formData.anak.tanggal_lahir}`)}
          {renderInfo('Jenis Kelamin', formData.anak.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan')}
          {renderInfo('Agama', formData.anak.agama)}
          {renderInfo('Tinggal Bersama', formData.anak.tinggal_bersama)}
          
          <View style={styles.divider} />
          
          {renderInfo('Jenis Anak Binaan', formData.anak.jenis_anak_binaan)}
          {renderInfo('Hafalan', formData.anak.hafalan)}
          {formData.anak.pelajaran_favorit && renderInfo('Pelajaran Favorit', formData.anak.pelajaran_favorit)}
          {formData.anak.hobi && renderInfo('Hobi', formData.anak.hobi)}
          {formData.anak.prestasi && renderInfo('Prestasi', formData.anak.prestasi)}
          {formData.anak.jarak_rumah && renderInfo('Jarak Rumah', `${formData.anak.jarak_rumah} km`)}
          {renderInfo('Transportasi', formData.anak.transportasi)}
        </View>
      </View>
      
      {/* Father Information Section */}
      <View style={styles.sectionContainer}>
        {renderSectionHeader('Informasi Ayah', 4)}
        <View style={styles.infoContainer}>
          {formData.keluarga.status_ortu === 'yatim' || formData.keluarga.status_ortu === 'yatim piatu' ? (
            <Text style={styles.notApplicableText}>
              Data ayah tidak diperlukan karena status orangtua {formData.keluarga.status_ortu}.
            </Text>
          ) : (
            <>
              {formData.ayah.nik_ayah && renderInfo('NIK', formData.ayah.nik_ayah)}
              {renderInfo('Nama Ayah', formData.ayah.nama_ayah, true)}
              {formData.ayah.agama_ayah && renderInfo('Agama', formData.ayah.agama_ayah)}
              
              {(formData.ayah.tempat_lahir_ayah && formData.ayah.tanggal_lahir_ayah) && 
                renderInfo('Tempat, Tanggal Lahir', 
                  `${formData.ayah.tempat_lahir_ayah}, ${formData.ayah.tanggal_lahir_ayah}`)
              }
              
              {formData.ayah.alamat_ayah && renderInfo('Alamat', formData.ayah.alamat_ayah)}
              {formData.ayah.penghasilan_ayah && 
                renderInfo('Penghasilan', formatIncome(formData.ayah.penghasilan_ayah))
              }
              
              {(formData.ayah.tanggal_kematian_ayah && formData.ayah.penyebab_kematian_ayah) && (
                <>
                  <View style={styles.divider} />
                  {renderInfo('Tanggal Kematian', formData.ayah.tanggal_kematian_ayah)}
                  {renderInfo('Penyebab Kematian', formData.ayah.penyebab_kematian_ayah)}
                </>
              )}
            </>
          )}
        </View>
      </View>
      
      {/* Mother & Guardian Information Section */}
      <View style={styles.sectionContainer}>
        {renderSectionHeader('Informasi Ibu & Wali', 5)}
        <View style={styles.infoContainer}>
          {/* Mother Section */}
          {formData.keluarga.status_ortu === 'piatu' || formData.keluarga.status_ortu === 'yatim piatu' ? (
            <Text style={styles.notApplicableText}>
              Data ibu tidak diperlukan karena status orangtua {formData.keluarga.status_ortu}.
            </Text>
          ) : (
            <>
              <Text style={styles.subSection}>Data Ibu</Text>
              {formData.ibu.nik_ibu && renderInfo('NIK', formData.ibu.nik_ibu)}
              {renderInfo('Nama Ibu', formData.ibu.nama_ibu, true)}
              {formData.ibu.agama_ibu && renderInfo('Agama', formData.ibu.agama_ibu)}
              
              {(formData.ibu.tempat_lahir_ibu && formData.ibu.tanggal_lahir_ibu) && 
                renderInfo('Tempat, Tanggal Lahir', 
                  `${formData.ibu.tempat_lahir_ibu}, ${formData.ibu.tanggal_lahir_ibu}`)
              }
              
              {formData.ibu.alamat_ibu && renderInfo('Alamat', formData.ibu.alamat_ibu)}
              {formData.ibu.penghasilan_ibu && 
                renderInfo('Penghasilan', formatIncome(formData.ibu.penghasilan_ibu))
              }
              
              {(formData.ibu.tanggal_kematian_ibu && formData.ibu.penyebab_kematian_ibu) && (
                <>
                  <View style={styles.divider} />
                  {renderInfo('Tanggal Kematian', formData.ibu.tanggal_kematian_ibu)}
                  {renderInfo('Penyebab Kematian', formData.ibu.penyebab_kematian_ibu)}
                </>
              )}
            </>
          )}
          
          {/* Guardian Section */}
          {formData.wali.nama_wali && (
            <>
              <View style={styles.divider} />
              <Text style={styles.subSection}>Data Wali</Text>
              {formData.wali.nik_wali && renderInfo('NIK', formData.wali.nik_wali)}
              {renderInfo('Nama Wali', formData.wali.nama_wali, true)}
              {renderInfo('Hubungan Kerabat', formData.wali.hub_kerabat_wali)}
              {formData.wali.agama_wali && renderInfo('Agama', formData.wali.agama_wali)}
              
              {(formData.wali.tempat_lahir_wali && formData.wali.tanggal_lahir_wali) && 
                renderInfo('Tempat, Tanggal Lahir', 
                  `${formData.wali.tempat_lahir_wali}, ${formData.wali.tanggal_lahir_wali}`)
              }
              
              {formData.wali.alamat_wali && renderInfo('Alamat', formData.wali.alamat_wali)}
              {formData.wali.penghasilan_wali && 
                renderInfo('Penghasilan', formatIncome(formData.wali.penghasilan_wali))
              }
            </>
          )}
        </View>
      </View>
      
      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button
          title="Simpan Data Keluarga"
          onPress={onSubmit}
          isLoading={isLoading}
          style={styles.submitButton}
        />
        <Text style={styles.noteText}>
          Pastikan semua data sudah benar sebelum menyimpan
        </Text>
      </View>
      
      {/* Navigation Buttons */}
      <FormButtons
        onNext={onSubmit}
        onBack={handleBack}
        nextLabel="Simpan"
        isSubmitting={isLoading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E86DE',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f7ff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#2E86DE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    flex: 2,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 3,
    fontSize: 14,
    color: '#333',
  },
  highlightedValue: {
    fontWeight: 'bold',
    color: '#2E86DE',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2E86DE',
  },
  statusContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusYatim: {
    backgroundColor: '#fff0e6',
  },
  statusYatimText: {
    color: '#ff6b00',
  },
  statusPiatu: {
    backgroundColor: '#e6f7ff',
  },
  statusPiatuText: {
    color: '#0091ff',
  },
  statusYatimPiatu: {
    backgroundColor: '#ffe6ef',
  },
  statusYatimPiatuText: {
    color: '#ff2d55',
  },
  statusDhuafa: {
    backgroundColor: '#e6f9e6',
  },
  statusDhuafaText: {
    color: '#28a745',
  },
  statusNonDhuafa: {
    backgroundColor: '#f0f0f0',
  },
  statusNonDhuafaText: {
    color: '#666666',
  },
  notApplicableText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
  subSection: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
  },
  submitContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#28a745',
  },
  noteText: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default KeluargaReviewStepScreen;