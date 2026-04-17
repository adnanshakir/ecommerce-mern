import { RouterProvider } from "react-router";
import { routes } from "./app.routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import "./App.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const App = () => {
  const { handleGetMe } = useAuth();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      handleGetMe().catch((error) => {
        console.error("Failed to fetch user data", error);
      });
    }
  }, []);

  return <RouterProvider router={routes} />;
};

export default App;
