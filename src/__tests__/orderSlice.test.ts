import { orderReducer } from '../services//slices/orderSlice';
import { orderBurger, orderClose, getOrderByNumber } from '../services//slices/orderSlice';

describe('orderSlice', () => {
  it('should handle initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual({
      order: null,
      feed: {
        orders: [],
        total: 0,
        totalToday: 0
      },
      userOrders: [],
      error: null,
      orderRequest: false,
      orderModalData: null
    });
  });

  it('should set orderRequest to true on pending', () => {
    const action = { type: orderBurger.pending.type };
    const state = orderReducer(undefined, action);
    expect(state.orderRequest).toBe(true);
  });

  it('should handle orderBurger.fulfilled', () => {
    const mockOrder = { number: 12345 };
    const action = {
      type: orderBurger.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(undefined, action);
    
    expect(state).toEqual({
      ...state,
      orderRequest: false,
      orderModalData: mockOrder,
      error: null
    });
  });

  it('should handle orderBurger.rejected', () => {
    const errorMessage = 'Failed to create order';
    const action = {
      type: orderBurger.rejected.type,
      error: { message: errorMessage }
    };
    const state = orderReducer(undefined, action);
    
    expect(state).toEqual({
      ...state,
      orderRequest: false,
      error: errorMessage
    });
  });

  it('should handle orderClose', () => {
    const initialState = {
      orderRequest: true,
      orderModalData: { number: 12345 },
    };
    
    const state = orderReducer(initialState as any, orderClose());
    
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
  });
});
