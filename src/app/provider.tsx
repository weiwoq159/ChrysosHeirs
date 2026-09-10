import type { ReactNode } from "react";

import { App as AntdApp, ConfigProvider } from "antd";

import { AmphoreusTheme } from "./theme";

interface AppProvidersProps {
  children: ReactNode;
}
export const AppProvider = ({ children }: AppProvidersProps) => {
  return (
    <ConfigProvider theme={AmphoreusTheme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};
