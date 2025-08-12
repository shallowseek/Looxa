import React, { useRef } from 'react';
import {StatusBar, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import CameraPreview from './CameraPreview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'dripsy';

export default function CameraScreen(){
//camera related hooks
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');



  //all activities related to gesture handler//
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


//frame processor//
const fProcessor = useFrameProcessor((frame)=>{
'worklet'
const originalHeight = frame.height;
const originalWidth = frame.width;
const scale_X = originalWidth; // Placeholder, update with actual calculation if needed

},[])











  return (
     <SafeAreaView style={{ flex: 1}}>
         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
         <View
           sx={{
             backgroundColor: '#0a0a0a',
             flex: 1,
             justifyContent: 'center',
             alignItems: 'center',
            //  padding: 6,
            //  position: "relative",
            borderColor:"red",
            borderWidth:10,
            margin:10,
            
           }
        }
        onLayout={(e)=>{const{height, width}=e.nativeEvent.layout
                  console.log("this is the height of view",height,"width",width)}}
         >
   
      <GestureDetector gesture={tapGesture}>
        {/* <View style={[StyleSheet.absoluteFill,{borderColor:"red", borderWidth:3}]} pointerEvents="box-only" /> */}
        {/* StyleSheet.absoluteFill makes the rectangle cover the whole parent view. */}
      
             
                        <CameraPreview device={device} cameraRef={cameraRef} />
                   {/* absoluteFill means fill of parent bound and not of screen, So the <Camera> will fill its parent, not the whole screen. */}
                    
        </GestureDetector>
     
    </View>
    </SafeAreaView>
  );
}



































===========
I see what’s happening — your logs show two different sets of heights for the same screen:

One log is for the outer <View> (red border one)

Another log is for the inner <CameraPreview> (or something inside it)

The difference in height/width between them is caused by two things at once:

1. SafeAreaView reducing the available height
As we discussed earlier, SafeAreaView trims off top and bottom padding so your content avoids the notch and gesture bar.
That explains part of the difference between the full screen height and the height of your outer view.

2. Border + Margin shrinking your inner size
In your code, you’ve got:

js
Copy
Edit
borderWidth: 10,
margin: 10
That affects layout like this:

margin: 10 → pushes the red border away from the SafeAreaView edges by 10px on all sides.

borderWidth: 10 → makes the actual inner content smaller by 10px on each side (20px total vertically and horizontally).

This means:

Width is reduced by (left margin + right margin + left border + right border) = 10 + 10 + 10 + 10 = 40px total.

Height is reduced similarly = 40px total.

That’s exactly why your logged width drops from:

java
Copy
Edit
372.72 → 352.72  (about 20px lost per side = 40px total)
and your height drops by the same amount between the two logs.

3. Summary of the shrinking steps
Think of it in layers:

scss
Copy
Edit
[Full Screen] 
   ↓ SafeAreaView (removes unsafe top/bottom space)
   ↓ margin (moves the red box inward)
   ↓ borderWidth (takes space inside the red box)
   ↓ CameraPreview fills whatever space is left
If you want both SafeAreaView protection AND full width camera:

Remove margin and possibly borderWidth from the outer container, or

Wrap only the UI elements in SafeAreaView, not the camera.

Do you want me to rewrite this so your camera is truly full screen and the SafeAreaView only affects buttons/overlays? That will remove the double shrinking you’re seeing.









Ask ChatGPT
