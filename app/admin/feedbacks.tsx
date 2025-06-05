import * as React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { Card, Text, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import { Image } from 'react-native';
import { useState } from 'react';
import { Rating } from 'react-native-ratings';

const Books = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [feedback, setFeedback] = useState<Feedback[] | null>(null);
  const router = useRouter();

  const [loaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Medium.ttf'),
  });

  // Wait for fonts to load before rendering UI that depends on it
  if (!loaded) {
    return null; 
  }


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  type Feedback = {
    _id: number;
    userid: string;
    rating: number;
    review: string;
    username: String;
  };
  React.useEffect(() => {
    fetch(`${BASE_URL}/adminFeedback`)
      .then(res => res.json())
      .then(data => setFeedback(data))
      .catch(err => console.error(err));
  }, [refreshing]);

  

  const handleClick = (bookid: number) => {
    router.push({
      pathname: '/pages/bookpage',
      params: { bookid: bookid.toString() },
    });
  };

  return (
    <SafeAreaView className="flex-1">
        <LinearGradient
          colors={['#ffffff', '#7DC2FA']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="min-h-screen px-3 pb-5"
        >
     <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          className="px-3 pb-5"
        >
           <Text className='text-4xl mt-5 mb-5 underline' style={{fontFamily: 'Poppins',textAlign: 'center'}}>Listed Feedbacks</Text>
       {feedback && feedback.length > 0 ? (
              feedback.map((fb) => (
                <TouchableOpacity key={fb._id}>
                  <View className="bg-white rounded-xl p-4 mb-4">
                    <Text className="font-semibold mb-1.5" style={{ fontFamily: "Poppins" }}>
                      User: {fb.username}
                    </Text>
                    <Rating
                      readonly
                      startingValue={fb.rating}
                      imageSize={20}
                      style={{ alignSelf: "flex-start", marginBottom: 5 }}
                    />
                    <Text className="text-sm" style={{ fontFamily: "Poppins" }}>
                      {fb.review}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-center text-gray-500 mt-4">No feedback available.</Text>
            )}

      </ScrollView>
        </LinearGradient>
    </SafeAreaView>
  );
};

export default Books;
