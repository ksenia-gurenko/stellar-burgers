import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { useForm } from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, setFieldValue } = useForm({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser(values));
  };

  return (
    <LoginUI
      errorText=''
      email={values.email}
      setEmail={(value) => setFieldValue('email', value)}
      password={values.password}
      setPassword={(value) => setFieldValue('password', value)}
      handleSubmit={handleSubmit}
    />
  );
};
