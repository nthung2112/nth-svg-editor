"use client";

import { Check } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { toast } from "sonner";
import { useEditorTheme } from "@/hooks/useEditorTheme";
import { getDefaultSvg, saveSvg } from "@/lib/svg";
import { HeaderBar } from "./editor/header-bar";
import { type MonacoEditorType, MonacoPane } from "./editor/monaco-pane";
import { PreviewPaneContainer } from "./editor/preview-pane";

type Props = {
  defaultLayout?: number[];
};

export function Editor({ defaultLayout = [30, 70] }: Props) {
  const theme = useEditorTheme();
  const [code, setCode] = useState(getDefaultSvg());
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<MonacoEditorType | null>(null);

  function handleEditorDidMount(editor: MonacoEditorType) {
    editorRef.current = editor;
  }

  function handleUpload() {
    inputRef.current?.click();
  }

  function handleDownload() {
    const blob = new Blob([code], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "image.svg";
    // Append to DOM to ensure compatibility before clicking, then clean up
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Downloaded SVG", { icon: <Check /> });
  }

  function onUploadChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setCode(result);
        }
      };
      reader.readAsText(file);

      event.target.value = "";
      toast("Uploaded SVG", { icon: <Check /> });
    }
  }

  function handleSave() {
    saveSvg(code);
    toast("Saved SVG", { icon: <Check /> });
  }

  function onLayout(sizes: number[]) {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  }

  return (
    <>
      <HeaderBar
        ref={inputRef}
        onUploadClick={handleUpload}
        onDownloadClick={handleDownload}
        onSaveClick={handleSave}
        onFileChange={onUploadChange}
      />
      <main className="h-full w-full flex flex-row flex-nowrap flex-1 min-h-0">
        <PanelGroup direction="horizontal" onLayout={onLayout}>
          <Panel defaultSize={defaultLayout[0]}>
            <MonacoPane
              theme={theme}
              code={code}
              onChange={setCode}
              onMount={handleEditorDidMount}
            />
          </Panel>
          <PanelResizeHandle className="w-1 bg-secondary" />
          <Panel
            defaultSize={defaultLayout[1]}
            className="p-8 flex justify-center items-center h-full"
          >
            <PreviewPaneContainer code={code} />
          </Panel>
        </PanelGroup>
      </main>
    </>
  );
}
