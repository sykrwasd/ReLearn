import * as React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView, Alert, Dimensions } from 'react-native';
import { Card, Text, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import { Image } from 'react-native';
import useAuth from '../hooks/useAuth';

const MyComponent = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [books, setBooks] = React.useState<Book[]>([]);
  const router = useRouter();
  const { username, userid, loading } = useAuth();
  const screenHeight = Dimensions.get('window').height;


  const [loaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Medium.ttf'),
  });

  // Wait for fonts to load before rendering UI that depends on it
  if (!loaded) {
    return null; 
  }

  const onChangeSearch = (query: string) => setSearchQuery(query);

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
    fetch(`${BASE_URL}/home?userid=${userid}`)
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  }, [refreshing]);

  const filteredBooks = books.filter(book =>
    book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.bookAuthor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.faculty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClick = (bookid: number) => {
    router.push({
      pathname: '/pages/bookpage',
      params: { bookid: bookid.toString() },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <LinearGradient
          colors={['#ffffff', '#7DC2FA']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
           style={{ minHeight: screenHeight, paddingBottom: 20, paddingHorizontal: 10}} // full screen height
        >
          <Searchbar
            placeholder="Search title, author, faculty..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{ marginBottom: 10, backgroundColor: 'white' }}
          />

          <View className="flex-row flex-wrap justify-between " >
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                  <TouchableOpacity
                    key={book._id}
                    className="w-[48%] mb-3 shadow-md "
                    activeOpacity={0.9}
                    onPress={() => handleClick(book._id)}
                  >
                    <Card className="bg-[#7DC2FA]">
                      <Image source={{ uri: book.imageUrl }} className="h-60 w-full rounded-t-md" />
                      <Card.Content>
                        <Text className="font-sans mt-2 text-xl" style={{ fontFamily: 'Poppins' }}>{book.bookTitle}</Text>
                        <Text className="text-base text-gray-700" style={{ fontFamily: 'Poppins' }}>by: {book.bookAuthor}</Text>
                        <Text className="font-bold text-lg mt-2 bg-white self-end rounded-lg w-20" style={{ fontFamily: 'Poppins', textAlign: "center" }}>RM{book.price}</Text>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                ))
              ) : (
                <Text className="text-center text-lg text-gray-700 mt-5" style={{ fontFamily: 'Poppins' }}>
                  No books available.
                </Text>
              )}

          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyComponent;
