import { burgerConstructorReducer } from '../services/slices/constructorSlice';
import { addItem, removeItem, moveItemUp, moveItemDown, clearConstructor } from '../services/slices/constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockMain: TIngredient = {
  _id: '2',
  name: 'Начинка',
  type: 'main',
  price: 50,
  image: 'image-url',
  image_mobile: 'image-mobile-url',
  image_large: 'image-large-url',
  calories: 200,
  proteins: 10,
  fat: 5,
  carbohydrates: 30
};

describe('constructorSlice', () => {
  it('should handle initial state', () => {
    expect(burgerConstructorReducer(undefined, { type: 'unknown' })).toEqual({
      constructorItems: { bun: null, ingredients: [] },
      isLoading: false,
      error: null
    });
  });

  it('should handle addItem (bun)', () => {
    const action = addItem(mockBun);
    const state = burgerConstructorReducer(undefined, action);
    
    expect(state.constructorItems.bun).toEqual({
      ...mockBun,
      id: expect.any(String)
    });
  });

  it('should handle addItem (main)', () => {
    const action = addItem(mockMain);
    const state = burgerConstructorReducer(undefined, action);
    
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toEqual({
      ...mockMain,
      id: expect.any(String)
    });
  });

  it('should handle removeItem', () => {
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: [{ ...mockMain, id: 'test-id' }]
      },
      isLoading: false,
      error: null
    };
    
    const state = burgerConstructorReducer(
      initialState,
      removeItem({ id: 'test-id' })
    );
    
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('should handle moveItemUp', () => {
    const items = [
      { ...mockMain, id: '1' },
      { ...mockMain, id: '2' }
    ];
    
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: items
      },
      isLoading: false,
      error: null
    };
    
    const state = burgerConstructorReducer(
      initialState,
      moveItemUp({ id: '2' })
    );
    
    expect(state.constructorItems.ingredients[0].id).toBe('2');
  });

  it('should handle moveItemDown', () => {
    const items = [
      { ...mockMain, id: '1' },
      { ...mockMain, id: '2' }
    ];
    
    const initialState = {
      constructorItems: {
        bun: null,
        ingredients: items
      },
      isLoading: false,
      error: null
    };
    
    const state = burgerConstructorReducer(
      initialState,
      moveItemDown({ id: '1' })
    );
    
    expect(state.constructorItems.ingredients[1].id).toBe('1');
  });

  it('should handle clearConstructor', () => {
    const initialState = {
      constructorItems: {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [{ ...mockMain, id: 'test-id' }]
      },
      isLoading: false,
      error: null
    };
    
    const state = burgerConstructorReducer(initialState, clearConstructor());
    
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });
});
