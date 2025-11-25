import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './reducers';

// Configure Redux Persist
const persistConfig = {
    key: 'root',
    storage: AsyncStorage, // Use AsyncStorage for persistence
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required to avoid warnings with Redux Persist
        }),
});

// Persistor
export const persistor = persistStore(store);