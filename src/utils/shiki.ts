import { useMemoize, type MaybeRefOrGetter } from '@vueuse/core'
import { createHighlighterCoreSync, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import langJson from 'shiki/langs/json.mjs'
import langTsx from 'shiki/langs/tsx.mjs'
import langTs from 'shiki/langs/typescript.mjs'
import vitesseDark from 'shiki/themes/vitesse-dark.mjs'
import vitesseLight from 'shiki/themes/vitesse-light.mjs'
import { dark } from 'src/composables/state'
import { computed, toValue } from 'vue'

export const highlighter = createHighlighterCoreSync({
  themes: [vitesseLight, vitesseDark],
  langs: [langJson, langTs, langTsx],
  engine: createJavaScriptRegexEngine(),
})

export type ShikiLang = 'json' | 'tsx' | 'text'

export function highlight(
  highlighter: HighlighterCore,
  code: string,
  lang: ShikiLang,
) {
  return highlighter.codeToHtml(code, {
    lang,
    theme: dark.value ? 'vitesse-dark' : 'vitesse-light',
    transformers: [
      {
        name: 'add-style',
        pre(node) {
          this.addClassToHast(node, '!bg-transparent p-2')
        },
      },
    ],
  })
}

const highlightToken = useMemoize((code: string, theme: string) => {
  return highlighter.codeToTokens(code, {
    lang: 'typescript',
    theme,
  })
})

export function useHighlightColor(
  content: MaybeRefOrGetter<string | undefined>,
) {
  return computed(() => {
    const code = toValue(content)
    if (code == null) return ''
    const theme = `vitesse-${dark.value ? 'dark' : 'light'}`
    const result = highlightToken(code, theme)
    const token = result.tokens[0]
    const idx = code.startsWith('"') && token.length > 1 ? 1 : 0
    return token[idx].color
  })
}
