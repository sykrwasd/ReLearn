  import { LinearGradient } from "expo-linear-gradient";
  import {
    Text,StyleSheet,View,Image,Alert,ScrollView,RefreshControl,TouchableOpacity,
    Modal,
    Button,
  } from "react-native";
  import { Card, TextInput } from "react-native-paper";
  import React, { use, useEffect, useState } from "react";
  import useAuth from "../hooks/useAuth";
  import BASE_URL from "@/backend/config";
  import { useFonts } from "expo-font";
  import { router } from "expo-router";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import axios from "axios";
  import * as ImagePicker from 'expo-image-picker';
  import { ActivityIndicator } from "react-native";

  export default function Settings() {
    const [loaded] = useFonts({
      Poppins: require("../../assets/fonts/Poppins-Medium.ttf"),
    });
    
    
    
    useEffect(() => {
      if (!loaded) return;
    }, [loaded]);
    
    const [refreshing, setRefreshing] = React.useState(false);
    const [modalVisible,setModalVisible] = React.useState(false);
    const [showEdit,setShowEdit] = useState(false)
    const [user, setUser] = useState<User | null>(null);
    const { username, userid, loading } = useAuth();
    const [newUsername,setNewUsername] = useState('')
    const [newEmail, setNewEmail] =useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    
    
      const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);

    
    type User = {
      userid: string;
      firstname: string;
      lastname: string;
      ic: string;
      username: string;
      email: string;
      imageUrl: string;
    };

  


    useEffect(() => {
      if (loading || !username) return;

      const fetchUserData = async () => {
        try {
          const response = await fetch(`${BASE_URL}/profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid }),
          });

          const data = await response.json();

          if (response.ok) {
            setUser(data.userdata);
            setNewEmail(data.userdata.email)
            setNewUsername(data.userdata.username)
          } else {
            Alert.alert("Error", data.error || "Failed to load user data");
          }
        } catch (error) {
          Alert.alert("Network Error");
          console.error("Fetch failed:", error);
        }
      };

      fetchUserData();
    }, [loading, userid,refreshing]);

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


    const updateUser = async () => {

      setIsLoading(true)
      try {
        let imageUrl = null;
        if (image) {
          imageUrl = await uploadImage(image);
          if (!imageUrl) {
            Alert.alert('Error', 'Image upload failed');
            return;
          }
        }

        const response = await fetch(`${BASE_URL}/updateProfile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userid,
            newUsername,
            imageUrl,
            }),

        });

        const data = await response.json();

        if (response.ok) {
          setUser(data); 
          router.back()
          setIsLoading(false)
          Alert.alert("Success", "Update Succesfully");
        } else {
          Alert.alert("Error", data.error || "Failed to update user data");
        }

      } catch (err) {
        Alert.alert('Error', 'Could not connect to server');
      }

      setShowEdit(false)
    
    };
    const deleteProfile = async () => {
    
      try {
        const response = await fetch(`${BASE_URL}/deleteProfile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userid
          }),
        });

        const data = await response.json();

        if (response.ok) {
        
          router.replace('/');
          Alert.alert('Deleted', 'User Deleted,Thank you..');
        } else {
          Alert.alert('Error', data.error || 'Failed to update book data');
        }
      } catch (error) {}

      setModalVisible(false)

    }

    const logout = () => {
      Alert.alert("Log Out", "See you later")
      AsyncStorage.clear(); //logout
      router.replace('/')
    }
    const handleBack = () => {
      router.back();
    };


    return (
      <LinearGradient
        colors={["#ffffff", "#7DC2FA"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }>

                <View style={styles.topButtons}>
                        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                          <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
              
                      </View>
            <View style={styles.container}>
              {!showEdit && user && (
                <>
                <Image
              style={styles.profileImage}
              source={{uri : user.imageUrl}}
              />

              
                
              <View style={styles.userInfo}>
                <TextInput
                  placeholder="Username"
                  style={styles.input}
                  value={"Username: " + user.username}
                  editable={false}
                  className="text-center"
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={"Email: " + user.email}
                  editable={false}
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={"First Name: " + user.firstname}
                  editable={false}
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={"Last Name: " +  user.lastname}
                  editable={false}
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={"IC No: " +  user.ic}
                  editable={false}
                />


              <TouchableOpacity
                className="bg-white py-2 px-8 rounded-lg self-center w-[30%] mb-2"
                onPress={() => setShowEdit(true)}
              >
                <Text className="text-center text-base font-medium">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className=" py-2 px-8 rounded-lg self-center w-[30%] bg-red-300 mb-2"
                onPress={logout}
              >
                <Text className="text-center font-medium " style={{color: 'white'}}>Log out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className=" py-2 px-8 rounded-lg self-center w-[30%] bg-red-300"
                onPress={()=>setModalVisible(true)}
              >
                <Text className="text-center font-medium " style={{color: 'white'}}>Delete</Text>
              </TouchableOpacity>
              </View>
            </>
            )}

            {showEdit && user && (
                <>
                        
            <Button title="Pick an image" onPress={pickImage} />
                  {image && <Image source={{ uri: image }} />}
                          <Image
                      style={styles.profileImage}
                      source={{uri : image || user.imageUrl}}
                      />

              
                
              <View style={styles.userInfo}>
                <TextInput
                  placeholder="Username"
                  style={styles.input}
                  value={newUsername}
                  onChangeText={setNewUsername}
                />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={user.email}
                 editable={false}
                 className="bg-gray-400"
                />
                <TextInput
                  placeholder="First Name"
                  style={styles.input}
                  value={user.firstname}
                  editable={false}
                   className="bg-gray-400"
                />
                <TextInput
                  placeholder="Last Name"
                  style={styles.input}
                  value={user.lastname}
                  editable={false}
                   className="bg-gray-400"
                />
                <TextInput
                  placeholder="IC No"
                  style={styles.input}
                  value={user.ic}
                  editable={false}
                   className="bg-gray-400"
                />
              </View>

                <TouchableOpacity
                  className="bg-lime-400 py-2 px-8 rounded-lg self-center w-[30%] mb-2"
                  onPress={updateUser}
                  disabled={isLoading}  // disable button while loading
                  style={{ opacity: isLoading ? 0.6 : 1 }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-center text-gray-500 text-base font-medium">Save</Text>
                  )}
                </TouchableOpacity>


            </>
            )}

          </View>

        
            <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => setModalVisible(false)}
                    >
                      <View className="flex-1  justify-center items-center bg-black/50">
                        <View className="w-[80%] p-6 bg-white rounded-2xl shadow-lg items-center space-y-4">
                          <Text className="text-lg font-semibold text-gray-800">Are you sure you want to delete?</Text>
                          <View className='flex-row gap-2'>
            
                          <TouchableOpacity
                            className="py-2 px-8 rounded-lg bg-lime-400 mt-5"
                            onPress={() => setModalVisible(false)}
                          >
                            <Text className="text-black text-base font-medium" >Close</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="py-2 px-8 rounded-lg bg-red-400 mt-5"
                            onPress={deleteProfile}
                          >
                            <Text className="text-white text-base font-medium" >Delete</Text>
                          </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
        

        </ScrollView>
      </LinearGradient>
    );
  }

  const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    },
    scrollContainer: {
      padding: 20,
    },
    container: {
      flex:1,
      alignItems: "center",
      marginTop: "50%",
      marginBottom: 20,
    },
    profileImage: {
      width: 170,
      height: 170,
      borderRadius: 50,
      marginBottom: 20,
    },
    userInfo: {
      width: "100%",
      alignItems: "center",
    },
    input: {
      width: "90%",
      marginBottom: 10,
      borderRadius: 10,
      backgroundColor: "white",
      color: "black",
      fontFamily: "Poppins",
      height:30,
    },
    sectionTitle: {
      fontSize: 24,
      fontFamily: "Poppins",
      fontWeight: "600",
      marginBottom: 15,
      textAlign: "center",
      textDecorationLine: 'underline'
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    buttonText: {
      fontFamily: 'Poppins-Medium',
      fontSize: 16,
      textAlign: 'center',
    },
    actionButton:{
      backgroundColor: 'white',
      paddingVertical: 10,
      paddingHorizontal: 32,
      borderRadius: 8,
      alignSelf: 'center',
      textAlign: 'center',
      width: '30%'
    },
    topButtons: {
      position: 'absolute',
      marginTop: 50,
      top: 15,
      left: 0,
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
  });
