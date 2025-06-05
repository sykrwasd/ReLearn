import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import LottieView from 'lottie-react-native';
import BASE_URL from '@/backend/config';

const Email = () => {
  const [email, setEmail] = useState('');
  const [ic, setIC] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const [loaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Medium.ttf'),
  });

  useEffect(() => {
    if (!loaded) return;
  }, [loaded]);

  const handleBack = () => {
    router.back();
  };

  const handleNext = async () => {
  if (newPassword !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/forgotPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        ic,
        newPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert('Success', 'Password updated successfully!');
      router.push('/'); // or any route you want to go next
    } else {
      Alert.alert('Error', data.error || 'Something went wrong');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Unable to connect to the server');
  }
};


  return (
    <LinearGradient
      colors={['#ffffff', '#7DC2FA']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        
          <Text style={styles.heading}>Reset your password.</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="IC No: XXXX-XX-XXX"
            value={ic}
            onChangeText={setIC}
            style={styles.input}
          />

          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            
          />

          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            
          />

          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.button} onPress={handleBack}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Poppins',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 85,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontSize: 16,
  },
});

export default Email;
