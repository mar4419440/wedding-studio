"use client";

import React, { useEffect, useState } from "react";
import { getTheme, THEMES } from "@/lib/themes";

interface ThemedHeadingProps extends React.HTMLAttributes<HTMLElement> {
  /** The text content to display as fallback */
  text: string;
  /** The type of heading lockup to look for */
  type?: "heroNames" | "sectionTitle" | "dynamic";
  /** Fallback HTML element */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div" | "p";
}

export function ThemedHeading({
  text,
  type = "dynamic",
  as: Component = "h2",
  className = "",
  ...props
}: ThemedHeadingProps) {
  const [activeThemeId, setActiveThemeId] = useState<string>("ethereal-union-1");
  const [globalLang, setGlobalLang] = useState<string>("en");

  useEffect(() => {
    // Read the initial theme asynchronously to avoid ESLint set-state-in-effect warning
    const root = document.documentElement;
    queueMicrotask(() => {
      setActiveThemeId(root.dataset.theme || "ethereal-union-1");
      setGlobalLang(root.lang || "en");
    });

    // Observe changes to the html data-theme and lang attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          setActiveThemeId(root.dataset.theme || "ethereal-union-1");
        }
        if (mutation.attributeName === "lang") {
          setGlobalLang(root.lang || "en");
        }
      });
    });

    observer.observe(root, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const themeConfig = getTheme(activeThemeId);
  const typography = themeConfig?.typography;

  // Determine if this specific heading should be rendered in Arabic
  const isArabic = props.lang === "ar" || (!props.lang && globalLang === "ar");
  const activeFontFamily = isArabic 
    ? typography?.headingFontFamilyAr 
    : typography?.headingFontFamily;

  // Determine if we should try to render an SVG lockup
  const svgAsset =
    type !== "dynamic" && typography?.svgAssets
      ? typography.svgAssets[type]
      : null;

  // Render SVG lockup
  if (svgAsset) {
    return (
      <div className={`themed-heading-svg-wrapper ${className}`} {...props}>
        {/* TODO: Provide real custom SVGs externally at these paths */}
        <img
          src={svgAsset}
          alt={text}
          className="w-full max-w-lg mx-auto"
          onError={(e) => {
            // Fallback to text if SVG fails to load (e.g. during development before design is ready)
            e.currentTarget.style.display = "none";
            const sibling = e.currentTarget.nextElementSibling as HTMLElement;
            if (sibling) sibling.style.display = "block";
          }}
        />
        <Component
          className="svg-fallback-text"
          style={
            {
              display: "none",
              fontFamily: activeFontFamily,
              letterSpacing: typography?.letterSpacing,
              lineHeight: typography?.lineHeight,
            } as React.CSSProperties
          }
        >
          {text}
        </Component>
      </div>
    );
  }

  // Render Dynamic Text styled via font-variation-settings
  return (
    <Component
      style={
        {
          fontFamily: activeFontFamily,
        } as React.CSSProperties
      }
      className={`font-variable text-balance ${className}`}
      {...props}
    >
      {text}
    </Component>
  );
}
