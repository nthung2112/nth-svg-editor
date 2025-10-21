"use client";

import { Editor as MonacoEditor, type OnMount } from "@monaco-editor/react";

export type MonacoEditorType = Parameters<OnMount>[0];

type MonacoPaneProps = {
  theme: string | undefined;
  code: string;
  onChange: (value: string) => void;
  onMount?: (editor: MonacoEditorType) => void;
};

export function MonacoPane({
  theme,
  code,
  onChange,
  onMount,
}: MonacoPaneProps) {
  return (
    <MonacoEditor
      theme={theme}
      value={code}
      onChange={(value) => onChange(value ?? "")}
      language="html"
      options={{
        theme: theme,
        language: "html",
        minimap: { enabled: false },
        formatOnType: true,
        formatOnPaste: true,
      }}
      onMount={(editor) => onMount?.(editor)}
    />
  );
}
