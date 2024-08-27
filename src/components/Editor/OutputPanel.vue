<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/ui/tabs'
import AstPanel from './Output/AstPanel.vue'
import CodegenPanel from './Output/CodegenPanel.vue'
import FormatPanel from './Output/FormatPanel.vue'
import IrPanel from './Output/IrPanel.vue'
import PrettierPanel from './Output/PrettierPanel.vue'
import ScopePanel from './Output/ScopePanel.vue'
import SymbolPanel from './Output/SymbolPanel.vue'

// NOTE: using a loop with TabsTriggers breaks all tabs; all tabs get considered
// as active.

const { duration } = await useOxc()
</script>

<template>
  <Tabs
    class="flex flex-col flex-nowrap h-full flex-1"
    default-value="ast"
    activation-mode="manual"
  >
    <TabsList
      as="nav"
      class="flex flex-shrink-0 overflow-auto gap-2 rounded-none justify-start h-auto p-2 relative"
    >
      <TabsTrigger value="ast">AST</TabsTrigger>
      <TabsTrigger value="codegen">Codegen</TabsTrigger>
      <TabsTrigger value="ir">IR</TabsTrigger>
      <TabsTrigger value="prettier">Prettier</TabsTrigger>
      <TabsTrigger value="format">
        <div class="text-nowrap">Format (Prettier)</div>
      </TabsTrigger>
      <TabsTrigger value="scope">Scope</TabsTrigger>
      <TabsTrigger value="symbol">Symbol</TabsTrigger>
    </TabsList>

    <div class="min-h-0 min-w-0">
      <TabsContent value="ast">
        <AstPanel />
      </TabsContent>
      <TabsContent value="codegen">
        <CodegenPanel />
      </TabsContent>
      <TabsContent value="ir">
        <IrPanel />
      </TabsContent>
      <TabsContent value="prettier">
        <PrettierPanel />
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
    </div>
    <div class="absolute bottom-2 right-2 opacity-60">{{ duration }} ms</div>
  </Tabs>
</template>
