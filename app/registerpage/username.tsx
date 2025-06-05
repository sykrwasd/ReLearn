import React, { useEffect, useState } from 'react';
import {
  Text,TextInput,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform,ScrollView,View,Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import LottieView from 'lottie-react-native';

const Username = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { firstname,lastname,ic } = useLocalSearchParams();

  

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

  const handleNext =  async () => {
    
    try {
      const response = await fetch(`${BASE_URL}/username`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username})
      });

      const data = await response.json();

      if(!username){
         Alert.alert("Invalid Username","Please enter you username");
         return
      }
      if (response.ok) {
        
        
        router.push({
      pathname: '/registerpage/email',
      params: { username,firstname,lastname,ic },
    });
        
      }
      else {
        Alert.alert('', data.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server');
      console.error(error);
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
        >
      
          <LottieView
          source={require('../../assets/animation/username.json')}
          autoPlay
          loop={true}
          style={{ width: 900, height: 500, marginBottom: -10, marginTop: -10 }}
          />
 
          <Text style={styles.heading}>What should we call you?</Text>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
          />
        </ScrollView>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 10,
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
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',

  },
});

export default Username;
