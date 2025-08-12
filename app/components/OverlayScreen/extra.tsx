import React, { useRef } from 'react';
import {StatusBar, StyleSheet } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import CameraPreview from './CameraPreview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'dripsy';

export default function CameraScreen(){
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');

  const onTapJS = (x, y) => {
    // x,y are screen coordinates relative to the overlay view
    console.log('tap at', x, y);
    // map to camera frame coords here (see mapping section)
  };

  const tapGesture = Gesture.Tap()
    .onEnd((e) => {
        console.log("tap detected")
      // e.x, e.y are relative to gesture view
      runOnJS(onTapJS)(e.x, e.y);
    });

  return (
     <SafeAreaView style={{ flex: 1 }}>
         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
         <View
           sx={{
             backgroundColor: '#0a0a0a',
             flex: 1,
             justifyContent: 'center',
             alignItems: 'center',
             padding: '$3',
            //  position: "relative",
           }}
         >
   
      <GestureDetector gesture={tapGesture}>
        {/* <View style={[StyleSheet.absoluteFill,{borderColor:"red", borderWidth:3}]} pointerEvents="box-only" /> */}
        {/* StyleSheet.absoluteFill makes the rectangle cover the whole parent view. */}
      
                    <View>
                        {/* That outer <View> has no styles, so by default it:

has width: 0 and height: 0 (because RN views shrink-wrap to content unless flex or size is given),

meaning your CameraPreview doesn’t actually take up the screen. */}
                        <CameraPreview device={device} cameraRef={cameraRef} />
                        {/* overlays */}
                        {/* <View style={StyleSheet.absoluteFill}> */}
                        {/* overlay UI here */}
                        {/* </View>   */}
                    </View>
                    
        </GestureDetector>
     
    </View>
    </SafeAreaView>
  );
}
