import { FC } from 'react';
import { useSelector } from '../../services/store';
import { AppHeaderUI } from '@ui';

/*
  Компонент AppHeader отображает верхний заголовок приложения.
  Он получает имя пользователя из Redux-хранилища и передает его в компонент AppHeaderUI.
 */
export const AppHeader: FC = () => {
  /*
    Извлекаем данные о пользователе из Redux-хранилища.
    Запрашивается полноправный объект пользователя через селектор.
   */
  const user = useSelector((store) => store.user.user);

  /*
    Возвращаем UI-компонент AppHeaderUI, передавая ему имя пользователя.
    Используется безопасный оператор необязательной цепочки (?.),
    чтобы избежать ошибок при попытке обратиться к несуществующему имени.
   */
  return <AppHeaderUI userName={user?.name} />;
};
