import vitesseLight from "shiki/themes/vitesse-light.mjs";
import vitesseDark from "shiki/themes/vitesse-dark.mjs";

// Share syntax colors between Monaco, generated code, and AST values.
// Override only editor chrome to match the playground's surfaces and accent.
export const highlightThemes = [
  {
    ...vitesseLight,
    name: "oxc-light",
    colors: {
      ...vitesseLight.colors,
      "editor.foreground": vitesseLight.colors!["editor.foreground"]!,
      "editor.background": "#FDFDFC",
      "editorLineNumber.foreground": "#A4AAA2",
      "editorLineNumber.activeForeground": "#527A7A",
      "editor.lineHighlightBackground": "#F0F5F4",
      "editor.lineHighlightBorder": "#00000000",
      "editor.selectionBackground": "#CCEAE9",
      "editor.inactiveSelectionBackground": "#E2EEEE",
      "editorCursor.foreground": "#007A77",
      "editorIndentGuide.background1": "#E8EBE4",
      "editorIndentGuide.activeBackground1": "#C0CBBF",
      "editorWidget.background": "#FDFDFC",
      "editorWidget.border": "#DCDDDA",
      "editorOverviewRuler.border": "#00000000",
    },
  },
  {
    ...vitesseDark,
    name: "oxc-dark",
    colors: {
      ...vitesseDark.colors,
      "editor.foreground": vitesseDark.colors!["editor.foreground"]!,
      "editor.background": "#181B1A",
      "editorLineNumber.foreground": "#546158",
      "editorLineNumber.activeForeground": "#8BC2C0",
      "editor.lineHighlightBackground": "#1C2424",
      "editor.lineHighlightBorder": "#00000000",
      "editor.selectionBackground": "#1B4B4A",
      "editor.inactiveSelectionBackground": "#223B3A",
      "editorCursor.foreground": "#00F7F1",
      "editorIndentGuide.background1": "#2A322C",
      "editorIndentGuide.activeBackground1": "#465A4A",
      "editorWidget.background": "#202523",
      "editorWidget.border": "#343835",
      "editorOverviewRuler.border": "#00000000",
    },
  },
].map((theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    "editor.foreground": opaqueColor(
      theme.colors["editor.foreground"]!,
      theme.colors["editor.background"],
    ),
  },
  tokenColors: theme.tokenColors?.map((token) => ({
    ...token,
    settings: {
      ...token.settings,
      ...(token.settings.foreground && {
        foreground: opaqueColor(token.settings.foreground, theme.colors["editor.background"]),
      }),
    },
  })),
}));

// Monaco token colors discard alpha. Flatten translucent foregrounds against
// the shared canvas so quote punctuation and comments match the HTML output.
function opaqueColor(color: string, background: string): string {
  if (!/^#[\da-f]{8}$/i.test(color)) return color;
  const alpha = Number.parseInt(color.slice(7, 9), 16) / 255;
  const channels = [1, 3, 5].map((offset) => {
    const foreground = Number.parseInt(color.slice(offset, offset + 2), 16);
    const backdrop = Number.parseInt(background.slice(offset, offset + 2), 16);
    return Math.round(foreground * alpha + backdrop * (1 - alpha))
      .toString(16)
      .padStart(2, "0");
  });
  return `#${channels.join("")}`;
}
