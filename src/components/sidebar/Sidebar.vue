<script setup lang="ts">
import { FocusScope } from "radix-vue";
import { nextTick, ref, watch } from "vue";
import Codegen from "./Codegen.vue";
import Linter from "./Linter.vue";
import Mangler from "./Mangler.vue";
import Minifier from "./Minifier.vue";
import OptionsDialog from "./OptionsDialog.vue";
import Parser from "./Parser.vue";
import Transformer from "./Transformer.vue";

const props = defineProps<{ open: boolean; modal: boolean }>();
const emit = defineEmits<{ close: [] }>();
const sidebar = ref<HTMLElement>();
let previousFocus: HTMLElement | undefined;

watch(
  () => props.open && props.modal,
  async (open, wasOpen, onCleanup) => {
    let cancelled = false;
    onCleanup(() => {
      cancelled = true;
    });
    if (open) {
      previousFocus = document.activeElement as HTMLElement;
      await nextTick();
      if (!cancelled) sidebar.value?.focus();
    } else if (wasOpen) {
      previousFocus?.focus();
      previousFocus = undefined;
    }
  },
  { flush: "post" },
);

function onEscape(event: KeyboardEvent) {
  if (props.modal && !event.defaultPrevented) {
    event.preventDefault();
    emit("close");
  }
}
</script>

<template>
  <FocusScope
    as-child
    :trapped="modal && open"
    :loop="modal && open"
    @mount-auto-focus.prevent
    @unmount-auto-focus.prevent
  >
    <aside
      id="configuration-sidebar"
      ref="sidebar"
      tabindex="-1"
      class="configuration-sidebar absolute inset-y-0 left-0 z-30 w-[264px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:static"
      :class="open ? 'flex' : 'hidden'"
      aria-label="Configuration"
      @keydown.esc="onEscape"
    >
      <nav
        class="configuration-options min-h-0 flex-1 overflow-y-auto px-5 py-5"
        aria-label="Oxc configuration options"
      >
        <Parser />
        <hr />
        <Linter />
        <hr />
        <Transformer />
        <hr />
        <div class="settings-category">
          <p class="settings-category-label">Minification</p>
          <Minifier />
          <p class="settings-category-label">Mangling</p>
          <Mangler />
        </div>
        <hr />
        <Codegen />
      </nav>
      <div class="configuration-footer shrink-0 border-t border-sidebar-border px-3 py-2">
        <OptionsDialog />
      </div>
    </aside>
  </FocusScope>
</template>
