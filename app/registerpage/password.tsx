import React, { useEffect, useState } from 'react';
import { Image, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import LottieView from 'lottie-react-native';

const Password = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
   const { username,email,firstname,lastname,ic } = useLocalSearchParams();

  const [loaded] = useFonts({
          SpaceMono: require('../../assets/fonts/Poppins-Medium.ttf'),
        });
      
        useEffect(() => {
          if (loaded) {
            return
          }
        }, [loaded]);

 
  const handleBack = () => {
   router.back();
  };

  const handleNext = async () => {
      if (password !== confirmPassword) { // check sama ke tidak password
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      else {
          router.push({
          pathname: '/registerpage/profilepic',
          params: { username,email,password,firstname,lastname,ic },
          });
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
          <LottieView
                    source={require('../../assets/animation/password.json')}
                    autoPlay
                    loop={true}
                    speed={2.3}
                    style={{ width: 700, height: 400, marginBottom: 20, marginTop: -10 }}
                    />
           
          
          <Text style={styles.heading}>Lock your password now!</Text>

          <TextInput 
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry 
          />

          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.button} onPress={handleBack}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next!</Text>
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
    position: 'relative',
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
    fontFamily: 'Poppins-Medium',
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
    fontFamily: 'Poppins-Medium',
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
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});

export default Password;
