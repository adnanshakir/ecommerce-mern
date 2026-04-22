import { createBrowserRouter, Outlet } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Products from "../features/products/pages/Products";

import Protected from "@/features/auth/components/Protected";
import ProductDetail from "@/features/products/pages/ProductDetail";
import SellerProductDetail from "@/features/products/pages/SellerProductDetail";
import Cart from "@/features/cart/pages/Cart";
import Home from "@/Pages/Home";
import Dashboard from "@/Pages/Dashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
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
    path: "/products",
    element: <Products />,
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
        element: <Dashboard/>,
      },
      {
        path: "product/:productId",
        element: <SellerProductDetail />,
      },
    ],
  },
]);
