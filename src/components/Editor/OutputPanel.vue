<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "src/ui/tabs";
import AstPanel from "./Output/AstPanel.vue";
import CodegenPanel from "./Output/CodegenPanel.vue";
import FormatPanel from "./Output/FormatPanel.vue";
import IrPanel from "./Output/IrPanel.vue";
import PrettierPanel from "./Output/PrettierPanel.vue";
import ScopePanel from "./Output/ScopePanel.vue";
import SymbolPanel from "./Output/SymbolPanel.vue";

// NOTE: using a loop with TabsTriggers breaks all tabs; all tabs get considered
// as active.
</script>

<template>
  <TabsRoot
    class="flex flex-col flex-nowrap h-full flex-1"
    default-value="ast"
    orientation="horizontal"
    activation-mode="manual"
  >
    <TabsList
      as="nav"
      class="flex flex-wrap gap-2 items-center px-2 py-3 border-b"
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
  </TabsRoot>
</template>
