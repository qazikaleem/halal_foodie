import { combineReducers } from '@reduxjs/toolkit';
import locReducer from './locSlice'
import authReducer from './authSlice'
import catReducer from './catSlice'


const rootReducer = combineReducers({
    location: locReducer,
    auth: authReducer,
    categories: catReducer
});

export default rootReducer;