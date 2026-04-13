import { setError, setLoading, setUser } from "../state/auth.slice";
import { register, login } from "../services/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({email, contact, password, fullname, isSeller = false}) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await register({email, contact, password, fullname, isSeller});

      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      dispatch(
        setError(error?.response?.data?.message || error.message)
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({email, password}) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await login({email, password});

      dispatch(setUser(data.user));
      return data.user;
    } catch (error) {
      dispatch(
        setError(error?.response?.data?.message || error.message)
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin };
};