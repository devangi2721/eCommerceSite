"use client";
import { selectToken, setCredentials } from "@/redux/slices/authSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TokenSyncProvider({ children }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      dispatch(setCredentials({ token: localToken, user: null }));
    }
  }, [dispatch, token]);

  return children;
}
