import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import CardDetailScreen from "@/screens/CardDetailScreen";
import HomeScreen from "@/screens/HomeScreen";

export type RootStackParamList = {
  Home: undefined;
  CardDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="CardDetail"
          component={CardDetailScreen}
          options={{
            presentation: "transparentModal",
            animation: "none",
            gestureEnabled: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
