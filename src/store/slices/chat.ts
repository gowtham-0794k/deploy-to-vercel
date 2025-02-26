// // third-party
// import { createSlice } from '@reduxjs/toolkit';

// // project imports

// import { dispatch } from '../index';
// import axios from 'axios';
// // types
// import { DefaultRootStateProps } from '../../types';
// import { ChatHistory } from 'types/chat';

// // ----------------------------------------------------------------------

// const initialState: DefaultRootStateProps['chat'] = {
//   error: null,
//   chats: [],
//   user: {
//     email: '',
//     password: '',
//     mobileNumber: '',
//     isdCode: ''
//   },
//   users: []
// };

// const slice = createSlice({
//   name: 'chat',
//   initialState,
//   reducers: {
//     // HAS ERROR
//     hasError(state, action) {
//       state.error = action.payload;
//     },

//     // GET USER
//     getUserSuccess(state, action) {
//       state.user = action.payload;
//     },

//     // GET USER CHATS
//     getUserChatsSuccess(state, action) {
//       state.chats = action.payload;
//     },

//     // GET USERS
//     getUsersSuccess(state, action) {
//       state.users = action.payload;
//     }
//   }
// });

// // Reducer
// export default slice.reducer;

// // ----------------------------------------------------------------------

// export function getUser(id: number) {
//   return async () => {
//     try {
//       const response = await axios.post('/api/chat/users/id', { id });
//       dispatch(slice.actions.getUserSuccess(response.data));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// export function getUserChats(user: string | undefined) {
//   return async () => {
//     try {
//       const response = await axios.post('/api/chat/filter', { user });
//       dispatch(slice.actions.getUserChatsSuccess(response.data));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// export function insertChat(chat: ChatHistory) {
//   return async () => {
//     try {
//       await axios.post('/api/chat/insert', chat);
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// export function getUsers() {
//   return async () => {
//     try {
//       const response = await axios.get('/api/chat/users');
//       dispatch(slice.actions.getUsersSuccess(response.data.users));
//     } catch (error) {
//       dispatch(slice.actions.hasError(error));
//     }
//   };
// }

// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports

import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from '../../types';
import { ChatHistory } from 'types/chat';
import axios from 'axios';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['chat'] = {
  error: null,
  chats: [],
  user: {
    email: '',
    password: '',
    mobileNumber: '',
    isdCode: ''
  },
  users: []
};
const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },

    // GET USER
    getUserSuccess(state, action) {
      state.user = action.payload;
    },

    // GET USER CHATS
    getUserChatsSuccess(state, action) {
      state.chats = action.payload;
    },

    // GET USERS
    getUsersSuccess(state, action) {
      state.users = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUser(id: number) {
  return async () => {
    try {
      const response = await axios.post('/api/chat/users/id', { id });
      dispatch(slice.actions.getUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUserChats(user: string | undefined) {
  return async () => {
    try {
      const response = await axios.post('/api/chat/filter', { user });
      dispatch(slice.actions.getUserChatsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function insertChat(chat: ChatHistory) {
  return async () => {
    try {
      await axios.post('/api/chat/insert', chat);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUsers() {
  return async () => {
    try {
      const response = await axios.get('/api/chat/users');
      dispatch(slice.actions.getUsersSuccess(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

