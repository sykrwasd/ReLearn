import React, { useEffect, useState } from 'react';
import {
  Image,Text,TextInput,StyleSheet,TouchableOpacity,Alert,ScrollView,KeyboardAvoidingView,Platform,Dimensions,View,
  Button,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';



const Email = () => {
  
  const router = useRouter();
  const { username,email,password,firstname,lastname,ic } = useLocalSearchParams();
  const [image, setImage] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);

    

  const [loaded] = useFonts({
          SpaceMono: require('../../assets/fonts/Poppins-Medium.ttf'),
        });
      
        useEffect(() => {
          if (loaded) {
            return
          }
        }, [loaded]);
  
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        } 
      };    

  const uploadImage = async (fileUri: string) => {
  //^^ takes the uri of an image fill kita upload dekat front end

  const fileName = fileUri.split('/').pop(); 
  //^^ split('/') untuk split everytime ada /, and pop() untuk take the last element
  const fileType = fileName?.split('.').pop(); 
  //^^ eg: myphoto.jpg, .spit('.') akan split kalau jumpa ., and pop() the last element untuk dpt extension, in this case, jpg

  const file = { //creates an object representing the file in the format required by FormData
    uri: fileUri,
    type: `image/${fileType}`,
    name: fileName,
  };

  const formData = new FormData(); //creates a new FormData object
  formData.append('file', file as any); //appends the file to the formdata using the field name 'file',as any untuk bypass the typescript type checking issue

  try { //sends everything to the database.js
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log(' Upload successful', response.data);
    return response.data.fileUrl;
  } catch (error) {
    console.error(' Upload failed', error);
    return null;
  }
};



  const handleBack = () => {
    router.back();
  };


  
  const handleNext = async () => {

    setIsLoading(true);

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
        if (!imageUrl) {
          Alert.alert('Error', 'Image upload failed');
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ firstname,lastname,ic,username, email, password,imageUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message);
          router.push('/');
      } else {
        Alert.alert("Error", data.error);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server');
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
    

          <Text style={styles.heading}>Upload your profile pic!</Text>

         
                 <Button title="Pick an image" onPress={pickImage} />
                 {image && <Image source={{ uri: image }} style={styles.image} />}
        </ScrollView>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} style={styles.button} disabled={isLoading}>
                   {isLoading ? 
                   <ActivityIndicator size="small" color="black" /> : 
                   <Text style={styles.buttonText}>Relearn!</Text>}
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
  image: {
    width: 400,
    height: 400,
    borderRadius: 50,
  },
});

export default Email;
