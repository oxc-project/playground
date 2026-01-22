<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "radix-vue";
import { cn } from "~/utils/cn";
import { buttonVariants, type ButtonVariants } from ".";
import type { HTMLAttributes } from "vue";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
