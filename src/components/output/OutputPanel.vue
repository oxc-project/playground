<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useOxc } from "~/composables/oxc";
import { activeTab } from "~/composables/state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/tabs";

import CodegenPanel from "./CodegenPanel.vue";
import ControlflowPanel from "./ControlflowPanel.vue";
import EsTreePanel from "./EsTreePanel.vue";
import FormatterPanel from "./FormatterPanel.vue";
import RustAstPanel from "./RustAstPanel.vue";
import ScopePanel from "./ScopePanel.vue";
import SymbolPanel from "./SymbolPanel.vue";

const { options } = await useOxc();

function updateRunOptions() {
  options.value.run.formatter = activeTab.value === "formatter";
  options.value.run.cfg = activeTab.value === "cfg";
}

watch([activeTab], updateRunOptions);

onMounted(updateRunOptions);
</script>

<template>
  <Tabs
    v-model="activeTab"
    default-value="ast"
    class="h-full flex flex-1 flex-col flex-nowrap"
    activation-mode="manual"
  >
    <TabsList
      as="nav"
      class="output-tabs relative flex h-[45px] shrink-0 items-stretch justify-start gap-0 overflow-x-auto rounded-none p-0"
    >
      <TabsTrigger value="codegen"> Printed </TabsTrigger>
      <TabsTrigger value="ast"> ESTree AST </TabsTrigger>
      <TabsTrigger value="ir"> Rust AST </TabsTrigger>
      <TabsTrigger value="formatter"> Formatter </TabsTrigger>
      <TabsTrigger value="scope"> Scope </TabsTrigger>
      <TabsTrigger value="symbol"> Symbol </TabsTrigger>
      <TabsTrigger value="cfg"> Controlflow Graph </TabsTrigger>
    </TabsList>

    <div class="h-full min-h-0 min-w-0">
      <TabsContent value="ast">
        <EsTreePanel />
      </TabsContent>
      <!-- Keep runner iframes mounted so switching tabs does not stop execution. -->
      <TabsContent value="codegen" force-mount>
        <CodegenPanel />
      </TabsContent>
      <TabsContent value="ir">
        <RustAstPanel />
      </TabsContent>
      <TabsContent value="formatter">
        <FormatterPanel />
      </TabsContent>
      <TabsContent value="scope">
        <ScopePanel />
      </TabsContent>
      <TabsContent value="symbol">
        <SymbolPanel />
      </TabsContent>
      <TabsContent value="cfg">
        <ControlflowPanel />
      </TabsContent>
    </div>
  </Tabs>
</template>
