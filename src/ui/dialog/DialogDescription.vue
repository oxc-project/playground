<script setup lang="ts">
import {
  DialogDescription,
  useForwardProps,
  type DialogDescriptionProps,
} from 'radix-vue'
import { cn } from '~/utils/cn'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
  DialogDescriptionProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogDescription
    v-bind="forwardedProps"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
