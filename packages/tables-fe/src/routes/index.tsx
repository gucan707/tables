import { createBrowserRouter } from "react-router-dom";
import { SignIn } from "../pages/SignIn";

export const router = createBrowserRouter([
  {
    path: "/sign",
    element: <SignIn />,
  },
]);
