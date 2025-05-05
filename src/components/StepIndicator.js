import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StepIndicator = ({ currentStep, totalSteps }) => {
  // Generate array of step numbers
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <View style={styles.container}>
      {/* Steps and lines */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            {/* Step Circle */}
            <View 
              style={[
                styles.stepCircle,
                currentStep >= step ? styles.activeStep : styles.inactiveStep,
                currentStep === step ? styles.currentStep : null
              ]}
            >
              <Text 
                style={[
                  styles.stepText,
                  currentStep >= step ? styles.activeStepText : styles.inactiveStepText
                ]}
              >
                {step}
              </Text>
            </View>
            
            {/* Connector Line (except after last step) */}
            {index < totalSteps - 1 && (
              <View 
                style={[
                  styles.line,
                  currentStep > step ? styles.activeLine : styles.inactiveLine
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
      
      {/* Step labels */}
      <View style={styles.labelsContainer}>
        <Text style={[styles.stepLabel, currentStep === 1 && styles.currentLabel]}>
          Keluarga
        </Text>
        <Text style={[styles.stepLabel, currentStep === 2 && styles.currentLabel]}>
          Pendidikan
        </Text>
        <Text style={[styles.stepLabel, currentStep === 3 && styles.currentLabel]}>
          Anak
        </Text>
        <Text style={[styles.stepLabel, currentStep === 4 && styles.currentLabel]}>
          Ayah
        </Text>
        <Text style={[styles.stepLabel, currentStep === 5 && styles.currentLabel]}>
          Ibu & Wali
        </Text>
        <Text style={[styles.stepLabel, currentStep === 6 && styles.currentLabel]}>
          Review
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    zIndex: 1,
  },
  activeStep: {
    backgroundColor: '#2E86DE',
    borderColor: '#2E86DE',
  },
  inactiveStep: {
    backgroundColor: 'white',
    borderColor: '#ccc',
  },
  currentStep: {
    borderColor: '#2E86DE',
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeStepText: {
    color: 'white',
  },
  inactiveStepText: {
    color: '#999',
  },
  line: {
    flex: 1,
    height: 3,
    marginHorizontal: -5,
  },
  activeLine: {
    backgroundColor: '#2E86DE',
  },
  inactiveLine: {
    backgroundColor: '#ccc',
  },
  stepLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    width: 50,
  },
  currentLabel: {
    color: '#2E86DE',
    fontWeight: 'bold',
  },
});

export default StepIndicator;