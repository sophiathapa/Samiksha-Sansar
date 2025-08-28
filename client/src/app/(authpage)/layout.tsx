import React from "react";
import styles from "../style.module.css";
import { Toaster } from "sonner";
import Header1 from "@/components/header1";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col w-full">
      <Header1 />
      <div className="flex flex-col  items-center justify-center p-4">
        {children}
        <Toaster />
      </div>
    </div>
  );
};

export default Layout;

//${styles.authContainer}
