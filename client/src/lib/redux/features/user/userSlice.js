import { createSlice , PayloadAction} from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState : {
    id : "",
    name : "",
    email : "",
    token: "",
    likedBooks : [],
  },
  reducers: {
   setUser: (state, action) => { 
      state.id  = action.payload.id
      state.name  = action.payload.name
      state.email  = action.payload.email
      state.token  = action.payload.token
    },

    clearUser: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.token = null;
    },

    addLikedBook : (state, action)=>{
      state.likedBooks.push(action.payload)
    },
    removeLikedBook : (state,action)=>{
      state.likedBooks = state.likedBooks
      .filter((id)=> id !==action.payload)
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser ,clearUser,addLikedBook,removeLikedBook } = userSlice.actions

export default userSlice.reducer