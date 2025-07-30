<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import { activeTab } from '~/composables/state'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/ui/tabs'
import CodegenPanel from './CodegenPanel.vue'
import ControlflowPanel from './ControlflowPanel.vue'
import EsTreePanel from './EsTreePanel.vue'
import FormatPanel from './FormatPanel.vue'
import FormatterPanel from './FormatterPanel.vue'
import RustAstPanel from './RustAstPanel.vue'
import ScopePanel from './ScopePanel.vue'
import SymbolPanel from './SymbolPanel.vue'

const { duration } = await useOxc()
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
      class="relative h-auto flex flex-shrink-0 justify-start gap-2 overflow-auto rounded-none p-2"
    >
      <TabsTrigger value="ast">ESTree AST</TabsTrigger>
      <TabsTrigger value="ir">Rust AST</TabsTrigger>
      <TabsTrigger value="codegen">Codegen</TabsTrigger>
      <!--
      <TabsTrigger value="formatter" :disabled="!options.run.formatterIr">
        Formatter IR
      </TabsTrigger>
      <TabsTrigger value="format" :disabled="!options.run.formatterFormat">
        Formatter
      </TabsTrigger>
      -->
      <TabsTrigger value="scope">Scope</TabsTrigger>
      <TabsTrigger value="symbol">Symbol</TabsTrigger>
      <TabsTrigger value="cfg">Controlflow Graph</TabsTrigger>
    </TabsList>

    <div class="h-full min-h-0 min-w-0">
      <TabsContent value="ast">
        <EsTreePanel />
      </TabsContent>
      <TabsContent value="codegen">
        <CodegenPanel />
      </TabsContent>
      <TabsContent value="ir">
        <RustAstPanel />
      </TabsContent>
      <TabsContent value="formatter">
        <FormatterPanel />
      </TabsContent>
      <TabsContent value="format">
        <FormatPanel />
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
    <div class="absolute bottom-2 right-2 opacity-60">{{ duration }} ms</div>
  </Tabs>
</template>
