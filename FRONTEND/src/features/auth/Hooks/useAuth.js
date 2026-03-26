import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register } from "../../../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setloading } = context;

  const refreshUser = async () => {
    try {
      const data = await getMe();
      setUser(data?.user ?? null);
    } catch {
      // Most commonly happens when the cookie is missing/invalid
      setUser(null);
    }
  };

  const handleLogin = async (email, password) => {
    setloading(true);
    try {
      await login(email, password);
      await refreshUser();
      return true;
    } catch (err) {
      console.log(err);
      setUser(null);
      return false;
    } finally {
      setloading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setloading(true);
    try {
      await register(username, email, password);
      await refreshUser();
      return true;
    } catch (err) {
      console.log(err);
      setUser(null);
      return false;
    } finally {
      setloading(false);
    }
  };

  const handleLogout = async () => {
    setloading(true);
    try {
      await logout();
      setUser(null);
      return true;
    } catch (err) {
      console.log(err);
      setUser(null);
      return false;
    } finally {
      setloading(false);
    }
  };

  return { user, loading, handleLogin, handleRegister, handleLogout };
};