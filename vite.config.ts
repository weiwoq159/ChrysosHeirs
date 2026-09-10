import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

const resolvePath = (path: string): string => {
  return fileURLToPath(new URL(path, import.meta.url));
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      include: [/\.[tj]sx?$/],
      dts: "src/auto-imports.d.ts",
      imports: [
        "react",
        "react-router",
        "react-dom",
        {
          ahooks: ["useMount", "useRequest", "useDebounceFn", "useMemoizedFn", "useBoolean"],
        },
      ],
      viteOptimizeDeps: true,
      eslintrc: {
        enabled: false,
      },
    }),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      "@": resolvePath("./src"),
      "@tribios": resolvePath("./src/modules/apps/Tribios"),
    },
  },
});
