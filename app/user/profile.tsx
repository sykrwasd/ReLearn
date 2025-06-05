import { LinearGradient } from "expo-linear-gradient";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import { Card, TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import BASE_URL from "@/backend/config";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { Rating } from "react-native-ratings";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css"

const initialLayout = { width: Dimensions.get("window").width };

export default function ProfilePage() {
  const [loaded] = useFonts({
    Poppins: require("../../assets/fonts/Poppins-Medium.ttf"),
  });

  useEffect(() => {
    if (!loaded) return;
  }, [loaded]);

  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible,setModalVisible] = React.useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleClick = (bookid: number) => {
    console.log(bookid);
    router.push({
      pathname: "/pages/bookedit",
      params: { bookid: bookid.toString() },
    });
  };



  type User = {
    
    userid: string;
    username: string;
    email: string;
    imageUrl: string;
  };

  type Feedback = {
    _id: number;
    userid: string;
    rating: number;
    review: string;
    username: String;
  };

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

  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[] | null>(null);
  const [feedback, setFeedback] = useState<Feedback[] | null>(null);
  const [purchase, setPurchase] = useState<Book[] | null>(null);
  const { username, userid, loading } = useAuth();
  const [averageRating, setAverageRating] = useState<number | undefined>();

  useEffect(() => {
    if (loading || !username) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userid,username }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setUser(data.userdata);
          setBooks(data.bookdata);
          setFeedback(data.feedbackdata);
          setAverageRating(data.averageRating);
          setPurchase(data.purchasedata);
        } else {
          Alert.alert("Error", data.error || "Failed to load user data");
        }
      } catch (error) {
        Alert.alert("Network Error");
        console.error("Fetch failed:", error);
      }
    };
    
    fetchUserData();
  }, [loading, userid, refreshing]);
  
  // Tab view state
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "books", title: "Books Listed" },
    { key: "reviews", title: "Reviews" },
    { key: "purchases", title: "My Purchases" },
  ]);
  
  // Books Tab Content
  const BooksRoute = () => (
    
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ padding: 10 }}
      >
      <View className="flex-row flex-wrap justify-between">
        {books && books.length > 0 ? (
          books.map((book) => (
            <TouchableOpacity
            key={book._id}
            className="w-[48%] mb-4 rounded-lg shadow-md "
            activeOpacity={0.9}
            onPress={() => handleClick(book._id)}
            >
              <Card>
                <Card.Cover source={{ uri: book.imageUrl }} />
                <Card.Content>
                  <Text className="font-semibold text-2xl">{book.bookTitle}</Text>
                  <Text className="text-base font-sans">Author: {book.bookAuthor}</Text>
                  <Text className="font-sans">Seller: {book.username}</Text>
                  <Text className="font-sans mt-2 text-center rounded-md " 
                  style={{ backgroundColor: book.availability.toLowerCase() === "available" ? "limegreen": book.availability.toLowerCase() === "reserved"? "gold": "red",}}>
                    {book.availability}
                    </Text>
                  <Text className="font-bold mt-4 text-xl bg-white text-center w-[40%] rounded-md" style={{left:85}}>
                  RM{book.price}
                    </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Text style= {{ fontFamily: "Poppins", fontSize :20, textAlign:"center"}}>No books listed.</Text>
        )}
      </View>
    </ScrollView>
  );

  // Reviews Tab Content
  const ReviewsRoute = () => (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ padding: 20 }}
      >
      {feedback && feedback.length > 0 ? (
        feedback.map((fb) => (
          <TouchableOpacity key={fb._id} onPress={() => {setModalVisible(true),setSelectedFeedback(fb)}}> 
              <View  style={styles.reviewCard}>
            <Text style={styles.reviewUser}>User: {fb.username}</Text>
            <Rating
              readonly
              startingValue={fb.rating}
              imageSize={20}
              style={{ alignSelf: "flex-start", marginBottom: 5 }}
              />
            <Text style={styles.reviewText}>{fb.review}</Text>
          </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style= {{ fontFamily: "Poppins", fontSize :20, textAlign: 'center'}} >No reviews yet.</Text>
      )}
    </ScrollView>
  );

  const PurchaseRoute = () => (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ padding: 10 }}
      >
      <View className="flex-row flex-wrap justify-between">
        {purchase && purchase.length > 0 ? (
          purchase.map((book) => (
            <TouchableOpacity
            key={book._id}
            className="w-[48%] mb-4 rounded-lg shadow-md "
            activeOpacity={0.9}
            onPress={() => handleClick(book._id)}
            >
              <Card>
                <Card.Cover source={{ uri: book.imageUrl }} />
                <Card.Content>
                  <Text className="font-semibold text-2xl">{book.bookTitle}</Text>
                  <Text className="text-base font-sans">Author: {book.bookAuthor}</Text>
                  <Text className="font-sans">Seller: {book.username}</Text>
                  <Text className="font-bold mt-4 text-xl bg-white text-center w-[40%] rounded-md" style={{left:85}}>
                  RM{book.price}
                    </Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Text style= {{ fontFamily: "Poppins", fontSize :20, textAlign:"center"}}>No purchases yet.</Text>
        )}
      </View>
    </ScrollView>
  )

 const renderScene = SceneMap({
  books: BooksRoute,
  reviews: ReviewsRoute,
  purchases: PurchaseRoute, 
});

  const renderTabBar = (props: any) => (
    <TabBar
      {...props} //spreads all the props
      indicatorStyle={{ backgroundColor: "#fff" }}
      style={{ backgroundColor: "#7DC2FA" }}
      labelStyle={{ fontFamily: "Poppins", fontWeight: "600" }}
      />
  );

  return (
    
    <LinearGradient
    colors={["#ffffff", "#7DC2FA"]}
    start={{ x: 1, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.gradient}
    >

      <View style={styles.container}>
        {user && (

           
          <>
          <View style={styles.topButtons}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/pages/settings')}>
          <Text style={styles.buttonText} >
            Edit
          </Text>
        </TouchableOpacity>

       
      </View>
            <Image style={styles.profileImage} source={{ uri: user.imageUrl }} />

            <View style={{flexDirection: "row", gap: 10,}}>

            <Rating
              type="star"
              ratingCount={5}
              startingValue={averageRating}
              imageSize={25}
              showRating
              readonly
              style={{borderRadius: 20,backgroundColor: "white",marginBottom: 10,padding: 10,}}
              fractions={1}
              />
            
              <View >

              <TextInput
                placeholder="Username"
                value={user.username}
                editable={false}
                style={styles.input}
                />
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={user.email}
                editable={false}
                />
              </View>
            
            </View>
          </>
        )}
      </View>
      

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
        style={{ flex: 1 }}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1  justify-center items-center bg-black/50">
              {selectedFeedback && (
                  <>
                    <View className="w-[80%] p-6 bg-white rounded-2xl shadow-lg items-left space-y-4 ">
                      <Text className="font-semibold mb-1 ">User: {selectedFeedback.username}</Text>
                      <Rating
                        readonly
                        startingValue={selectedFeedback.rating}
                        imageSize={20}
                        style={{ alignSelf: "flex-start", marginBottom: 5 }}
                      />
                      <Text className="font-semibold">{selectedFeedback.review}</Text>
                    </View>
                    <TouchableOpacity
                      className="py-2 px-8 rounded-lg bg-green-500 mt-5"
                      onPress={() => setModalVisible(false)}
                    >
                      <Text className=" text-base font-medium text-white">Close</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            
        </Modal>

        

    </LinearGradient>

    
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 0,
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 50,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    marginBottom: 20,
  },
  userInfo: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: 250,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "white",
    color: "black",
    fontFamily: "Poppins",
    height: 40,
    textAlign: "center"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 15,
    backgroundColor: "rgba(125, 194, 250, 1)",
    borderRadius: 10,
  },
  bookTitle: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    textAlign: "center",
  },
  bookInfo: {
    fontFamily: "Poppins",
    fontSize: 14,
  },
  topButtons: {
    position: "absolute",
    top: 15,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    zIndex: 10,
    marginTop: 50,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },

  reviewCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  reviewUser: {
    fontWeight: "600",
    marginBottom: 5,
    fontFamily: "Poppins",
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "Poppins",
  },
});
