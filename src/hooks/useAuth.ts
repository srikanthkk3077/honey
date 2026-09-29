import { useStore } from '../store/store';

export const useAuth = () => {
  const { user, isAuthenticated, isAdmin, login, adminLogin, register, logout } = useStore();
  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    adminLogin,
    register,
    logout
  };
};
