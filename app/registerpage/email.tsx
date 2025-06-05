import React, { useEffect, useState } from 'react';
import {
  Image,Text,TextInput,StyleSheet,TouchableOpacity,Alert,ScrollView,KeyboardAvoidingView,Platform,Dimensions,View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import LottieView from 'lottie-react-native';



const Email = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { username,firstname,lastname,ic } = useLocalSearchParams();

  const [loaded] = useFonts({
          SpaceMono: require('../../assets/fonts/Poppins-Medium.ttf'),
        });
      
        useEffect(() => {
          if (loaded) {
            return
          }
        }, [loaded]);
  
      

  

  const handleNext =  async () => {
    
    try {
      const response = await fetch(`${BASE_URL}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email})
      });

      const data = await response.json();

      if(!email){
         Alert.alert("Invalid Email","Please enter you email");
         return
      }
      if (response.ok) {
        
        //Alert.alert('Success', data.message);
        router.push({
        pathname: '/registerpage/password',
        params: { username,email,firstname,lastname,ic },
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
        <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
            <View style={styles.lottieContainer}>
              <LottieView
                source={require('../../assets/animation/email.json')}
                autoPlay
                loop={true}
                style={styles.lottie}
              />
          </View>

          <Text style={styles.heading}>Drop your email here!</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </ScrollView>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText} >Back</Text>
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
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    position: "fixed",
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
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  lottieContainer: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
 
  
},
lottie: {
  width: 500,
  height: 500,
  marginBottom: -25 ,
},

});

export default Email;
