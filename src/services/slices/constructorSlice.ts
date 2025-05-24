import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TIngredient,
  TConstructorState
} from '@utils-types';

const initialState: TConstructorState = {
  constructorItems: { bun: null, ingredients: [] },
  isLoading: false,
  error: null
};

const burgerConstructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addItem: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        const { type } = payload;
        type === 'bun'
          ? (state.constructorItems.bun = payload)
          : state.constructorItems.ingredients.push(payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },

    removeItem: (state, { payload }: PayloadAction<{ id: string }>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          ({ id }) => id !== payload.id
        );
    },

    clearConstructor: (state) => {
      Object.assign(state.constructorItems, { bun: null, ingredients: [] });
    },

    moveItemUp: (state, { payload }: PayloadAction<{ id: string }>) => {
      const items = state.constructorItems.ingredients;
      const i = items.findIndex((item) => item.id === payload.id);
      if (i > 0) [items[i - 1], items[i]] = [items[i], items[i - 1]];
    },

    moveItemDown: (state, { payload }: PayloadAction<{ id: string }>) => {
      const items = state.constructorItems.ingredients;
      const i = items.findIndex((item) => item.id === payload.id);
      if (i !== -1 && i < items.length - 1)
        [items[i], items[i + 1]] = [items[i + 1], items[i]];
    }
  }
});

export const {
  addItem,
  removeItem,
  clearConstructor,
  moveItemUp,
  moveItemDown
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
