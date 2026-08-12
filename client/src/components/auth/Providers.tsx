"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { useAuth } from "@/hooks/useAuth";

function AuthLoader({ children }: { children: React.ReactNode }) {
  useAuth(); // fires GET /auth/me on mount, populates Redux if the cookie is valid
  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthLoader>{children}</AuthLoader>
    </Provider>
  );
}