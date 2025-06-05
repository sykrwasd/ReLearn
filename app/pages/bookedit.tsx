import React, { useState, useEffect, use } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import { SelectList } from 'react-native-dropdown-select-list';
import '../../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';


const BookEdit = () => {
  
  const [showEdit, setShowEdit] = useState(false);

  useFonts({ Poppins: require('../../assets/fonts/Poppins-Medium.ttf') });

  const { bookid } = useLocalSearchParams();
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [faculty, setFaculty] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const router = useRouter();
  const [modalVisible,setModalVisible] = React.useState(false);
  const [status , setStatus] = useState('')
  const [loading, setIsLoading] = useState(false);



  const bookCondition = [
    { label: 'New', value: 'New' },
    { label: 'Like New', value: 'Like New' },
    { label: 'Good', value: 'Good' },
    { label: 'Fair', value: 'Fair' },
  ];

  const bookStatus = [
    { label: 'Available', value: 'Available' },
    { label: 'Reserved', value: 'Reserved' },
    { label: 'Sold', value: 'Sold' },
 
  ];


  const facultyList = [
    { label: 'FSG', value: 'FSG' },
    { label: 'FP', value: 'FP' },
    { label: 'FSKM', value: 'FSKM' },
  ];

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  type Book = {
    _id: number;
    userid: string;
    username: string;
    bookAuthor: string;
    bookTitle: string;
    faculty: string;
    condition: string;
    price: number;
    imageUrl: string;
    availability: string;
  };

  const [books, setBooks] = React.useState<Book | null>(null);

  React.useEffect(() => {
    console.log('book id', bookid?.toString());

    const fetchBookData = async () => {
      const response = await fetch(`${BASE_URL}/getbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookid }),
      });

      const data = await response.json();

      if (response.ok) {
        setBooks(data);

        setBookAuthor(data.bookAuthor);
        setBookTitle(data.bookTitle);
        setFaculty(data.faculty);
        setCondition(data.condition);
        setPrice(data.price);
        setStatus(data.availability)
      } else {
        Alert.alert('Error', data.error || 'Failed to load user data');
      }
    };

    if (bookid) {
      fetchBookData();
    }
  }, [bookid]);

  const updateBook = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/updateBook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookid,
          newBookAuthor: bookAuthor,
          newBookTitle: bookTitle,
          newFaculty: faculty,
          newCondition: condition,
          newPrice: price,
          newAvailability: status
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBooks(data);
        router.back();
        Alert.alert('Success', 'Update Successfully');
      } else {
        Alert.alert('Error', data.error || 'Failed to update book data');
      }
    } catch (error) {}
  };

  const deleteBook = async () => {
   
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/deleteBook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookid
        }),
      });

      const data = await response.json();

      if (response.ok) {
       
        router.back();
        
        Alert.alert('Deleted', 'Book Deleted');
      } else {
        Alert.alert('Error', data.error || 'Failed to update book data');
      }
    } catch (error) {}

    setModalVisible(false)

  }


  return (
     <SafeAreaView style={{ flex: 1 }}>
    <LinearGradient
      colors={['#ffffff', '#7DC2FA']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{flex:1}}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
         style={{flex:1}}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingTop: 0 }}
          keyboardShouldPersistTaps="handled"
        >
    
        </ScrollView>


        <View className="absolute top-8 left-5">
            <TouchableOpacity onPress={router.back} className="bg-white py-2 px-4 rounded-lg shadow">
                         <Text className="text-black font-semibold">Back</Text>
            </TouchableOpacity>
          </View>


        {!showEdit && books && (
          <>
            <Image
              className="mt-[-370px] self-center mb-4 w-[250px] h-[250px] rounded-xl"
              source={{ uri: books.imageUrl }}
            />

            <View className="flex-1 items-center">
              <View>
                <Text className="text-black font-bold text-xl text-center mb-2">
                  {books.bookTitle}
                </Text>
                <Text className="text-black italic text-center text-lg mb-2">
                  by {books.bookAuthor}
                </Text>
              </View>

              <TextInput
                className="w-[90%] bg-white text-black rounded-xl p-3 mb-4 self-center font-medium"
                value={`Condition: ${books.condition}`}
                editable={false}
              />
              <TextInput
                className="w-[90%] bg-white text-black rounded-xl p-3 mb-4 self-center font-medium"
                value={`Faculty: ${books.faculty}`}
                editable={false}
              />
              <TextInput
                className="w-[90%] bg-white text-black rounded-xl p-3 mb-4 self-center font-medium"
                value={`Price : RM ${books.price}`}
                editable={false}
              />
              <TextInput
                className="w-[90%] bg-white text-black rounded-xl p-3 mb-4 self-center font-medium"
                value={`Seller : ${books.username}`}
                editable={false}
              />

              <TouchableOpacity
                className="bg-white py-2 px-8 rounded-lg self-center w-[30%] mb-2"
                onPress={() => setShowEdit(true)}
              >
                <Text className="text-center text-base font-medium">Edit</Text>
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

        {showEdit && books && (
          <>
            <Image
              className="mt-[-370px] self-center mb-4 w-[300px] h-[300px] rounded-xl"
              source={{ uri: books.imageUrl }}
            />

            <View className="flex-1 items-center">
              <TextInput
                className="w-[90%] bg-white text-black rounded-xl p-3 mb-4 self-center font-medium"
                value={bookAuthor}
                onChangeText={setBookAuthor}
                placeholder="Author"
              />
              <TextInput
                className="w-[90%] bg-white text-black rounded-xl p-3 mb-4 self-center font-medium"
                value={bookTitle}
                onChangeText={setBookTitle}
                placeholder="Title"
              />

              <SelectList
                data={bookCondition}
                setSelected={setCondition}
                save="value"
                boxStyles={{ borderRadius: 10, backgroundColor: 'white', paddingHorizontal: 10, marginBottom: 15, width: '90%', alignSelf: 'center' }}
                placeholder="Condition"
                defaultOption={{ key: condition, value: condition }}
              />

              <SelectList
                data={facultyList}
                setSelected={setFaculty}
                save="value"
                boxStyles={{ borderRadius: 10, backgroundColor: 'white', paddingHorizontal: 10, marginBottom: 15, width: '90%', alignSelf: 'center' }}
                placeholder="Faculty"
                defaultOption={{ key: faculty, value: faculty }}
              />

              <TextInput
                className="w-[90%] bg-white text-black rounded-xl p-3 mb-4 self-center font-medium"
                value={price.toString()}
                onChangeText={setPrice}
                placeholder="Price"
                keyboardType="numeric"
              />

              
              <SelectList
                data={bookStatus}
                setSelected={setStatus}
                save="value"
                boxStyles={{ borderRadius: 10, backgroundColor: 'white', paddingHorizontal: 10, marginBottom: 15, width: '90%', alignSelf: 'center' }}
                placeholder="Condition"
                defaultOption={{ key: status, value: status }}
              />

              <TouchableOpacity
                className=" py-2 px-8 rounded-lg self-center w-[30%] bg-lime-400"
                onPress={updateBook}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-base text-center font-medium">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

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
                onPress={deleteBook}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-base text-center font-medium">Delete</Text>
                )}
              </TouchableOpacity>
              
              </View>
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </LinearGradient>
    

    </SafeAreaView>
  )}

export default BookEdit;