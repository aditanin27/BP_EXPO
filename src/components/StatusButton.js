// src/components/StatusButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const StatusButton = ({ status, isSelected, onPress }) => {
  // Get styles based on status
  const getButtonStyle = () => {
    if (!isSelected) {
      return styles.button;
    }
    
    switch (status) {
      case 'Ya':
        return [styles.button, styles.buttonHadir];
      case 'Tidak':
        return [styles.button, styles.buttonTidakHadir];
      case 'Izin':
        return [styles.button, styles.buttonIzin];
      default:
        return styles.button;
    }
  };
  
  const getTextStyle = () => {
    if (!isSelected) {
      return styles.buttonText;
    }
    
    return [styles.buttonText, styles.buttonTextSelected];
  };
  
  // Get button label
  const getLabel = () => {
    switch (status) {
      case 'Ya':
        return 'Hadir';
      case 'Tidak':
        return 'Tidak Hadir';
      case 'Izin':
        return 'Izin';
      default:
        return status;
    }
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
    >
      <Text style={getTextStyle()}>
        {getLabel()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    flex: 1,
    marginHorizontal: 3,
  },
  buttonHadir: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  buttonTidakHadir: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  buttonIzin: {
    backgroundColor: '#f39c12',
    borderColor: '#f39c12',
  },
  buttonText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  buttonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StatusButton;