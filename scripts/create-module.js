import fs from "node:fs";
import path from "node:path";

const scriptArgs = process.argv.slice(2);
const [targetDirArg, rawName] = scriptArgs[0] === "--" ? scriptArgs.slice(1) : scriptArgs;

if (!targetDirArg || !rawName) {
  console.error('用法: node scripts/create-module.js "src/modules/apps" <name>');
  process.exit(1);
}

const toPascalCase = (value) =>
  value
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join("");

const toKebabCase = (value) =>
  value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const moduleName = toPascalCase(rawName);
const appName = toKebabCase(rawName);

if (!moduleName || !appName) {
  console.error("模块名称必须包含字母或数字。");
  process.exit(1);
}

const targetDir = path.resolve(targetDirArg);
const moduleDir = path.join(targetDir, moduleName);
const rootRegistryPath = path.join(targetDir, "registry.ts");
const rootRouterPath = path.resolve(targetDir, "..", "..", "router", "index.tsx");

if (fs.existsSync(moduleDir)) {
  console.error(`模块目录已存在：${moduleDir}`);
  process.exit(1);
}

const readRequiredFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`未找到所需文件：${filePath}`);
  }

  return fs.readFileSync(filePath, "utf8");
};

const insertImport = (content, importStatement) => {
  if (content.includes(importStatement)) {
    return content;
  }

  const imports = [...content.matchAll(/^import .*;$/gm)];
  const lastImport = imports.at(-1);

  if (!lastImport || lastImport.index === undefined) {
    return `${importStatement}\n\n${content}`;
  }

  const insertPosition = lastImport.index + lastImport[0].length;

  return `${content.slice(0, insertPosition)}\n${importStatement}${content.slice(insertPosition)}`;
};

const addAppEntry = (content) => {
  const entry = `  ["${appName}", ${moduleName}],`;
  const appEntriesPattern = /(const appEntries = \[)([\s\S]*?)(\]\s+as const satisfies ModuleEntries;)/;
  const match = content.match(appEntriesPattern);

  if (!match) {
    throw new Error("未找到 appEntries 注册表，请先将 src/modules/apps/registry.ts 恢复为当前模板结构。");
  }

  const entries = match[2].trim().replace(/,\s*$/, "");
  const formattedEntries = entries
    .split("\n")
    .map((line) => `  ${line.trim()}`)
    .join("\n");

  return content.replace(appEntriesPattern, `$1\n${formattedEntries},\n${entry}\n$3`);
};

const addRoutesByAppEntry = (content) => {
  const entry = `  ${appName}: ${moduleName}Routes,`;
  const routesByAppPattern =
    /(export const routesByApp = \{\n)([\s\S]*?)(\} satisfies Record<AppName, AppRouteObject\[]>;)/;
  const match = content.match(routesByAppPattern);

  if (!match) {
    throw new Error("未找到 routesByApp 注册表，请先将 src/router/index.tsx 恢复为当前模板结构。");
  }

  const entries = match[2].trim().replace(/,\s*$/, "");
  const formattedEntries = entries
    .split("\n")
    .map((line) => `  ${line.trim()}`)
    .join("\n");

  return content.replace(routesByAppPattern, `$1${formattedEntries},\n${entry}\n$3`);
};

let registryContent;
let routerContent;

try {
  registryContent = readRequiredFile(rootRegistryPath);
  routerContent = readRequiredFile(rootRouterPath);

  if (registryContent.includes(`["${appName}",`) || registryContent.includes(`{ ${moduleName} }`)) {
    throw new Error(`应用注册已包含 ${moduleName} 或 ${appName}。`);
  }

  if (routerContent.includes(`${appName}:`) || routerContent.includes(`{ ${moduleName}Routes }`)) {
    throw new Error(`路由注册已包含 ${moduleName}Routes。`);
  }

  registryContent = insertImport(registryContent, `import { ${moduleName} } from "./${moduleName}/registry";`);
  registryContent = addAppEntry(registryContent);

  routerContent = insertImport(
    routerContent,
    `import { ${moduleName}Routes } from "@/modules/apps/${moduleName}/router";`,
  );
  routerContent = addRoutesByAppEntry(routerContent);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const files = {
  "registry.ts": `import type { ModuleDefinition } from "@/shared/types/module";

export const ${moduleName}: ModuleDefinition = {
  name: "${moduleName}",
  title: "${moduleName}",
  purpose: "",
  path: "/${appName}",
  description: "",
  cover: null,
  descriptionHero: "",
};
`,
  [`layout/${moduleName}Layout.tsx`]: `import { AppLayout } from "@/shared/layout/AppLayout";

export const ${moduleName}Layout = () => {
  return <AppLayout appName="${appName}" />;
};
`,
  "page/Dashboard/Dashboard.tsx": `import { appModulesMap } from "@/modules/apps/registry";
import { Hero } from "@/shared/components";

const featureTags = ["应用索引", "分类筛选", "状态追踪"];

export const Dashboard = () => {
  const app = appModulesMap.get("${appName}");

  return (
    <>
      <Hero eyebrow="DASHBOARD" title="欢迎回来。" description={app?.descriptionHero ?? ""} tags={featureTags} />
    </>
  );
};
`,
  "router/index.tsx": `import type { AppRouteObject } from "@/shared/types/route";

import { ${moduleName}Layout } from "@/modules/apps/${moduleName}/layout/${moduleName}Layout";
import { Dashboard } from "@/modules/apps/${moduleName}/page/Dashboard/Dashboard";

export const ${moduleName}Routes: AppRouteObject[] = [
  {
    path: "${appName}",
    element: <${moduleName}Layout />,
    handle: {
      breadcrumb: "${moduleName}",
    },
    children: [
      {
        index: true,
        element: <Dashboard />,
        handle: {
          breadcrumb: "总览",
          menu: true,
        },
      },
    ],
  },
];
`,
  "shared/components/index.ts": "",
  "shared/ipc/index.ts": "",
  "shared/stores/index.ts": "",
};

for (const relativePath of Object.keys(files)) {
  fs.mkdirSync(path.dirname(path.join(moduleDir, relativePath)), { recursive: true });
}

for (const [relativePath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(moduleDir, relativePath), content);
}

fs.writeFileSync(rootRegistryPath, registryContent);
fs.writeFileSync(rootRouterPath, routerContent);

console.log(`Created module: ${moduleDir}`);
