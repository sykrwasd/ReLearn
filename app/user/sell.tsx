import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { SetStateAction, use, useEffect, useState } from "react";
import { SelectList } from 'react-native-dropdown-select-list';
import { Button, Image, StyleSheet, TextInput, TouchableOpacity, Text, Alert,KeyboardAvoidingView, Platform } from "react-native";
import useAuth from '../hooks/useAuth';
import BASE_URL from "@/backend/config";
import axios from 'axios';
import { useFonts } from "expo-font";
import { ActivityIndicator } from "react-native";


export default function SellPage() {

  const [loaded] = useFonts({
          Poppins: require('../../assets/fonts/Poppins-Medium.ttf'),
        });
      
        useEffect(() => {
          if (loaded) {
            return
          }
        }, [loaded]);
  
  const [image, setImage] = useState<string | null>(null);
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [faculty, setFaculty] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 
  const bookCondition = [
    { label: 'New', value: 'New' },
    { label: 'Like New', value: 'Like New' },
    { label: 'Good', value: 'Good' },
    { label: 'Fair', value: 'Fair' },
  ];

  const facultyList = [
    { label: 'FSG', value: 'FSG' },
    { label: 'FP', value: 'FP' },
    { label: 'FSKM', value: 'FSKM' },
    { label: 'Other', value: 'Other'}
  ];

  const { username, userid } = useAuth();

  // Function for picking image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    /**
     * launchImageLibraryAsync return bende ni (contoh)
     * 
      {
        canceled: false,
        assets: [
          {
            uri: 'file:///path/to/image.jpg',
            width: 800,
            height: 600,
            fileSize: 123456,
            type: 'image',
            fileName: 'image.jpg'
          }
        ]
        }
     */

    if (!result.canceled) {
      setImage(result.assets[0].uri); //set the image as the assest's uri
    } 
  };

  /**
   * 
   A Blob (Binary Large Object) is a data type used to represent raw binary data in the form of files or other large, unstructured data in web development. It allows you to handle file-like data, such as images, audio, video, or any large data chunks that might not be in a simple textual format.
  
  Key Characteristics of a Blob:
  Binary Data: Blobs represent data in binary form, which is often required for files like images or videos.
  
  Immutable: Once created, the data inside a Blob is immutable, meaning it cannot be changed after creation. You would create a new Blob if you need to modify the data.
  
  Not Directly Accessible: A Blob doesn't have methods for directly accessing its contents. Instead, you would use methods to read the contents, such as converting it into a text, image, or another format (e.g., using FileReader or URL.createObjectURL).
  
  Common Use Cases:
  File Uploads: When working with file uploads (e.g., images, PDFs), you can use Blobs to handle binary file data.
  
  Downloading Files: You can use Blobs for creating downloadable files dynamically within the browser.
  
  Canvas and Image Manipulation: In the context of images, you can turn a canvas or image into a Blob to upload or save it.
   */
  // Function to upload the image

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
    return response.data.fileUrl; //returns http://
  } catch (error) {
    console.error(' Upload failed', error);
    return null;
  }
};





  const sell = async () => {
    if (!bookAuthor || !bookTitle || !faculty || !condition || !price) {
      Alert.alert("All Fields Required");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image); //call balik function uploadImage and pass image as parameter
        if (!imageUrl) {
          Alert.alert('Error', 'Image upload failed');
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`${BASE_URL}/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid,
          username,
          bookAuthor,
          bookTitle,
          faculty,
          condition,
          price,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", data.message);

        setBookAuthor('');
        setBookTitle('');
        setFaculty('');
        setCondition('');
        setPrice('');
        setImage(null);
        setIsLoading(false);
        
      } else {
        Alert.alert("Error", data.error);
        
        setBookAuthor('');
        setBookTitle('');
        setFaculty('');
        setCondition('');
        setPrice('');
        setImage(null);
        setIsLoading(false);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#7DC2FA']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={{ height: '100%' }}>
       <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={styles.container}
                  keyboardVerticalOffset={100}
                >
      
        <Button title="Pick an image" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={styles.image} />}

        
        <TextInput
          placeholder="Book Author"
          value={bookAuthor}
          onChangeText={setBookAuthor}
          style={styles.input}
        />

        <TextInput
          placeholder="Book Title"
          value={bookTitle}
          onChangeText={setBookTitle}
          style={styles.input}
        />

        <SelectList 
          setSelected={(val: SetStateAction<string>) => setFaculty(val)} 
          data={facultyList} 
          save="value"
          boxStyles={styles.input}
          placeholder="Faculty"
        />

        <SelectList 
          setSelected={(val: SetStateAction<string>) => setCondition(val)} 
          data={bookCondition} 
          save="value"
          boxStyles={styles.input}
          placeholder="Condition"
        />

        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
        />

        <TouchableOpacity onPress={sell} style={styles.button} disabled={isLoading}>
          {isLoading ? 
          <ActivityIndicator size="small" color="black" /> : 
          <Text style={styles.buttonText}>Sell Now!</Text>}
        </TouchableOpacity>
     
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Poppins-Medium',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
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
  },
});

