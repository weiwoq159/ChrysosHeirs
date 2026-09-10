import { TribiosLayout } from "@tribios/layout/TribiosLayout";
import { Dashboard } from "@tribios/pages/Dashboard/Dashboard";
import { Library } from "@tribios/pages/Library/Library";

import type { AppRouteObject } from "@/shared/types/route";

import { tribiosRouteSegment } from "../constants";

export const TribiosRoutes: AppRouteObject[] = [
  {
    path: tribiosRouteSegment,
    element: <TribiosLayout />,
    handle: {
      breadcrumb: "提里西庇俄斯",
    },
    children: [
      {
        index: true,
        element: <Dashboard />,
        handle: {
          breadcrumb: "统筹总览",
          menu: true,
        },
      },
      {
        path: "library",
        element: <Library />,
        handle: {
          breadcrumb: "应用库",
          menu: true,
        },
      },
    ],
  },
];
