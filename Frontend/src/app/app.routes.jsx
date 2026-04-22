import { createBrowserRouter, Outlet } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "@/features/products/pages/Dashboard";
import Protected from "@/features/auth/components/Protected";
import Home from "@/features/products/pages/Home";
import ProductDetail from "@/features/products/pages/ProductDetail";
import SellerProductDetail from "@/features/products/pages/SellerProductDetail";
import Cart from "@/features/cart/pages/Cart";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/product/:productId",
    element: <ProductDetail />,
  },
  {
    path: "/cart",
    element: (
      <Protected>
        <Cart />
      </Protected>
    ),
  },
  {
    path: "/seller",
    element: (
      <Protected role="seller">
        <Outlet />
      </Protected>
    ),
    children: [
      {
        path: "create-product",
        element: <CreateProduct />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "product/:productId",
        element: <SellerProductDetail />,
      },
    ],
  },
]);
