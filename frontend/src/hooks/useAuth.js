import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout, clearError } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  return {
    user,
    loading,
    error,
    login: (credentials) => dispatch(login(credentials)),
    register: (userData) => dispatch(register(userData)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
    isAuthenticated: !!user,
  };
};
