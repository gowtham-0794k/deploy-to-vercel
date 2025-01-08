// third-party
import { combineReducers } from 'redux';

// project imports
import snackbarReducer from './slices/snackbar';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chat';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  snackbar: snackbarReducer,
  auth: authReducer,
  chat: chatReducer
  
});

export default reducer;
