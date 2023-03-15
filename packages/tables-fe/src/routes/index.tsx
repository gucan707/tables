import { createBrowserRouter } from "react-router-dom";

import { Home } from "../pages/Home";
import { SignIn } from "../pages/SignIn";
import { Table } from "../pages/Table";

export const router = createBrowserRouter([
  {
    path: "/sign",
    element: <SignIn />,
  },
  {
    path: "/table/:tableId",
    element: <Table />,
  },
  {
    path: "/",
    element: <Home />,
  },
]);
