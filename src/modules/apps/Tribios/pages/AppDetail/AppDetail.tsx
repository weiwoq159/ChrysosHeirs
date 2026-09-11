import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

import { Button, Card, Col, Result, Row } from "antd";

import { tribiosRouteSegment } from "@tribios/constants";
import { useApplicationStore } from "@tribios/shared/stores/apps";

import { AppDetailHeader, AppDetailInspector, AppDetailOverview } from "./components";

import styles from "./AppDetail.module.scss";

const libraryPath = `/${tribiosRouteSegment}/library`;
const dashboardPath = `/${tribiosRouteSegment}`;

type DetailSource = "dashboard" | "library";

interface DetailLocationState {
  detailSource?: DetailSource;
}

export const AppDetail = () => {
  const { applicationKey } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const apps = useApplicationStore((state) => state.apps);
  const error = useApplicationStore((state) => state.error);
  const hasLoaded = useApplicationStore((state) => state.hasLoaded);
  const isLoading = useApplicationStore((state) => state.isLoading);
  const loadApps = useApplicationStore((state) => state.loadApps);
  const normalizedKey = applicationKey?.trim() ?? "";
  const application = useMemo(
    () => (normalizedKey ? apps.find(({ key }) => key === normalizedKey) : undefined),
    [apps, normalizedKey],
  );
  const detailSource = (location.state as DetailLocationState | null)?.detailSource;
  const backPath = detailSource === "dashboard" ? dashboardPath : libraryPath;
  const backLabel = detailSource === "dashboard" ? "返回主页" : "返回应用库";

  useEffect(() => {
    void loadApps();
  }, [loadApps]);

  const goBack = () => {
    navigate(backPath);
  };

  if (!normalizedKey) {
    return (
      <Result
        status="404"
        title="无效的应用地址"
        subTitle="链接缺少有效的应用标识，请从应用库重新进入。"
        extra={<Button onClick={goBack}>{backLabel}</Button>}
      />
    );
  }

  if (!hasLoaded && !error) {
    return <Card className={styles.loadingCard} loading={isLoading || !hasLoaded} />;
  }

  if (error && !hasLoaded) {
    return (
      <Result
        status="error"
        title="应用信息加载失败"
        subTitle={error}
        extra={
          <Button loading={isLoading} onClick={() => void loadApps()}>
            重新加载
          </Button>
        }
      />
    );
  }

  if (apps.length === 0) {
    return (
      <Result
        status="info"
        title="应用清单为空"
        subTitle="当前没有已收录的应用，无法打开应用详情。"
        extra={<Button onClick={goBack}>{backLabel}</Button>}
      />
    );
  }

  if (!application) {
    return (
      <Result
        status="404"
        title="未找到该应用"
        subTitle="该应用可能已从注册表中移除，或链接地址不正确。"
        extra={<Button onClick={goBack}>{backLabel}</Button>}
      />
    );
  }

  return (
    <section aria-labelledby="app-detail-title">
      <AppDetailHeader
        application={application}
        backLabel={backLabel}
        onBack={goBack}
        onRun={() => navigate(`/${tribiosRouteSegment}/runner/${application.key}`)}
        runDisabled={application.status !== "available"}
      />
      <Row gutter={[18, 18]} align="stretch">
        <Col xs={24} lg={16}>
          <AppDetailOverview application={application} />
        </Col>
        <Col xs={24} lg={8}>
          <AppDetailInspector application={application} />
        </Col>
      </Row>
    </section>
  );
};
