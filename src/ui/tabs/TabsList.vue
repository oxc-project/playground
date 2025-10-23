<script setup lang="ts">
import { TabsList, type TabsListProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '~/utils/cn'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="
      cn(
        'inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-muted/80 to-muted p-1.5 text-muted-foreground shadow-sm border border-[#e2e2e3]/50 dark:border-[#2e2e32]/50',
        props.class,
      )
    "
  >
    <slot />
  </TabsList>
</template>
