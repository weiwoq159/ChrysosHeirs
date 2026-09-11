import { App, Col, Row } from "antd";

import { listBatchRenameFiles, previewBatchRename } from "@tribios/shared/ipc/commands";
import type { RenameItemInput, RenamePreviewItem } from "@tribios/shared/types/rename";

import { BatchRenamePreview } from "./components/BatchRenamePreview";
import { BatchRenameRulePanel } from "./components/BatchRenameRulePanel";
import type {
  BatchRenamePreviewRequest,
  BatchRenamePreviewResult,
  BatchRenamePreviewRow,
  BatchRenameRules,
} from "./types";

const fileNameFromPath = (path: string): string => path.split(/[/\\]/).at(-1) || path;

const buildRenameItems = (files: string[], rules: BatchRenameRules): RenameItemInput[] => {
  const parseReplacement = (): { from: string; to: string } => {
    const replacement = rules.replaceWith.trim();

    for (const separator of ["→", "->", "=>"] as const) {
      const index = replacement.indexOf(separator);
      if (index < 0) {
        continue;
      }

      const from = replacement.slice(0, index).trim();
      if (from.length > 0) {
        return { from, to: replacement.slice(index + separator.length).trim() };
      }
    }

    const from = rules.search.trim();
    if (from.length === 0) {
      throw new Error("查找替换模式需要填写查找内容，或使用“旧值 → 新值”格式");
    }

    return { from, to: replacement };
  };

  const buildTargetName = (fileName: string, sequence: number): string => {
    const lastDot = fileName.lastIndexOf(".");
    const extension = lastDot > 0 ? fileName.slice(lastDot) : "";
    const stem = lastDot > 0 ? fileName.slice(0, lastDot) : fileName;

    switch (rules.renameMode) {
      case "prefix":
        return `${rules.affix}${stem}${extension}`;
      case "suffix":
        return `${stem}${rules.affix}${extension}`;
      case "replace": {
        const { from, to } = parseReplacement();
        return `${stem.replaceAll(from, to)}${extension}`;
      }
      case "sequence":
        return `${rules.affix}${String(sequence).padStart(rules.sequencePadding, "0")}${extension}`;
    }
  };

  return [...files]
    .sort((left, right) =>
      fileNameFromPath(left).localeCompare(fileNameFromPath(right), undefined, { sensitivity: "base" }),
    )
    .map((sourcePath, index) => ({
      sourcePath,
      targetName: buildTargetName(fileNameFromPath(sourcePath), rules.sequenceStart + index),
    }));
};

const toPreviewResult = (items: RenamePreviewItem[]): BatchRenamePreviewResult => {
  let conflict = 0;
  let invalid = 0;
  let ready = 0;
  let unchanged = 0;

  const rows: BatchRenamePreviewRow[] = items.map((item) => {
    switch (item.status) {
      case "ready":
        ready += 1;
        break;
      case "unchanged":
        unchanged += 1;
        break;
      case "conflict":
        conflict += 1;
        break;
      case "invalid":
        invalid += 1;
        break;
    }

    return {
      ...item,
      changed: item.status !== "unchanged",
      sourceName: fileNameFromPath(item.sourcePath),
      targetName: fileNameFromPath(item.targetPath) || "—",
    };
  });

  return { conflict, invalid, items: rows, ready, total: rows.length, unchanged };
};

export const BatchRename = () => {
  const { message } = App.useApp();
  const [preview, setPreview] = useState<BatchRenamePreviewResult>();

  const handlePreview = async ({ targetDirectory, rules }: BatchRenamePreviewRequest) => {
    try {
      const files = await listBatchRenameFiles(targetDirectory);
      if (files.length === 0) {
        setPreview(undefined);
        message.warning("该文件夹中没有可重命名的文件");
        return;
      }

      const items = buildRenameItems(files, rules);
      const result = toPreviewResult(await previewBatchRename(items));
      setPreview(result);
      message.success(`预览完成：${result.ready} 个文件将被重命名`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "生成预览失败");
      throw error;
    }
  };

  return (
    <Row gutter={[18, 18]} align="stretch">
      <Col xs={24} lg={10} xl={6}>
        <BatchRenameRulePanel onPreview={handlePreview} onReset={() => setPreview(undefined)} />
      </Col>
      <Col xs={24} lg={14} xl={18}>
        <BatchRenamePreview result={preview} />
      </Col>
    </Row>
  );
};
