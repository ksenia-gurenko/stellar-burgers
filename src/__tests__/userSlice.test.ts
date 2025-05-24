import { userReducer } from '../services/slices/userSlice';
import {
  loginUser,
  registerUser,
  checkAuthUser,
  logoutUser,
  setUser,
  setAuthChecked,
  updateUser,
  forgotPassword,
  resetPassword
} from '../services/slices/userSlice';

describe('userSlice', () => {
  const initialState = {
    isAuthChecked: false,
    user: null,
    error: undefined
  };

  const mockUser = {
    name: 'Test User',
    email: 'test@example.com'
  };

  it('should return initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('should handle loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = userReducer(initialState, action);
    
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeUndefined();
  });

  it('should handle loginUser.rejected', () => {
    const errorMessage = 'Login failed';
    const action = {
      type: loginUser.rejected.type,
      payload: errorMessage
    };
    const state = userReducer(initialState, action);
    
    expect(state.error).toBe(errorMessage);
    expect(state.isAuthChecked).toBe(false);
  });

  it('should handle registerUser.fulfilled', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = userReducer(initialState, action);
    
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(mockUser);
  });

  it('should handle logoutUser.fulfilled', () => {
    const loggedInState = {
      isAuthChecked: true,
      user: mockUser,
      error: undefined
    };
    
    const state = userReducer(loggedInState, { type: logoutUser.fulfilled.type });
    
    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle setUser', () => {
    const state = userReducer(initialState, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(false); // Не должно изменяться
  });

  it('should handle setAuthChecked', () => {
    const state = userReducer(initialState, setAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toBeNull(); // Не должно изменяться
  });

  it('should handle updateUser.fulfilled', () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    const action = {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    };
    const state = userReducer({ ...initialState, user: mockUser }, action);
    
    expect(state.user).toEqual(updatedUser);
  });

  it('should handle forgotPassword.rejected', () => {
    const errorMessage = 'Email not found';
    const action = {
      type: forgotPassword.rejected.type,
      payload: errorMessage
    };
    const state = userReducer(initialState, action);
    
    expect(state.error).toBe(errorMessage);
  });

  it('should handle resetPassword.fulfilled', () => {
    const action = { type: resetPassword.fulfilled.type };
    const state = userReducer(initialState, action);
    
    expect(state.error).toBeUndefined();
  });

  it('should handle checkAuthUser.fulfilled', () => {
    const action = { type: checkAuthUser.fulfilled.type };
    const state = userReducer(initialState, action);
    
    // Проверяем, что состояние не изменилось
    expect(state).toEqual(initialState);
  });
});
