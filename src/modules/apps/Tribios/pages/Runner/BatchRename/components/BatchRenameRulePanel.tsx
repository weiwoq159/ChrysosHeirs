import { FolderOpenOutlined } from "@ant-design/icons";
import { App, Button, Card, Col, Form, Input, InputNumber, Radio, Row, Space } from "antd";

import { open } from "@tauri-apps/plugin-dialog";

import type { BatchRenamePreviewRequest, BatchRenameRules } from "../types";

import styles from "../BatchRename.module.scss";

interface BatchRenameRulePanelProps {
  onPreview: (payload: BatchRenamePreviewRequest) => Promise<void>;
  onReset?: () => void;
}

const initialValues: BatchRenameRules = {
  affix: "",
  renameMode: "prefix",
  replaceWith: "",
  search: "",
  sequencePadding: 3,
  sequenceStart: 1,
};

const renameModeOptions = [
  { label: "添加前缀", value: "prefix" },
  { label: "添加后缀", value: "suffix" },
  { label: "查找替换", value: "replace" },
  { label: "序号重命名", value: "sequence" },
];

const hasReplacementSource = (search: string, replaceWith: string): boolean => {
  if (search.trim().length > 0) {
    return true;
  }

  return ["→", "->", "=>"].some((separator) => {
    const index = replaceWith.indexOf(separator);
    return index > 0 && replaceWith.slice(0, index).trim().length > 0;
  });
};

export const BatchRenameRulePanel = ({ onPreview, onReset }: BatchRenameRulePanelProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<BatchRenameRules>();
  const renameMode = Form.useWatch("renameMode", form);
  const [targetDirectory, setTargetDirectory] = useState<string>();
  const [isSelectingDirectory, setIsSelectingDirectory] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleSelectDirectory = async () => {
    setIsSelectingDirectory(true);

    try {
      const selected = await open({ directory: true, multiple: false, title: "选择需要重命名的文件夹" });
      if (typeof selected === "string") {
        setTargetDirectory(selected);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : "无法打开文件夹选择器");
    } finally {
      setIsSelectingDirectory(false);
    }
  };

  const handlePreview = async () => {
    if (!targetDirectory) {
      message.warning("请先选择需要重命名的文件夹");
      return;
    }

    const rules = await form.validateFields();
    setIsPreviewing(true);

    try {
      await onPreview({ targetDirectory, rules });
    } catch {
      // onPreview 已展示具体错误，这里只避免未处理的 Promise。
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setTargetDirectory(undefined);
    onReset?.();
  };

  return (
    <Card className={styles.ruleCard} classNames={{ body: styles.cardBody }}>
      <h2 className={styles.title}>重命名规则</h2>
      <p className={styles.description}>选择本地文件夹并配置文件名生成方式，预览通过后再确认变更。</p>
      <Form form={form} initialValues={initialValues} layout="vertical" requiredMark={false}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>目标文件夹</h3>
          <Space.Compact block>
            <Input readOnly value={targetDirectory} placeholder="请选择需要重命名的文件夹" />
            <Button
              type="primary"
              icon={<FolderOpenOutlined />}
              loading={isSelectingDirectory}
              onClick={() => void handleSelectDirectory()}
            >
              选择文件夹
            </Button>
          </Space.Compact>
        </section>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>命名方式</h3>
          <Form.Item name="renameMode">
            <Radio.Group
              className={styles.radioGroup}
              optionType="button"
              buttonStyle="solid"
              options={renameModeOptions}
            />
          </Form.Item>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label="前缀或后缀" name="affix">
                <Input disabled={renameMode === "replace"} placeholder="例如 draft_" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="查找内容"
                name="search"
                rules={[
                  {
                    validator: async (_, value) => {
                      if (renameMode !== "replace") return;
                      const replaceWith = String(form.getFieldValue("replaceWith") ?? "");
                      if (hasReplacementSource(String(value ?? ""), replaceWith)) return;
                      throw new Error("请填写查找内容，或在替换为中使用“旧值 → 新值”");
                    },
                  },
                ]}
              >
                <Input disabled={renameMode !== "replace"} placeholder="例如 old" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="替换为" name="replaceWith">
            <Input disabled={renameMode !== "replace"} placeholder="例如 new，或 old → new" />
          </Form.Item>
        </section>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>序号设置</h3>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label="起始序号" name="sequenceStart" rules={[{ required: true, type: "number", min: 1 }]}>
                <InputNumber disabled={renameMode !== "sequence"} min={1} precision={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="补零位数"
                name="sequencePadding"
                rules={[{ required: true, type: "number", min: 1, max: 10 }]}
              >
                <InputNumber
                  disabled={renameMode !== "sequence"}
                  max={10}
                  min={1}
                  precision={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </section>
        <Space.Compact block className={styles.actions}>
          <Button type="primary" loading={isPreviewing} onClick={() => void handlePreview()}>
            预览变更
          </Button>
          <Button onClick={handleReset}>重置规则</Button>
        </Space.Compact>
      </Form>
    </Card>
  );
};
