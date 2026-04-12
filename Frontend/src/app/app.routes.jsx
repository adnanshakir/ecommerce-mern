import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>Home</h1>,
    },
    {
        path: "/login",
        element: <h1>Login</h1>,
    },
    {
        path: "/register",
        element: <h1>Register</h1>,
    },
    {
        path: "*",
        element: <h1>404 Not Found</h1>,
    },
]);