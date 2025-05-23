import { rootReducer } from '../services/rootReducer';

jest.mock('../services/slices/ingredientsSlice', () => ({
  ingredientsReducer: jest.fn().mockReturnValue({ ingredients: [], isLoading: false, error: null })
}));

jest.mock('../services/slices/orderSlice', () => ({
  orderReducer: jest.fn().mockReturnValue({ 
    order: null, 
    feed: { orders: [], total: 0, totalToday: 0 },
    userOrders: [],
    error: null,
    orderRequest: false,
    orderModalData: null
  })
}));

describe('rootReducer', () => {
  it('should combine all reducers correctly', () => {
    const state = rootReducer(undefined, { type: 'TEST_ACTION' });
    
    expect(state).toEqual({
      user: expect.any(Object),
      ingredients: expect.any(Object),
      burgerConstructor: expect.any(Object),
      order: expect.any(Object)
    });
  });
});
