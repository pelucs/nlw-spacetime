import { useEffect, useState } from "react";
import { styled } from "nativewind";
import { ImageBackground } from "react-native";
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree';
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import * as SecureStore from 'expo-secure-store';

import blurBg from '../src/assets/bg-blur.png';
import Stripes from '../src/assets/stripes.svg';

const StyledStripes = styled(Stripes);

import { 
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto';


export default () => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<null | boolean>(null);

  const [fontsLoading] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold
  });

  useEffect(() => {
    SecureStore.getItemAsync('token')
    .then(token => {
      console.log(!!token)

      setIsUserAuthenticated(!!token);
    })
  }, [])

  if(!fontsLoading){
    return <SplashScreen/>
  }

  return(
    <ImageBackground 
      source={blurBg} 
      className="flex-1 bg-gray-900 relative"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className="absolute left-2"/>

      <StatusBar style="light" translucent />

      <Stack screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_left', 
          contentStyle: { backgroundColor: 'transparent' } ,
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated}/>
        <Stack.Screen name="memories"/>
        <Stack.Screen name="new"/>
      </Stack>
    </ImageBackground>
  );
}