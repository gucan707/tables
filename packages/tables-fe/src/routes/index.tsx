import { createBrowserRouter } from "react-router-dom";

import { Home } from "../pages/Home";
import { SignIn } from "../pages/SignIn";

export const router = createBrowserRouter([
  {
    path: "/sign",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <Home />,
  },
]);
