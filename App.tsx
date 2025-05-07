import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

// Password validation schema
const passwordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(8, 'Must be at least 8 characters')
    .max(20, 'Must be at most 20 characters')
    .required('Required'),
});

export default function App() {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [options, setOptions] = useState({
    lowerCase: true,
    upperCase: false,
    numbers: false,
    symbols: false,
  });

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const createPassword = (chars: string, length: number): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * chars.length);
      result += chars.charAt(index);
    }
    return result;
  };

  const generatePassword = (length: number) => {
    let characterPool = '';
    const sets = {
      upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowerCase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+[]{}|;:,.<>?',
    };

    Object.keys(options).forEach((key) => {
      if (options[key as keyof typeof options]) {
        characterPool += sets[key as keyof typeof sets];
      }
    });

    if (!characterPool) {
      Alert.alert('Error', 'Select at least one character set.');
      return;
    }

    const pwd = createPassword(characterPool, length);
    setGeneratedPassword(pwd);
    setHasGenerated(true);
    Alert.alert('Success', 'Password generated!');
  };

  const resetForm = (resetFormik: () => void) => {
    resetFormik();
    setOptions({ lowerCase: true, upperCase: false, numbers: false, symbols: false });
    setGeneratedPassword('');
    setHasGenerated(false);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.title}>🔐 Password Generator</Text>

        <Formik
          initialValues={{ passwordLength: '' }}
          validationSchema={passwordSchema}
          onSubmit={(values) => generatePassword(Number(values.passwordLength))}
        >
          {({
            values,
            errors,
            touched,
            isValid,
            handleChange,
            handleSubmit,
            handleReset,
          }) => (
            <>
              {/* Password Length Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password Length</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter a number (8-20)"
                  keyboardType="numeric"
                  value={values.passwordLength}
                  onChangeText={handleChange('passwordLength')}
                />
                {touched.passwordLength && errors.passwordLength && (
                  <Text style={styles.errorText}>{errors.passwordLength}</Text>
                )}
              </View>

              {/* Character Options */}
              <View style={styles.optionsGroup}>
                <BouncyCheckbox
                  text="Include Lowercase"
                  isChecked={options.lowerCase}
                  onPress={() => toggleOption('lowerCase')}
                  fillColor="#0A84FF"
                  textStyle={styles.checkboxText}
                />
                <BouncyCheckbox
                  text="Include Uppercase"
                  isChecked={options.upperCase}
                  onPress={() => toggleOption('upperCase')}
                  fillColor="#0A84FF"
                  textStyle={styles.checkboxText}
                />
                <BouncyCheckbox
                  text="Include Numbers"
                  isChecked={options.numbers}
                  onPress={() => toggleOption('numbers')}
                  fillColor="#0A84FF"
                  textStyle={styles.checkboxText}
                />
                <BouncyCheckbox
                  text="Include Symbols"
                  isChecked={options.symbols}
                  onPress={() => toggleOption('symbols')}
                  fillColor="#0A84FF"
                  textStyle={styles.checkboxText}
                />
              </View>

              {/* Display Result */}
              {hasGenerated && (
                <View style={styles.resultBox}>
                  <Text style={styles.resultLabel}>Generated Password</Text>
                  <Text selectable style={styles.resultText}>{generatedPassword}</Text>
                </View>
              )}

              {/* Buttons */}
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.button, !isValid && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={!isValid}
                >
                  <Text style={styles.buttonText}>Generate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.resetButton]}
                  onPress={() => resetForm(handleReset)}
                >
                  <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F4F7',
    flexGrow: 1,
  },
  innerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 4,
  },
  optionsGroup: {
    marginBottom: 20,
  },
  checkboxText: {
    textDecorationLine: 'none',
    fontSize: 15,
    color: '#333',
  },
  resultBox: {
    padding: 15,
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    marginBottom: 20,
  },
  resultLabel: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1E3A8A',
    marginBottom: 6,
  },
  resultText: {
    fontSize: 18,
    color: '#0A84FF',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#0A84FF',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#64748B',
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
