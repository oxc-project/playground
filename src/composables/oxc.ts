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
import { editorValue } from '~/composables/state'
import { PLAYGROUND_DEMO_CODE } from '~/utils/constants'
import { atou, utoa } from '~/utils/url'
import type { Oxc, OxcOptions } from 'oxc-playground'

async function initialize(): Promise<Oxc> {
  const { Oxc } = await import('oxc-playground')
  return new Oxc()
}

export const loadingOxc = ref(true)
export const oxcPromise = initialize().finally(() => (loadingOxc.value = false))

export const useOxc = createGlobalState(async () => {
  const runDuration = ref<number>()

  const options = ref<Required<OxcOptions>>({
    run: {
      syntax: true,
      lint: true,
      scope: true,
      symbol: true,
      transform: false,
    },
    parser: {
      allowReturnOutsideFunction: true,
      preserveParens: true,
    },
    linter: {},
    transformer: {
      target: 'es2015',
      isolatedDeclarations: false,
    },
    codegen: {
      enableSourcemap: true,
    },
    minifier: {},
    controlFlow: {
      verbose: false,
    },
  })
  const oxc = await oxcPromise
  const state = shallowRef(oxc)
  const error = ref<unknown>()

  function run() {
    const start = performance.now()
    const errors: unknown[] = []
    const originalError = console.error
    console.error = function (...msgs) {
      errors.push(...msgs)
      return originalError.apply(this, msgs)
    }
    try {
      oxc.run(editorValue.value, toRaw(options.value))
    } catch (error_) {
      console.error(error_)
      error.value = errors.length ? errors : error_
    }
    console.error = originalError
    runDuration.value = +(performance.now() - start).toFixed(1)
    triggerRef(state)
  }
  watch([options, editorValue], run, { deep: true })

  const rawUrlState = atou(location.hash!.slice(1))
  const urlState = rawUrlState && JSON.parse(rawUrlState)
  if (rawUrlState) {
    options.value = urlState.o
  }
  editorValue.value = urlState?.c || PLAYGROUND_DEMO_CODE

  watchEffect(() => {
    const serialized = JSON.stringify({
      c: editorValue.value === PLAYGROUND_DEMO_CODE ? '' : editorValue.value,
      o: options.value,
    })
    history.replaceState({}, '', `#${utoa(serialized)}`)
  })

  const monacoLanguage = computed(() => {
    const filename = options.value.parser.sourceFilename || 'test.tsx'
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
    duration: runDuration,
    monacoLanguage,
  }
})
