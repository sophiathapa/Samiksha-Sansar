import React from "react";
import styles from '../style.module.css'

const Layout = ({children}) => {
  return (
    <div className={`flex items-center justify-center p-4 ${styles.authContainer}`}>
      <div className="w-full max-w-md ">
        {children}
        </div>
    </div>
  );
};

export default Layout;
