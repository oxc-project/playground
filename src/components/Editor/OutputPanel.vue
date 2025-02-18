<script setup lang="ts">
import { useOxc } from '~/composables/oxc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/ui/tabs'
import AstPanel from './Output/AstPanel.vue'
import CodegenPanel from './Output/CodegenPanel.vue'
import ControlflowPanel from './Output/ControlflowPanel.vue'
import FormatPanel from './Output/FormatPanel.vue'
import IrPanel from './Output/IrPanel.vue'
import PrettierPanel from './Output/PrettierPanel.vue'
import ScopePanel from './Output/ScopePanel.vue'
import SymbolPanel from './Output/SymbolPanel.vue'

const { duration } = await useOxc()
</script>

<template>
  <Tabs
    class="h-full flex flex-1 flex-col flex-nowrap"
    default-value="ast"
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
      <TabsTrigger value="prettier" :disabled="!options.run.prettierIr">
        Prettier IR
      </TabsTrigger>
      <TabsTrigger value="format" :disabled="!options.run.prettierFormat">
        Prettier
      </TabsTrigger>
      -->
      <TabsTrigger value="scope">Scope</TabsTrigger>
      <TabsTrigger value="symbol">Symbol</TabsTrigger>
      <TabsTrigger value="cfg">Controlflow Graph</TabsTrigger>
    </TabsList>

    <div class="h-full min-h-0 min-w-0">
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
      <TabsContent value="cfg">
        <ControlflowPanel />
      </TabsContent>
    </div>
    <div class="absolute bottom-2 right-2 opacity-60">{{ duration }} ms</div>
  </Tabs>
</template>
