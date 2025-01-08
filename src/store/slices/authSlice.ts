import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../index';

export interface User {
  _id?: string;
  email: string;
  password: string;
  mobileNumber: string;
  firstName?: string;
  lastName?: string;
  course?: string;
  isdCode: string;
  emailOtp: string;
  mobileOtp: string;
  isVerified: boolean;
  otpExpiresAt: Date;
  registrationComplete: boolean;
  // invitationToken?: string;
  // invitationExpiresAt?: Date;
  // invitedByTenantId?: string;
  role: string;
  createdAt: Date;
  states?: string;
  chats?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface RegisterUserPayload {
  email: string;
  password: string;
  mobileNumber: string;
  //   isdCode: number;
  isdCode: string;
}

interface CompleteRegistrationPayload {
  emailOtp?: string;
  mobileOtp?: string;
  email: string;
  firstName: string;
  lastName: string;
  course: string;
  states: string;
}

export interface ResendOTPPayload {
  email: string;
  type: 'email' | 'mobile' | 'both';
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterUserPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/api/register', userData);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const completeRegistration = createAsyncThunk(
  'auth/completeRegistration',
  async (registrationData: CompleteRegistrationPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/api/student-registration', registrationData);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (otpData: ResendOTPPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/api/resend-otp', otpData);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/api/forgot-password', { email }); // Send email directly in object
      return response.data;  // Return the whole response data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload: { token: string; newPassword: string;}, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/api/reset-password', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred.');
    }
  }
);

export const deleteIncompleteUser = createAsyncThunk(
  'auth/deleteIncompleteUser',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/api/v1/api/delete-incomplete-user', {
        data: { email }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //complete registration
      .addCase(completeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeRegistration.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //resend otp
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //delete incomplete user
      .addCase(deleteIncompleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIncompleteUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(deleteIncompleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectUser = (state: RootState) => state.auth;
export default authSlice.reducer;
