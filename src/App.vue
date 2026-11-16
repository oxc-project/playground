<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useMediaQuery } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import Header from "~/components/header/Header.vue";
import IoContainer from "~/components/IoContainer.vue";
import Sidebar from "~/components/sidebar/Sidebar.vue";
import { loadingOxc } from "~/composables/oxc";

const isDesktop = useMediaQuery("(min-width: 1024px)");
const settingsOpen = ref(isDesktop.value);
const mobileSettingsOpen = computed(() => settingsOpen.value && !isDesktop.value);
watch(isDesktop, (desktop) => {
  settingsOpen.value = desktop;
});
</script>

<template>
  <Suspense>
    <div class="app-shell flex h-dvh w-full flex-col overflow-hidden bg-sidebar text-foreground">
      <Header :settings-open="settingsOpen" @toggle-settings="settingsOpen = !settingsOpen" />
      <div class="relative flex min-h-0 flex-1">
        <button
          v-if="mobileSettingsOpen"
          class="absolute inset-0 z-20 bg-black/25 backdrop-blur-[2px]"
          aria-label="Close configuration"
          tabindex="-1"
          @click="settingsOpen = false"
        />
        <Sidebar :open="settingsOpen" :modal="!isDesktop" @close="settingsOpen = false" />
        <IoContainer :inert="mobileSettingsOpen" />
      </div>
    </div>

    <template #fallback>
      <div
        class="flex h-dvh flex-col items-center justify-center gap-4 bg-background text-foreground"
      >
        <img src="/logo-without-border.svg" class="h-10 w-10" alt="Oxc" />
        <div class="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Icon icon="ri:loader-2-line" class="animate-spin text-primary" />
          <span v-if="loadingOxc">Loading Oxc wasm…</span>
          <span v-else>Loading resources…</span>
        </div>
      </div>
    </template>
  </Suspense>
</template>
