import { createHashRouter, RouterProvider } from "react-router";

import { routes } from "@/router";

import { AppProvider } from "./provider";

const router = createHashRouter(routes);

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
