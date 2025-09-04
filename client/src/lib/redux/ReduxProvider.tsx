"use client";
import { Provider } from "react-redux";
import {store,persistor} from "@/lib/redux/store";
import { ReactNode } from "react";
import {PersistGate} from "redux-persist/integration/react";


export default function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>
   <PersistGate loading={null} persistor={persistor}>
    {children}
    </PersistGate>
    </Provider>;
}