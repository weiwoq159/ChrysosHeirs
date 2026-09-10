import type { RouteObject } from "react-router";

export interface AppRouteHandle {
  breadcrumb?: string;
  menu?: true;
}

export type AppRouteObject = RouteObject & {
  handle?: AppRouteHandle;
};
