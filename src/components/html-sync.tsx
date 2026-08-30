"use client";

import { useEffect } from "react";
import { useUi } from "@/store/ui";

import { getTheme } from "@/lib/themes";

/**
 * Single source of truth for <html lang/dir/data-theme> on the client.
 *
 * Theme precedence: routeTheme (pinned) > previewTheme (visitor toggle, only
 * while previewAllowed — i.e. the public demo) > baseTheme (admin DB setting).
 * Guest invitations and check-in pages never allow visitor overrides, so they
 * always render in the couple's chosen theme.
 */
export function HtmlSync({ baseTheme }: { baseTheme: string }) {
  const language = useUi((s) => s.language);
  const previewTheme = useUi((s) => s.previewTheme);
  const routeTheme = useUi((s) => s.routeTheme);
  const previewAllowed = useUi((s) => s.previewAllowed);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    const root = document.documentElement;
    const override =
      routeTheme ?? (previewAllowed && previewTheme ? previewTheme : null);
    
    const activeThemeId = override ?? baseTheme;
    root.dataset.theme = activeThemeId;

    // Apply global body typography via CSS variables
    const activeTheme = getTheme(activeThemeId);
    if (activeTheme?.typography) {
      root.style.setProperty("--body-font-variation-settings", activeTheme.typography.bodyFontVariationSettings);
      root.style.setProperty("--theme-letter-spacing", activeTheme.typography.letterSpacing);
      root.style.setProperty("--theme-line-height", activeTheme.typography.lineHeight);
    }
  }, [routeTheme, previewTheme, previewAllowed, baseTheme]);

  return null;
}
