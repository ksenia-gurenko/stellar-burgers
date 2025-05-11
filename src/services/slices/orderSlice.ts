import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  orderBurgerApi,
  getFeedsApi,
  getOrderByNumberApi
} from '@api';
import { OrderState } from '@utils-types';

export const getOrder = createAsyncThunk('order/getOrders', getOrdersApi);

export const getOrderByNumber = createAsyncThunk(
  'order/fetchGetOrder',
  async function (number: number) {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

export const getFeed = createAsyncThunk('order/getFeeds', getFeedsApi);

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  }
);

export const initialState: OrderState = {
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
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderClose(state) {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })

      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.error = null;
        state.orderModalData = action.payload.orders[0];
      })

      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        (state.orderRequest = false),
          (state.orderModalData = action.payload || null);
      })
      .addCase(orderBurger.rejected, (state, action) => {
        (state.orderRequest = false), (state.error = action.error.message);
      })

      .addCase(getFeed.pending, (state) => {
        state.error = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.feed = action.payload;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const orderReducer = orderSlice.reducer;
export const { orderClose } = orderSlice.actions;
