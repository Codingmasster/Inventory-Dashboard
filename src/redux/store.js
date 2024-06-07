// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './InventorySlice';

export default configureStore({
  reducer: {
    inventory: inventoryReducer,
  },
});
