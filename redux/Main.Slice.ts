import { createSlice } from "@reduxjs/toolkit";

const initialState={
    name:"jatin",
    age:21,
    stateFunction:()=>{},
    permissionState:false
}

const MainSlice = createSlice({
     name:"main",
     initialState,
     reducers:{
        sentProps:(state,action)=>{
            state.stateFunction=action?.payload.fucntion
        state.permissionState=action?.payload?.permissionState
    },
      
     }
})
export const { sentProps } = MainSlice.actions;
export default MainSlice.reducer;