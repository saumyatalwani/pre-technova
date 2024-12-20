import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignIn from "./screen/Signin";
import Signup from "./screen/Signup";

const Routes = () => {
  const routes = [
    {
      path: "/",
      element: <App/> 
    },
    {
        path: "/signup",
        element: <Signup/> 
    },
    {
        path: "/signin",
        element: <SignIn/> 
    },
  ]

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};

export default Routes;