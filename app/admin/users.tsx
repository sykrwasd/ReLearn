import * as React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView, Alert } from 'react-native';
import { Card, Text, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import { Image } from 'react-native';
import { useState } from 'react';

const Books = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [user, setUser] = useState<User[]>([]);
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

  type User = {
    _id: number;
    username: string;
    email: string;
    imageUrl: string;
  };

  React.useEffect(() => {
    fetch(`${BASE_URL}/adminUser`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [refreshing]);

  const handleClick = (userid: number) => {

    router.push({
      pathname: '../pages/useredit',
      params: { userid: userid.toString() },
    });
  };

  return (
    <SafeAreaView className="flex-1">
        <LinearGradient
          colors={['#ffffff', '#7DC2FA']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="flex-1"
        >
      <ScrollView
           contentContainerStyle={{ flexGrow: 1 }}
           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
           className="px-3 pb-5"
         >
          
           <Text className='text-4xl mt-5 mb-5 underline' style={{fontFamily: 'Poppins',textAlign: 'center'}}>Listed Users</Text>
          <View className="flex-row flex-wrap justify-between " >
            {user.map(user => (
              <TouchableOpacity
                key={user._id}
                className="w-[48%] mb-3"
                activeOpacity={0.9}
                onPress={() => handleClick(user._id)}
              >
                <Card className="bg-[#7DC2FA] " >
                  <Image source={{ uri: user.imageUrl }} className="h-60 w-full rounded-t-md" />
                  <Card.Content>
                    <Text className="font-sans mt-2 text-xl" style={{fontFamily: 'Poppins'}}>{user.username}</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
      </ScrollView>
        </LinearGradient>
    </SafeAreaView>
  );
};

export default Books;
