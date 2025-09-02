import { configureStore } from '@reduxjs/toolkit'
import CounterReducer from "./features/counter/counterSlice"

export default configureStore({
  reducer: {
    counter: CounterReducer
  },
})