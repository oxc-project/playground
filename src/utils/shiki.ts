import { useMemoize } from '@vueuse/core'
import { computed, ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'
import { dark } from '~/composables/state'
import type { HighlighterCore } from 'shiki/core'

// Global highlighter instance - loaded lazily
let highlighterInstance: HighlighterCore | null = null
const isLoading = ref(false)
const isLoaded = ref(false)

export async function createHighlighter(): Promise<HighlighterCore> {
  if (highlighterInstance) return highlighterInstance

  if (isLoading.value) {
    // Wait for existing load to complete
    return new Promise((resolve) => {
      const checkLoaded = () => {
        if (highlighterInstance) {
          resolve(highlighterInstance)
        } else {
          setTimeout(checkLoaded, 10)
        }
      }
      checkLoaded()
    })
  }

  isLoading.value = true

  try {
    const [
      { createHighlighterCore },
      { createJavaScriptRegexEngine },
      langJson,
      langTs,
      langTsx,
      vitesseLight,
      vitesseDark,
    ] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
      import('shiki/langs/json.mjs'),
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/themes/vitesse-light.mjs'),
      import('shiki/themes/vitesse-dark.mjs'),
    ])

    highlighterInstance = await createHighlighterCore({
      themes: [vitesseLight.default, vitesseDark.default],
      langs: [langJson.default, langTs.default, langTsx.default],
      engine: createJavaScriptRegexEngine(),
    })

    isLoaded.value = true
    return highlighterInstance
  } finally {
    isLoading.value = false
  }
}

// Export reactive state for components to check loading status
export const shikiLoading = computed(() => isLoading.value)
export const shikiLoaded = computed(() => isLoaded.value)

export type ShikiLang = 'json' | 'tsx' | 'text' | 'typescript'

export async function highlight(
  code: string,
  lang: ShikiLang,
): Promise<string> {
  try {
    const highlighter = await createHighlighter()
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
  } catch (error) {
    console.warn('Failed to load Shiki highlighter:', error)
    // Fallback to plain text with basic styling
    return `<pre class="!bg-transparent p-2"><code>${escapeHtml(code)}</code></pre>`
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const highlightToken = useMemoize(async (code: string, theme: string) => {
  try {
    const highlighter = await createHighlighter()
    return highlighter.codeToTokens(code, {
      lang: 'typescript',
      theme,
    })
  } catch {
    return { tokens: [[{ color: '#666666' }]] } // Fallback gray color
  }
})

export function useHighlightColor(
  content: MaybeRefOrGetter<string | undefined>,
) {
  const color = ref('#666666') // Default color

  // Reactive computation that updates color when content or theme changes
  watchEffect(async () => {
    const code = toValue(content)
    if (code == null) {
      color.value = ''
      return
    }

    if (!isLoaded.value && !isLoading.value) {
      color.value = '#666666' // Default color when not loaded
      return
    }

    try {
      const theme = `vitesse-${dark.value ? 'dark' : 'light'}`
      // process the highlight after main rendering completes to prevent laggy
      await new Promise((res) => requestIdleCallback(res, { timeout: 500 }))
      const result = await highlightToken(code, theme)
      const token = result.tokens[0]
      const idx = code.startsWith('"') && token.length > 1 ? 1 : 0
      color.value = token[idx].color || '#666666'
    } catch {
      color.value = '#666666' // Fallback color
    }
  })

  return computed(() => color.value)
}
