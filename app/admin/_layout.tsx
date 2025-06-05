import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminLayout() {
  const router = useRouter();

  return (
    <>
      <Drawer>
       <Drawer.Screen name="dashboard" options={{ drawerLabel: 'Dashboard' }} />
      <Drawer.Screen name="books" options={{ drawerLabel: 'Books' }} />
      <Drawer.Screen name="users" options={{ drawerLabel: 'Users' }} />
      <Drawer.Screen name="feedbacks" options={{ drawerLabel: 'Feedbacks' }} />

      </Drawer>
      <TouchableOpacity
        className="w-[20%] absolute bottom-10 left-5 bg-red-300 rounded-lg px-4 py-2"
        onPress={() => router.replace('/')}
      >
        <Text className=" text-center text-white text-lg font-semibold">Exit</Text>
      </TouchableOpacity>
    </>
  );
}
