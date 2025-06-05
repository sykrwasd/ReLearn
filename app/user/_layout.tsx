import { StatusBar } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabsLayout = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Tabs
        screenOptions={{
          tabBarStyle: {
            height: 80, // taller tab bar
            paddingTop: 20, // shift icons downward a bit
            borderTopWidth: 1,
            position: 'absolute',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={30}
                name="home"
                color={focused ? '#2567E8' : 'gray'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="sell"
          options={{
            tabBarLabel: () => null, // Hide text
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={34}
                name="add-circle"
                style={{ marginTop: -20, marginBottom: 10 }} // pull icon upward
                color={focused ? '#2567E8' : 'gray'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={30}
                name="person"
                color={focused ? '#2567E8' : 'gray'}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
