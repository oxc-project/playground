<script setup lang="ts">
import {
  NavigationMenuLink,
  useForwardPropsEmits,
  type NavigationMenuLinkEmits,
  type NavigationMenuLinkProps,
} from 'radix-vue'

const props = defineProps<NavigationMenuLinkProps>()
const emits = defineEmits<NavigationMenuLinkEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <NavigationMenuLink v-bind="forwarded">
    <slot />
  </NavigationMenuLink>
</template>
