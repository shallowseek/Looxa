import { Stack } from 'expo-router'
import CameraScreen from './components/OverlayScreen/index'

export default function ColorPaletteScreen() {
  return (
    <>
      {/* This Stack.Screen only affects this file */}
      <Stack.Screen options={{ headerShown: false }} />
      <CameraScreen />
    </>
  )
}