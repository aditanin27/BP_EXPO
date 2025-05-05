import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';

const FormButtons = ({ 
  onNext, 
  onBack, 
  nextLabel = 'Lanjut',
  backLabel = 'Kembali',
  showBack = true,
  showNext = true,
  isSubmitting = false
}) => {
  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity 
          style={[styles.button, styles.backButton]}
          onPress={onBack}
          disabled={isSubmitting}
        >
          <Text style={styles.backButtonText}>{backLabel}</Text>
        </TouchableOpacity>
      )}
      
      {showNext && (
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.nextButton,
            isSubmitting && styles.disabledButton
          ]}
          onPress={onNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.nextButtonText}>{nextLabel}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2E86DE',
    marginRight: 10,
  },
  backButtonText: {
    color: '#2E86DE',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#2E86DE',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#a0c4e4',
  },
});

export default FormButtons;