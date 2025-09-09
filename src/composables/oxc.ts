import { createGlobalState } from '@vueuse/core'
import {
  computed,
  ref,
  shallowRef,
  toRaw,
  triggerRef,
  watch,
  watchEffect,
} from 'vue'
import { activeTab, editorValue } from '~/composables/state'
import { PLAYGROUND_DEMO_CODE } from '~/utils/constants'
import { atou, utoa } from '~/utils/url'

async function initialize() {
  try {
    const { Oxc } = await import('oxc-playground')
    return new Oxc()
  } catch {
    // Fallback for development when oxc-playground is not available
    return {} as any
  }
}

export const loadingOxc = ref(true)
export const oxcPromise = initialize().finally(() => (loadingOxc.value = false))

export const useOxc = createGlobalState(async () => {
  const options = ref({
    run: {
      lint: true,
      formatter: false,
      formatterIr: false,
      transform: false,
      isolatedDeclarations: false,
      whitespace: false,
      mangle: false,
      compress: false,
      scope: true,
      symbol: true,
    },
    parser: {
      extension: 'tsx',
      allowReturnOutsideFunction: true,
      preserveParens: true,
      allowV8Intrinsics: true,
    },
    linter: {},
    transformer: {
      target: 'es2015',
      useDefineForClassFields: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    },
    isolatedDeclarations: {
      stripInternal: false,
    },
    codegen: {
      normal: true,
      jsdoc: true,
      annotation: true,
      legal: true,
    },
    compress: {},
    mangle: {
      topLevel: true,
      keepNames: false,
    },
    controlFlow: {
      verbose: false,
    },
  })
  const oxc = await oxcPromise
  const state = shallowRef(oxc)
  const error = ref<unknown>()

  function run() {
    const errors: unknown[] = []
    const originalError = console.error
    console.error = function (...msgs) {
      errors.push(...msgs)
      return originalError.apply(this, msgs)
    }
    try {
      oxc.run?.(editorValue.value, toRaw(options.value))
      // Reset error if successful
      error.value = undefined
    } catch (error_) {
      console.error(error_)
      error.value = errors.length ? errors : error_
    }
    console.error = originalError
    triggerRef(state)
  }
  watch([options, editorValue, activeTab], run, { deep: true })

  let rawUrlState: string | undefined
  let urlState: any
  try {
    rawUrlState = atou(location.hash!.slice(1))
    urlState = rawUrlState && JSON.parse(rawUrlState)
  } catch (error) {
    console.error(error)
  }

  if (urlState?.o) {
    options.value = urlState.o
  }

  if (urlState?.t) {
    activeTab.value = urlState.t
  }

  editorValue.value = urlState?.c ?? PLAYGROUND_DEMO_CODE

  watchEffect(() => {
    const serialized = JSON.stringify({
      c: editorValue.value === PLAYGROUND_DEMO_CODE ? '' : editorValue.value,
      o: options.value,
      t: activeTab.value,
    })

    try {
      history.replaceState({}, '', `#${utoa(serialized)}`)
    } catch (error) {
      console.error(error)
    }
  })

  const monacoLanguage = computed(() => {
    const filename = `test.${options.value.parser.extension}`
    const ext = filename.split('.').pop()!
    if (['ts', 'mts', 'cts', 'tsx'].includes(ext)) return 'typescript'
    if (['js', 'mjs', 'cjs', 'jsx'].includes(ext)) return 'javascript'
    return 'plaintext'
  })

  // NOTE: do not free() on unmount. that hook is fired any time any consuming
  // component unmounts, which messes things up for other components.

  return {
    oxc: state,
    error,
    options,
    monacoLanguage,
  }
})
