import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production' // Включаем DevTools только в разработке
});

export type RootState = ReturnType<typeof rootReducer>; // Тип состояния приложения
export type AppDispatch = typeof store.dispatch; // Тип нашего диспетчера действий

export const useDispatch: () => AppDispatch = () => dispatchHook(); // Хук для отправки действий
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook; // Хук для выборки состояний

export default store;
