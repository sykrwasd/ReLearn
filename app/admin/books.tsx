import * as React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { Card, Text, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import { Image } from 'react-native';
import '../../global.css'

const Books = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [books, setBooks] = React.useState<Book[]>([]);
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
  };

  React.useEffect(() => {
    fetch(`${BASE_URL}/adminBook`)
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  }, [refreshing]);

  

  const handleClick = (bookid: number) => {
    router.push({
      pathname: '../pages/bookedit',
      params: { bookid: bookid.toString() },
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
            contentContainerStyle=  {{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            className="px-3 pb-5"
          >

            <Text className='text-4xl mt-5 mb-5 underline' style={{fontFamily: 'Poppins',textAlign: 'center'}}>Listed Books</Text>
          <View className="flex-row flex-wrap justify-between " >
            {books.map(book => (
              <TouchableOpacity
                key={book._id}
                className="w-[48%] mb-3"
                activeOpacity={0.9}
                onPress={() => handleClick(book._id)}
              >
                <Card className="bg-[#7DC2FA] " >
                  <Image source={{ uri: book.imageUrl }} className="h-60 w-full rounded-t-md" />
                  <Card.Content>
                    <Text className="font-sans mt-2 text-xl" style={{fontFamily: 'Poppins'}}>{book.bookTitle}</Text>
                    <Text className=" text-base text-gray-700" style={{fontFamily: 'Poppins'}}>by: {book.bookAuthor}</Text>
                    <Text className="font-bold text-lg mt-2 bg-white self-end rounded-lg w-20" style={{fontFamily: 'Poppins',textAlign: "center"}}>RM{book.price}</Text>
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
