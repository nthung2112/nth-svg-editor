"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";

export function useEditorTheme() {
  const { theme, systemTheme } = useTheme();
  return useMemo(() => {
    if (theme === "system") {
      return systemTheme === "dark" ? "vs-dark" : "vs";
    }
    return theme === "dark" ? "vs-dark" : "vs";
  }, [systemTheme, theme]);
}
