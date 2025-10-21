"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { ModeToggle } from "../mode-toggle";
import { Button, buttonVariants } from "../ui/button";

type HeaderBarProps = {
  onUploadClick: () => void;
  onDownloadClick: () => void;
  onSaveClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const HeaderBar = forwardRef<HTMLInputElement, HeaderBarProps>(
  ({ onUploadClick, onDownloadClick, onSaveClick, onFileChange }, ref) => {
    return (
      <header className="flex flex-row flex-nowrap justify-between px-4 py-2 border-b">
        <div className="font-bold text-lg">NTH SVG Editor</div>
        <div className="flex flex-row flex-nowrap gap-4">
          <input
            type="file"
            accept=".svg"
            className="hidden"
            ref={ref}
            multiple={false}
            aria-describedby="upload-svg"
            onChange={onFileChange}
          />
          <Button
            type="button"
            id="upload-svg"
            variant="outline"
            onClick={onUploadClick}
          >
            Upload SVG
          </Button>
          <Button type="button" variant="outline" onClick={onDownloadClick}>
            Download SVG
          </Button>
          <Button type="button" variant="outline" onClick={onSaveClick}>
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
    );
  },
);

HeaderBar.displayName = "HeaderBar";
