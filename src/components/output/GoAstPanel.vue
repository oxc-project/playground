<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, ref, watchEffect } from "vue";
import AstProperty from "~/components/ast/Property.vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import { useGoAst } from "~/composables/goAst";
import { useOxc } from "~/composables/oxc";
import OutputPreview from "./OutputPreview.vue";

const raw = ref(false);

const { loading, initialized, ast, astJson, errors, extension, sourceFileInfo, init } = useGoAst();
const { options } = await useOxc();

// Sync extension from oxc parser options
watchEffect(() => {
  extension.value = options.value.parser.extension;
});

onMounted(() => {
  init();
});
</script>

<template>
  <div class="h-full w-full overflow-auto p-2">
    <div v-if="loading" class="flex items-center justify-center gap-2 pt-8 text-lg">
      <Icon icon="ri:loader-2-line" class="animate-spin text-2xl" />
      <span>Loading Go AST wasm...</span>
    </div>

    <template v-else-if="initialized">
      <Checkbox v-model="raw" label="Raw" />

      <div v-if="sourceFileInfo" class="mt-2 mb-2 rounded border border-border p-2 text-xs opacity-70">
        <span v-if="sourceFileInfo.isDeclarationFile" class="mr-2 rounded bg-blue-500/20 px-1.5 py-0.5 text-blue-400">.d.ts</span>
        <span v-if="sourceFileInfo.pragmas?.length" class="mr-2">
          Pragmas: {{ sourceFileInfo.pragmas.join(", ") }}
        </span>
        <span v-if="sourceFileInfo.referencedFiles?.length" class="mr-2">
          References: {{ sourceFileInfo.referencedFiles.length }}
        </span>
        <span v-if="sourceFileInfo.typeReferenceDirectives?.length">
          Type refs: {{ sourceFileInfo.typeReferenceDirectives.length }}
        </span>
      </div>

      <div v-if="errors?.length" class="mt-2 text-sm text-red-500">
        <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
      </div>

      <OutputPreview v-if="raw" :code="astJson" lang="json" />
      <div v-else class="pl-4 pt-2 text-sm leading-relaxed font-mono">
        <AstProperty :value="ast" root open />
      </div>
    </template>

    <div v-else class="pt-8 text-center text-sm opacity-60">
      Failed to load Go AST wasm.
    </div>
  </div>
</template>
