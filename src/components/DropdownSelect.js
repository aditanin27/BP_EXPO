import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  ActivityIndicator
} from 'react-native';

const DropdownSelect = ({ 
  label, 
  value, 
  options = [], 
  onValueChange, 
  placeholder = 'Pilih...',
  error,
  isLoading = false,
  disabled = false
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Find the selected option's label
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  
  const openModal = () => {
    if (!disabled && !isLoading && options.length > 0) {
      setModalVisible(true);
    }
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };
  
  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
    closeModal();
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleSelect(item.value)}
    >
      <Text style={[
        styles.optionText, 
        item.value === value && styles.selectedOptionText
      ]}>
        {item.label}
      </Text>
      {item.value === value && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          error && styles.errorInput,
          disabled && styles.disabledButton
        ]}
        onPress={openModal}
        disabled={disabled}
      >
        <Text style={[
          styles.dropdownButtonText,
          !selectedOption && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {displayText}
        </Text>
        
        {isLoading ? (
          <ActivityIndicator size="small" color="#2E86DE" />
        ) : (
          <Text style={styles.dropdownIcon}>▼</Text>
        )}
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Pilih Opsi'}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={renderItem}
              style={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#aaa',
  },
  dropdownIcon: {
    fontSize: 14,
    color: '#777',
  },
  errorInput: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  disabledText: {
    color: '#aaa',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 22,
    color: '#999',
    padding: 5,
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#2E86DE',
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 18,
    color: '#2E86DE',
    fontWeight: 'bold',
  },
});

export default DropdownSelect;