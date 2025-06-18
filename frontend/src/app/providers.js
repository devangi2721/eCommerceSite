'use client';

import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '@/redux/slices/authSlice';

export default function Providers({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return <Provider store={store}>{children}</Provider>;
} 