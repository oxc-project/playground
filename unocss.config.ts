import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind3,
  transformerDirectives,
} from "unocss";
import presetAnimations from "unocss-preset-animations";
import { presetShadcn } from "unocss-preset-shadcn";

export default defineConfig({
  presets: [
    presetWind3(),
    presetAnimations(),
    presetShadcn({
      color: "blue",
      darkSelector: ".dark",
    }),
    presetIcons({ scale: 1.2 }),
    presetAttributify(),
  ],
  transformers: [transformerDirectives()],
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        "src/**/*.{js,ts}",
      ],
    },
  },
});
