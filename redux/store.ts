import { configureStore } from '@reduxjs/toolkit';
import  mainSlicer from "./Main.Slice"




export const store = configureStore({
    reducer:{
        mainSlice:mainSlicer,
    }
})