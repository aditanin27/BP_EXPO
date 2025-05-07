// src/components/DatePicker.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ value, onChange, onCancel }) => {
  const [date, setDate] = useState(value || new Date());

  const handleChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    
    // Untuk iOS, biarkan picker tetap terbuka sampai pengguna klik "Done"
    if (Platform.OS === 'android') {
      // Android secara otomatis menutup picker setelah pemilihan
      onChange(currentDate);
    } else {
      setDate(currentDate);
    }
  };

  const handleIOSDone = () => {
    onChange(date);
  };

  return Platform.OS === 'ios' ? (
    <View style={styles.iosContainer}>
      <View style={styles.iosHeader}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.iosButtonText}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleIOSDone}>
          <Text style={styles.iosButtonText}>Selesai</Text>
        </TouchableOpacity>
      </View>
      <RNDateTimePicker
        value={date}
        mode="date"
        display="spinner"
        onChange={handleChange}
        locale="id-ID"
      />
    </View>
  ) : (
    <RNDateTimePicker
      value={date}
      mode="date"
      display="default"
      onChange={handleChange}
      locale="id-ID"
    />
  );
};

const styles = StyleSheet.create({
  iosContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  iosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iosButtonText: {
    color: '#2E86DE',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DatePicker;