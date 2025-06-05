import React, { useEffect, useState } from 'react';
import {
  Image,View,Text,TextInput,StyleSheet,Alert,
  TouchableOpacity,KeyboardAvoidingView,Platform
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import BASE_URL from '../backend/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import LottieView from 'lottie-react-native';
import "../global.css"

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [loaded] = useFonts({
      Poppins: require('../assets/fonts/Poppins-Medium.ttf'),
    });
  
    useEffect(() => {
      if (loaded) {
        return
      }

      
    }, [loaded]);
  

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('userid', data.userid);
        await AsyncStorage.setItem('username', data.username);

        console.log(data.username)

        const testId= await AsyncStorage.getItem('userid');
        const testUsername= await AsyncStorage.getItem('username');
        console.log('Stored UserName:', testUsername);
         console.log('Stored UserName:', testId);
        console.log(data.access)

         
         if(data.access == 'admin'){
           router.push('/admin/dashboard');
         } else {
          router.push('./user/home');
         }

       
      } else if (response.status === 400) {
        
        Alert.alert('User not verified', data.error || 'Invalid credentials');
        router.push('/registerpage/username');
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
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
      style={{flex: 1}}
    >
      
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
           className="flex-1 justify-center items-center p-5"
          keyboardVerticalOffset={100}
        >
          
          
          <LottieView
                  source={require('../assets/animation/login.json')}
                  autoPlay
                  loop={true}
                 style={{ width: 450, height: 600, marginTop: -150, marginBottom: -60,marginLeft: 20 }}
                />
          
           <Text className='text-center font-bold font-[Poppins] text-4xl mb-2'>Welcome Back!</Text>

          <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          className="w-full border border-gray-300 p-3 mb-4 rounded-xl bg-white text-black font-[Poppins]"
        />


         <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full border border-gray-300 p-3 mb-4 rounded-xl bg-white text-black font-[Poppins]"
        />

        <TouchableOpacity
          onPress={handleLogin}
          
          className="bg-white py-3 px-8 rounded-lg items-center"
        >
          <Text className="text-base font-[Poppins]">Login</Text>
        </TouchableOpacity>

          <TouchableOpacity>
           <Text className="mt-2 self-end text-[15px] font-[Poppins] text-blue-600" onPress={() => router.push('./registerpage/forgotpassword')}>
            Forgot Password?
          </Text>

          </TouchableOpacity>

          <TouchableOpacity>
            <Text className="mt-8 text-[15px] font-[Poppins]" onPress={() => router.push('/registerpage/info')}>
              Don't Have An Account? Register Here
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      
    </LinearGradient>
  );
}
