"use client";

import { Editor as MonacoEditor, type OnMount } from "@monaco-editor/react";
import { Check } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { toast } from "sonner";
import { useEditorTheme } from "@/hooks/useEditorTheme";
import { markdownItDiagramDom } from "@/tools";
import { ModeToggle } from "./mode-toggle";
import { Button, buttonVariants } from "./ui/button";

type MonacoEditorType = Parameters<OnMount>[0];

type Props = {
  defaultLayout?: number[];
};
const defaultCode = `<!-- sample rectangle -->
<svg
  width="200"
  height="200"
  viewBox="0 0 1024 1024"
  class="icon"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  fill="#000000"
>
  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path
      d="M512 960c-92.8 0-160-200-160-448S419.2 64 512 64s160 200 160 448-67.2 448-160 448z m0-32c65.6 0 128-185.6 128-416S577.6 96 512 96s-128 185.6-128 416 62.4 416 128 416z"
      fill="#050D42"
    ></path>
    <path
      d="M124.8 736c-48-80 92.8-238.4 307.2-363.2S852.8 208 899.2 288 806.4 526.4 592 651.2 171.2 816 124.8 736z m27.2-16c33.6 57.6 225.6 17.6 424-97.6S905.6 361.6 872 304 646.4 286.4 448 401.6 118.4 662.4 152 720z"
      fill="#050D42"
    ></path>
    <path
      d="M899.2 736c-46.4 80-254.4 38.4-467.2-84.8S76.8 368 124.8 288s254.4-38.4 467.2 84.8S947.2 656 899.2 736z m-27.2-16c33.6-57.6-97.6-203.2-296-318.4S184 246.4 152 304 249.6 507.2 448 622.4s392 155.2 424 97.6z"
      fill="#050D42"
    ></path>
    <path
      d="M512 592c-44.8 0-80-35.2-80-80s35.2-80 80-80 80 35.2 80 80-35.2 80-80 80zM272 312c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48zM416 880c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z m448-432c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z"
      fill="#2F4BFF"
    ></path>
  </g>
</svg>`;

function getDefaultCode(): string {
  if (typeof window === "undefined") return defaultCode;
  const local = window.localStorage.getItem("svg");
  if (local) return local;
  return defaultCode;
}

