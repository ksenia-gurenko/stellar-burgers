import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredientsState } from '@utils-types';

export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// thunk для загрузки ингредиентов
export const getIngredientsData = createAsyncThunk(
  'ingredients/getIngredientsData',
  getIngredientsApi
);

export const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredientsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        console.log('Получены ингредиенты:', action.payload);
      })
      .addCase(getIngredientsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
        console.error(
          'Ошибка при загрузке ингредиентов:',
          action.error.message
        );
      });
  }
});

export const ingredientsReducer = ingredientSlice.reducer;
