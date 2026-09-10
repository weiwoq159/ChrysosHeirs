import { useMatches, Link } from "react-router";

import { Breadcrumb, type BreadcrumbProps } from "antd";

import type { AppRouteHandle } from "@/shared/types/route";

type UseBreadcrumbOptions = Omit<BreadcrumbProps, "items">;

const useBreadcrumb = (options: UseBreadcrumbOptions = {}) => {
  const matches = useMatches();
  const breadcrumbMatches = matches.filter((match) => {
    const handle = match.handle as AppRouteHandle | undefined;

    return Boolean(handle?.breadcrumb);
  });

  const breadcrumbItems = breadcrumbMatches.map((match, index) => {
    const { breadcrumb } = match.handle as AppRouteHandle;
    const isCurrentPage = index === breadcrumbMatches.length - 1;

    return {
      title: isCurrentPage ? breadcrumb : <Link to={match.pathname}>{breadcrumb}</Link>,
    };
  });

  return <Breadcrumb items={breadcrumbItems} {...options} />;
};

export { useBreadcrumb };
