import { useDark } from '@vueuse/core'
import { ref } from 'vue'
import type { Range } from '~/utils/range'

export const dark = useDark()
export const editorValue = ref('')

export const editorCursor = ref(0)
export const autoFocus = ref(true)
export const outputHoverRange = ref<Range>()

// Active tab state for output panel
export const activeTab = ref('codegen')
