import { TribiosLayout } from "@tribios/layout/TribiosLayout";
import { AppDetail } from "@tribios/pages/AppDetail/AppDetail";
import { Dashboard } from "@tribios/pages/Dashboard/Dashboard";
import { Library } from "@tribios/pages/Library/Library";
import { Runner } from "@tribios/pages/Runner/Runner";

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
      {
        path: "library/:applicationKey",
        element: <AppDetail />,
        handle: {
          breadcrumb: "应用详情",
        },
      },
      {
        path: "runner/:runnerType",
        element: <Runner />,
        handle: {
          breadcrumb: "运行器",
        },
      },
    ],
  },
];
