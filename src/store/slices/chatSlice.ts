// // store/features/chatSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { Message } from 'views/Learning/ask-questions';

// interface ChatState {
//   conversations: {
//     [id: string]: {
//       id: string;
//       title: string;
//       timestamp: string;
//       messages: Message[];
//     };
//   };
//   currentConversationId: string | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: ChatState = {
//   conversations: {},
//   currentConversationId: null,
//   isLoading: false,
//   error: null,
// };

// export const sendMessage = createAsyncThunk(
//   'chat/sendMessage',
//   async ({ message, conversationId }: { message: string; conversationId: string }, { getState }) => {
//     // Replace with your AI API endpoint
//     const response = await fetch('/api/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ message, conversationId }),
//     });
    
//     if (!response.ok) throw new Error('Failed to send message');
//     return response.json();
//   }
// );

// const chatSlice = createSlice({
//   name: 'chat',
//   initialState,
//   reducers: {
//     createNewConversation: (state) => {
//       const id = Date.now().toString();
//       state.conversations[id] = {
//         id,
//         title: 'New Chat',
//         timestamp: new Date().toISOString(),
//         messages: [],
//       };
//       state.currentConversationId = id;
//     },
//     updateConversationTitle: (state, action) => {
//       const { id, title } = action.payload;
//       if (state.conversations[id]) {
//         state.conversations[id].title = title;
//       }
//     },
//     deleteConversation: (state, action) => {
//       const id = action.payload;
//       delete state.conversations[id];
//       if (state.currentConversationId === id) {
//         state.currentConversationId = null;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(sendMessage.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(sendMessage.fulfilled, (state, action) => {
//         state.isLoading = false;
//         const { conversationId, message, response } = action.payload;
//         state.conversations[conversationId].messages.push(
//           {
//             id: Date.now().toString(),
//             content: message,
//             sender: 'user',
//             timestamp: new Date().toISOString(),
//             conversationId,
//           },
//           {
//             id: (Date.now() + 1).toString(),
//             content: response,
//             sender: 'ai',
//             timestamp: new Date().toISOString(),
//             conversationId,
//           }
//         );
//       })
//       .addCase(sendMessage.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error.message || 'Failed to send message';
//       });
//   },
// });

// export const { createNewConversation, updateConversationTitle, deleteConversation } = chatSlice.actions;
// export default chatSlice.reducer;