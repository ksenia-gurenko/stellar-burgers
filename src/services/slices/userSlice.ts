import { UserState } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, setCookie, getCookie } from '../../utils/cookie';
import {
  registerUserApi,
  TRegisterData,
  forgotPasswordApi,
  resetPasswordApi,
  loginUserApi,
  TLoginData,
  updateUserApi,
  getUserApi,
  logoutApi
} from '../../utils/burger-api';

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      return await registerUserApi(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ name, email, password }: TRegisterData) => {
    const data = await updateUserApi({ name, email, password });
    return data.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData, { rejectWithValue }) => {
    try {
      const userData = await loginUserApi({ email, password });
      localStorage.setItem('refreshToken', userData.refreshToken);
      setCookie('accessToken', userData.accessToken);
      return userData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (userData: { email: string }, { rejectWithValue }) => {
    try {
      await forgotPasswordApi(userData);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (userData: { password: string; token: string }) =>
    await resetPasswordApi(userData)
);

export const checkAuthUser = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }): Promise<void> => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .catch((): void => {
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        })
        .finally(() => dispatch(setAuthChecked(true)));
    } else {
      dispatch(setAuthChecked(true));
    }
  }
);

export const initialState: UserState = {
  isAuthChecked: false,
  user: null,
  error: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.error = undefined;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.error = undefined;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const userReducer = userSlice.reducer;
export const { setUser, setAuthChecked } = userSlice.actions;
