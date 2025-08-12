import { DripsyProvider, makeTheme } from "dripsy";
import { Slot, Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "../redux/store";
import { ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const theme = makeTheme({
  colors: {
    $text: "white",
    $background: "black",
    $primary: "#1e90ff",
  },
  space: {
    $0: 0,
    $1: 4,
    $2: 8,
    $3: 16,
    $4: 24,
    $5: 32,
  },
});

export default function Layout() {
  return (
   
    <SafeAreaProvider>
      <PaperProvider>
        <ReduxProvider store={store}>
           <GestureHandlerRootView>
          <DripsyProvider theme={theme}>
             {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
          <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="ColorPalette"/>
        <Stack.Screen name="CameraScreen"/>
         <Stack.Screen name="ColorOverlayScreen"/>
      </Stack>
      {/* <StatusBar style="auto" /> */}
    {/* </ThemeProvider> */}
    {/* // Great question! In Expo Router's Stack navigation, the FIRST screen listed opens by default. */}
          </DripsyProvider>
          </GestureHandlerRootView>
        </ReduxProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
