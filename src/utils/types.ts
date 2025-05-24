export interface TConstructorState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isLoading: boolean;
  error: string | null;
}

export interface TIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

export type UserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | undefined;
};

export interface OrderState {
  order: TOrder | null;
  feed: TOrdersData;
  userOrders: TOrder[];
  error: string | undefined | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};


export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';
