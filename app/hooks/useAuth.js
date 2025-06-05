import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuth = () => {
  const [auth, setAuth] = useState({
    userid: null,
    username: null,
  });

  const [loading, setLoading] = useState(true); // Optional loading state

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const userid = await AsyncStorage.getItem('userid');
        const username = await AsyncStorage.getItem('username');

        console.log("from authjs", username, userid);

        setAuth({
          userid: userid || null,
          username: username || null,
        });
      } catch (error) {
        console.error("Error fetching auth data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuth();
  }, []);

  return { ...auth, loading };
};

export default useAuth;
