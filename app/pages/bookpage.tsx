import React, { useState, useEffect } from 'react';
import { Image, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, View, Alert, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import LottieView from 'lottie-react-native';
import { Rating } from 'react-native-ratings';
import useAuth from '../hooks/useAuth';
import '../../global.css';

const Bookpage = () => {
  const { username, userid } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [sellerid, setSellerid] = useState('');

  const [loaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Medium.ttf'),
  });

  useEffect(() => { if (!loaded) return; }, [loaded]);

  const { bookid } = useLocalSearchParams();
  const router = useRouter();

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

  const [books, setBooks] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBookData = async () => {
      const response = await fetch(`${BASE_URL}/getbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookid }),
      });

      const data = await response.json();

      if (response.ok) {
        setBooks(data);
        console.log(data.userid)
      } else {
        Alert.alert("Error", data.error || "Failed to load book data");
      }
    };

    if (bookid) fetchBookData();
  }, [bookid]);

  const showModal = () => setModalVisible(true);
  const hideModal = () => {
    setModalVisible(false);
    setShowImage(false);
    setShowRating(false);
  };

  const addFeedback = async () => {
    
    console.log(bookid,userid)
    if (!review.trim()) 
      setReview("No Review");

    if (!books) {
    Alert.alert("Error", "Book data is not loaded.");
    return;
  }

    const response = await fetch(`${BASE_URL}/addFeedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid, review, rating, username, bookid, sellerid: books.username })
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert("Success", data.message);
      router.back();
    } else {
      Alert.alert("Error", data.error);
    }

    hideModal();
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#7DC2FA']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{flex : 1}}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100} className="flex-1">
        <ScrollView keyboardShouldPersistTaps="handled" className="flex-1">
          <View className="absolute top-14 left-5">
            <TouchableOpacity onPress={router.back} className="bg-white py-2 px-4 rounded-lg shadow">
              <Text className="text-black font-semibold">Back</Text>
            </TouchableOpacity>
          </View>

          {books && (
            <View className='mt-[25%]'>
              <Image
                source={{ uri: books.imageUrl }}
                className="mt-5 self-center mb-4 w-72 h-72 rounded-xl"
              />

              <View className="px-5">
                <Text className="text-black font-bold text-lg text-center font-sans ">{books.bookTitle}</Text>
                <Text className="text-black italic text-center text-base mb-3 font-sans">by {books.bookAuthor}</Text>

                <TextInput value={`Condition: ${books.condition}`} editable={false} className="bg-white text-black rounded-xl p-3 mb-2 font-sans" />
                <TextInput value={`Faculty: ${books.faculty}`} editable={false} className="bg-white text-black rounded-xl p-3 mb-2 font-sans" />
                <TextInput value={`Price : RM ${books.price}`} editable={false} className="bg-white text-black rounded-xl p-3 mb-2 font-sans" />
                <TextInput value={`Seller  : ${books.username}`} editable={false} className="bg-white text-black rounded-xl p-3 mb-4 font-sans" />

                <TouchableOpacity onPress={showModal} className="bg-blue-600 p-4 rounded-xl shadow">
                  <Text className="text-white font-bold text-center">Buy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={hideModal}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-2xl w-[90%]">
              {!showImage && !showRating && books && (
                <>
                  <Text className="text-xl font-bold text-center">{books.bookTitle}</Text>
                  <Text className="italic text-center text-base mb-2">by {books.bookAuthor}</Text>
                  <Text className="text-center">------------------------------------------------</Text>
                  <Text className="text-base my-1">Condition: {books.condition}</Text>
                  <Text className="text-base my-1">Faculty: {books.faculty}</Text>
                  <Text className="text-base my-1">Price: {books.price}</Text>
                  <Text className="text-base my-1">Seller: {books.username}</Text>
                  <Text className="text-center">------------------------------------------------</Text>
                  <Pressable className="bg-blue-600 mt-4 p-3 rounded-xl" onPress={() => setShowImage(true)}>
                    <Text className="text-white text-center">Confirm</Text>
                  </Pressable>
                </>
              )}

              {showImage && (
                <>
                  <LottieView
                    source={require('../../assets/animation/success.json')}
                    autoPlay
                    loop={false}
                    speed={0.9}
                    style={{ width: 150, height: 150, alignSelf: 'center', marginTop: 20 }}
                    resizeMode="cover"
                    onAnimationFinish={() => {setShowRating(true),setShowImage(false)}}
                  />
                  <Text className="text-center font-bold text-xl mt-5">Payment Successful! ✅</Text>
                </>
              )}

              {showRating && (
                <>
                  <Rating
                    showRating
                    ratingCount={5}
                    onFinishRating={(val: number) => setRating(val)}
                    startingValue={1}
                    style={{ marginTop: 20 }}
                  />
                  <Text className="text-center text-lg mt-4">Leave a review for this seller!</Text>
                  <TextInput
                    multiline
                    className="bg-gray-200 text-black rounded-xl p-3 mt-2 mb-4"
                    placeholder="Leave a review here!"
                    onChangeText={setReview}
                  />
                  <TouchableOpacity onPress={addFeedback} className="bg-green-600 p-3 rounded-xl">
                    <Text className="text-white text-center">Rate</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Bookpage;
