import { ingredientsReducer } from '../services//slices/ingredientsSlice';
import { getIngredientsData } from '../services//slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    price: 100,
    image: 'image-url',
    image_mobile: 'image-mobile-url',
    image_large: 'image-large-url',
    calories: 300,
    proteins: 5,
    fat: 2,
    carbohydrates: 50
  }
];

describe('ingredientsSlice', () => {
  it('should handle initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  it('should set isLoading to true on pending', () => {
    const action = { type: getIngredientsData.pending.type };
    const state = ingredientsReducer(undefined, action);
    expect(state.isLoading).toBe(true);
  });

  it('should handle fulfilled', () => {
    const action = {
      type: getIngredientsData.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(undefined, action);
    
    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  it('should handle rejected', () => {
    const errorMessage = 'Failed to fetch';
    const action = {
      type: getIngredientsData.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(undefined, action);
    
    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: errorMessage
    });
  });
});
