import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dietReducer from '../features/diet/dietSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    diet: dietReducer,
    cart: cartReducer,
    products: productReducer,
    admin: adminReducer,
  },
});
