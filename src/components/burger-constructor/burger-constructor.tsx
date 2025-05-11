import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { orderClose, orderBurger } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(
    (state) => state.burgerConstructor?.constructorItems
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.user);
  const orderRequest = useSelector((store) => store.order.orderRequest);
  const orderModalData = useSelector((store) => store.order.orderModalData);

  // Обработчик события нажатия кнопки оформления заказа
  const onOrderClick = () => {
    // Если булка ещё не выбрана или заказ уже обрабатывается, ничего не делаем
    if (!constructorItems.bun || orderRequest) return;
    // Если пользователь не залогинен, перенаправляем на страницу логина
    if (!user) {
      return navigate('/login');
    }

    // Отправляем запрос на создание заказа с выбранными элементами
    dispatch(
      orderBurger([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map(
          (ingredient: TIngredient) => ingredient._id
        ),
        constructorItems.bun._id
      ])
    ).then((action) => {
      // Очищаем корзину после успешного размещения заказа
      if (orderBurger.fulfilled.match(action)) {
        dispatch(clearConstructor());
      }
    });
  };
  // Закрытие модального окна заказа
  const closeOrderModal = () => {
    dispatch(orderClose());
  };
  // Вычисляем общую стоимость бургера (булка + ингредиенты)
  const price = useMemo(() => {
    if (!constructorItems) return 0;

    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients?.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );

    return bunPrice + ingredientsPrice || 0;
  }, [constructorItems]);
  // Рендерим UI-компонент конструктора бургеров с передачей необходимых данных
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
