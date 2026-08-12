"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/axios";
import { setUser, clearUser } from "@/lib/redux/features/user/userSlice";
import type { RootState } from "@/lib/redux/store";
/**
 * The token is httpOnly, so client JS can never read it directly — that's
 * intentional (blocks XSS token theft). Instead, this asks the server
 * "who am I?" using the cookie the browser already attaches automatically.
 *
 * Call this once near the root of the app (see app/layout.tsx) so Redux
 * state survives a page refresh or a fresh tab.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setAuthChecked(true);
      return;
    }

    api
      .get("/user")
      .then(({ data }) => dispatch(setUser(data.user)))
      .catch(() => dispatch(clearUser()))
      .finally(() => setAuthChecked(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user?.id),
    authChecked,
  };
}