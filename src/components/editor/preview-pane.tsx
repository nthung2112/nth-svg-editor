"use client";

import Panzoom, { type PanzoomObject } from "@panzoom/panzoom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Maximize2,
  RefreshCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { type ButtonHTMLAttributes, type ReactNode, useEffect, useRef, useState } from "react";

type PanDirection = "up" | "down" | "left" | "right";
type PreviewPaneProps = {
  code: string;
};

/**
 * @description move the diagram
 * @param panzoom diagram container
 * @param direction pan direction
 */
function panDiagram(panzoom: PanzoomObject | null, direction: PanDirection): void {
  if (!panzoom) return;

  const panValues: { [key in PanDirection]: [number, number] } = {
    up: [0, -20],
    down: [0, 20],
    left: [-20, 0],
    right: [20, 0],
  };

  const [x, y] = panValues[direction];
  panzoom.pan(x, y, { relative: true, animate: true });
}

// Modal component
const DiagramModal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default"
        onClick={onClose}
        type="button"
        aria-label="Close modal"
      />

      {/* Modal Content */}
      <div className="relative bg-white border border-gray-300 rounded-lg shadow-xl max-w-[80%] min-w-[60%] max-h-[90%] overflow-auto animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50 border-b">
          <h3 className="text-lg font-semibold">Diagram Viewer</h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-md hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// Button component with consistent styling
const ControlButton = ({
  onClick,
  ariaLabel,
  className = "",
  children,
  ...props
}: {
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    type="button"
    className={`relative inline-block px-2 py-1 text-sm font-medium leading-5 text-[#24292f] bg-[#f6f8fa] border border-sm rounded-md cursor-pointer select-none transition-colors duration-200 focus:outline-none ${className}`}
    {...props}
  >
    {children}
  </button>
);

export function PreviewPaneContainer({ code }: PreviewPaneProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <PreviewPane code={code} onOpenModal={handleOpenModal} />

      <DiagramModal isOpen={isModalOpen} onClose={handleCloseModal}>
        {isModalOpen && <PreviewPane code={code} onOpenModal={handleOpenModal} isInModal={true} />}
      </DiagramModal>
    </>
  );
}

// Updated PreviewPane component
export function PreviewPane({
  code,
  onOpenModal,
  isInModal = false,
}: PreviewPaneProps & {
  onOpenModal?: () => void;
  isInModal?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const panzoomRef = useRef<PanzoomObject | null>(null);

  // Handle wheel events for zooming
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!panzoomRef.current) return;
    panzoomRef.current.zoomWithWheel(event.nativeEvent);
  };

  // Individual button click handlers
  const handleZoomIn = () => panzoomRef.current?.zoomIn();
  const handleZoomOut = () => panzoomRef.current?.zoomOut();
  const handleReset = () => panzoomRef.current?.reset();
  const handlePanUp = () => panDiagram(panzoomRef.current, "up");
  const handlePanDown = () => panDiagram(panzoomRef.current, "down");
  const handlePanLeft = () => panDiagram(panzoomRef.current, "left");
  const handlePanRight = () => panDiagram(panzoomRef.current, "right");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDialog = () => {
    if (!onOpenModal || isInModal) return;
    onOpenModal();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.warn("Cannot find control panel container");
      return;
    }
    const diagram = diagramRef.current;
    if (!diagram) {
      console.warn("Cannot find diagram within container");
      return;
    }

    // Initialize panzoom
    const panzoom = Panzoom(diagram);
    panzoomRef.current = panzoom;

    // Cleanup function
    return () => {
      panzoom.destroy();
      panzoomRef.current = null;
    };
  }, []);

  return (
    <div
      className="flex justify-center items-center w-full h-full"
      data-control-panel-container
      ref={containerRef}
      onWheel={handleWheel}
    >
      <div
        id="output"
        ref={diagramRef}
        data-svg="data-diagram-mermaid"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: true
        dangerouslySetInnerHTML={{ __html: code }}
      />
      {/* View Control Panel */}
      <div role="toolbar" className="absolute bottom-4 right-4 grid grid-cols-3 gap-1">
        <ControlButton
          onClick={handleZoomIn}
          ariaLabel="zoom in"
          className="col-start-3 row-start-1"
        >
          <ZoomIn size={16} />
        </ControlButton>

        <ControlButton
          onClick={handleZoomOut}
          ariaLabel="zoom out"
          className="col-start-3 row-start-3"
        >
          <ZoomOut size={16} />
        </ControlButton>

        <ControlButton onClick={handleReset} ariaLabel="reset" className="col-start-2 row-start-2">
          <RefreshCw size={16} />
        </ControlButton>

        <ControlButton onClick={handlePanUp} ariaLabel="up" className="col-start-2 row-start-1">
          <ChevronUp size={16} />
        </ControlButton>

        <ControlButton onClick={handlePanDown} ariaLabel="down" className="col-start-2 row-start-3">
          <ChevronDown size={16} />
        </ControlButton>

        <ControlButton onClick={handlePanLeft} ariaLabel="left" className="col-start-1 row-start-2">
          <ChevronLeft size={16} />
        </ControlButton>

        <ControlButton
          onClick={handlePanRight}
          ariaLabel="right"
          className="col-start-3 row-start-2"
        >
          <ChevronRight size={16} />
        </ControlButton>
      </div>

      {/* Details Control Panel */}
      {!isInModal && (
        <div role="toolbar" className="absolute top-4 right-4 grid gap-1 grid-cols-2">
          <ControlButton
            onClick={handleDialog}
            ariaLabel="dialog"
            className="col-start-1 row-start-1"
          >
            <Maximize2 size={16} />
          </ControlButton>
          <ControlButton
            onClick={handleCopy}
            ariaLabel="Copy to clipboard"
            className="col-start-2 row-start-1"
            data-clipboard-code="KEorBhYoFR43KyRYMRAgCTwsMDstPUVKQDswBAYkOzogCTwqNw0tOkArPQ4OCTwsMx4wB0UbIhIwWTYGMx4oLTcrPipRS0ctID0SS0Yr"
          >
            <Copy size={16} />
          </ControlButton>
        </div>
      )}
    </div>
  );
}