export function Editor({ defaultLayout = [30, 70] }: Props) {
  const theme = useEditorTheme();
  const [code, setCode] = useState(getDefaultCode());
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<MonacoEditorType | null>(null);

  useEffect(() => {
    markdownItDiagramDom();
  }, []);

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
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
    localStorage.setItem("svg", code);
    toast("Saved SVG", { icon: <Check /> });
  }

  function onLayout(sizes: number[]) {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
  }

  return (
    <>
      <header className="flex flex-row flex-nowrap justify-between px-4 py-2 border-b">
        <div className="font-bold text-lg">NTH SVG Editor</div>
        <div className="flex flex-row flex-nowrap gap-4">
          <input
            type="file"
            accept=".svg"
            className="hidden"
            ref={inputRef}
            multiple={false}
            aria-describedby="upload-svg"
            onChange={onUploadChange}
          />
          <Button
            type="button"
            id="upload-svg"
            variant="outline"
            onClick={handleUpload}
          >
            Upload SVG
          </Button>
          <Button type="button" variant="outline" onClick={handleDownload}>
            Download SVG
          </Button>
          <Button type="button" variant="outline" onClick={handleSave}>
            Save SVG
          </Button>
        </div>
        <div className="flex flex-row flex-nowrap gap-4">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="https://github.com/nthung2112/nth-svg-editor"
            target="_blank"
            title="View on GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>GitHub</title>
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </Link>
          <ModeToggle />
        </div>
      </header>
      <main className="h-full w-full flex flex-row flex-nowrap flex-1 min-h-0">
        <PanelGroup direction="horizontal" onLayout={onLayout}>
          <Panel defaultSize={defaultLayout[0]}>
            <MonacoEditor
              theme={theme}
              value={code}
              onChange={(value) => {
                if (value) setCode(value);
                else setCode("");
              }}
              language="html"
              options={{
                theme: theme,
                language: "html",
                minimap: { enabled: false },
                formatOnType: true,
                formatOnPaste: true,
              }}
              onMount={handleEditorDidMount}
            />
          </Panel>
          <PanelResizeHandle className="w-1 bg-secondary" />
          <Panel
            defaultSize={defaultLayout[1]}
            className="p-8 flex justify-center items-center h-full"
          >
            <div
              className="flex justify-center items-center w-full h-full"
              data-control-panel-container
            >
              <div
                id="output"
                className="diagram-m"
                data-svg="data-diagram-mermaid"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: true
                dangerouslySetInnerHTML={{ __html: code }}
              />
              <div data-control-panel="view">
                <button
                  data-control-btn="zoom-in"
                  aria-label="zoom in"
                  type="button"
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <path d="M3.75 7.5a.75.75 0 0 1 .75-.75h2.25V4.5a.75.75 0 0 1 1.5 0v2.25h2.25a.75.75 0 0 1 0 1.5H8.25v2.25a.75.75 0 0 1-1.5 0V8.25H4.5a.75.75 0 0 1-.75-.75Z" />
                    <path d="M7.5 0a7.5 7.5 0 0 1 5.807 12.247l2.473 2.473a.749.749 0 1 1-1.06 1.06l-2.473-2.473A7.5 7.5 0 1 1 7.5 0Zm-6 7.5a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z" />
                  </svg>
                </button>
                <button
                  data-control-btn="zoom-out"
                  aria-label="zoom out"
                  type="button"
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <path d="M4.5 6.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5Z"></path>
                    <path d="M0 7.5a7.5 7.5 0 1 1 13.307 4.747l2.473 2.473a.749.749 0 1 1-1.06 1.06l-2.473-2.473A7.5 7.5 0 0 1 0 7.5Zm7.5-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"></path>
                  </svg>
                </button>
                <button
                  data-control-btn="reset"
                  aria-label="reset"
                  type="button"
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z" />
                  </svg>
                </button>
                <button data-control-btn="up" aria-label="up" type="button">
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <title>Up</title>
                    <path d="M3.22 10.53a.749.749 0 0 1 0-1.06l4.25-4.25a.749.749 0 0 1 1.06 0l4.25 4.25a.749.749 0 1 1-1.06 1.06L8 6.811 4.28 10.53a.749.749 0 0 1-1.06 0Z" />
                  </svg>
                </button>
                <button data-control-btn="down" aria-label="down" type="button">
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <title>Down</title>
                    <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z" />
                  </svg>
                </button>
                <button data-control-btn="left" aria-label="left" type="button">
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <title>Left</title>
                    <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z"></path>
                  </svg>
                </button>
                <button
                  data-control-btn="right"
                  aria-label="right"
                  type="button"
                >
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <title>Right</title>
                    <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                </button>
              </div>

              <div data-control-panel="details">
                <button
                  data-control-btn="rough"
                  aria-label="rough to svg"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 256 256"
                  >
                    <title>Convert to Rough SVG</title>
                    <path
                      fill="currentColor"
                      d="M225.24 150.73a12 12 0 0 1-1.58 16.9C205.49 182.7 189.06 188 174.15 188c-19.76 0-36.86-9.29-51.88-17.44c-25.06-13.62-44.86-24.37-74.61.3a12 12 0 1 1-15.32-18.48c42.25-35 75-17.23 101.39-2.92c25.06 13.61 44.86 24.37 74.61-.31a12 12 0 0 1 16.9 1.58M47.66 106.85c29.75-24.68 49.55-13.92 74.61-.31c15 8.16 32.12 17.45 51.88 17.45c14.91 0 31.34-5.3 49.51-20.37a12 12 0 0 0-15.32-18.48c-29.75 24.67-49.55 13.92-74.61.3c-26.35-14.3-59.14-32.11-101.39 2.93a12 12 0 0 0 15.32 18.48"
                    />
                  </svg>
                  <svg
                    className="fg-none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <title>Loading</title>
                    <circle cx="12" cy="2" r="0" fill="currentColor">
                      <animate
                        attributeName="r"
                        begin="0"
                        calcMode="spline"
                        dur="1s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      ></animate>
                    </circle>
                    <circle
                      cx="12"
                      cy="2"
                      r="0"
                      fill="currentColor"
                      transform="rotate(45 12 12)"
                    >
                      <animate
                        attributeName="r"
                        begin="0.125s"
                        calcMode="spline"
                        dur="1s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      ></animate>
                    </circle>
                    <circle
                      cx="12"
                      cy="2"
                      r="0"
                      fill="currentColor"
                      transform="rotate(90 12 12)"
                    >
                      <animate
                        attributeName="r"
                        begin="0.25s"
                        calcMode="spline"
                        dur="1s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      ></animate>
                    </circle>
                    <circle
                      cx="12"
                      cy="2"
                      r="0"
                      fill="currentColor"
                      transform="rotate(135 12 12)"
                    >
                      <animate
                        attributeName="r"
                        begin="0.375s"
                        calcMode="spline"
                        dur="1s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      />
                    </circle>
                    <circle
                      cx="12"
                      cy="2"
                      r="0"
                      fill="currentColor"
                      transform="rotate(180 12 12)"
                    >
                      <animate
                        attributeName="r"
                        begin="0.5s"
                        calcMode="spline"
                        dur="1s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      />
                    </circle>
                    <circle
                      cx="12"
                      cy="2"
                      r="0"
                      fill="currentColor"
                      transform="rotate(225 12 12)"
                    >
                      <animate
                        attributeName="r"
                        begin="0.625s"
                        calcMode="spline"
                        dur="1s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      ></animate>
                    </circle>
                    <circle
                      cx="12"
                      cy="2"
                      r="0"
                      fill="currentColor"
                      transform="rotate(270 12 12)"
                    >
                      <animate
                        attributeName="r"
                        begin="0.75s"
                        calcMode="spline"
                        dur="1s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      ></animate>
                    </circle>
                    <circle
                      cx="12"
                      cy="2"
                      r="0"
                      fill="currentColor"
                      transform="rotate(315 12 12)"
                    >
                      <animate
                        attributeName="r"
                        begin="0.875s"
                        calcMode="spline"
                        dur="1s"
                        keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                        repeatCount="indefinite"
                        values="0;2;0;0"
                      />
                    </circle>
                  </svg>
                  <svg
                    className="fg-none"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <title>Converted to Rough SVG</title>
                    <path
                      fill="currentColor"
                      d="M7.4 22L6 20.6l6.9-6.925l3.5 3.5L21.575 12L23 13.425L16.4 20l-3.5-3.5zM4 21q-.825 0-1.412-.587T2 19V5q0-.825.588-1.412T4 3h14q.825 0 1.413.588T20 5v4.2H4zM4 7.2h14V5H4zm0 0V5z"
                    />
                  </svg>
                </button>
                <button
                  data-control-btn="dialog"
                  aria-label="dialog"
                  type="button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <title>Open in Modal</title>
                    <path
                      fill-rule="evenodd"
                      d="M3.72 3.72a.75.75 0 011.06 1.06L2.56 7h10.88l-2.22-2.22a.75.75 0 111.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.56l2.22 2.22a.75.75 0 11-1.06 1.06l-3.5-3.5a.75.75 0 010-1.06z"
                    />
                  </svg>
                </button>
                <button
                  data-clipboard-code="KEorBhYoFR43KyRYMRAgCTwsMDstPUVKQDswBAYkOzogCTwqNw0tOkArPQ4OCTwsMx4wB0UbIhIwWTYGMx4oLTcrPipRS0ctID0SS0Yr"
                  data-control-btn="copy"
                  aria-label="Copy to clipboard"
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"
                    ></path>
                  </svg>
                  <svg
                    className="fg-success fg-none"
                    aria-hidden="true"
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                  >
                    <path
                      fill-rule="evenodd"
                      fill="currentColor"
                      d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
                    ></path>
                  </svg>
                </button>
                <button
                  data-control-btn="download"
                  aria-label="download"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 256 256"
                  >
                    <title>Download SVG</title>
                    <path
                      fill="currentColor"
                      d="M228 144v64a12 12 0 0 1-12 12H40a12 12 0 0 1-12-12v-64a12 12 0 0 1 24 0v52h152v-52a12 12 0 0 1 24 0m-108.49 8.49a12 12 0 0 0 17 0l40-40a12 12 0 0 0-17-17L140 115V32a12 12 0 0 0-24 0v83L96.49 95.51a12 12 0 0 0-17 17Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </main>
    </>
  );
}
