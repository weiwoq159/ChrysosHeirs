import { TribiosRoutes } from "@tribios/router";

import type { AppName } from "@/modules/apps/registry";
import { Overview } from "@/modules/Overview/Overview";
import type { AppRouteObject } from "@/shared/types/route";

const routesByApp = {
  tribios: TribiosRoutes,
} satisfies Record<AppName, AppRouteObject[]>;

export const routesMap = new Map<AppName, AppRouteObject[]>(
  Object.entries(routesByApp) as [AppName, AppRouteObject[]][],
);

export const routes: AppRouteObject[] = [
  {
    path: "/",
    handle: {
      breadcrumb: "翁法罗斯",
    },
    children: [
      {
        index: true,
        element: <Overview />,
      },
      ...Object.values(routesByApp).flat(),
    ],
  },
];
