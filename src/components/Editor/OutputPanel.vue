<script setup lang="ts">
import { TabsTrigger, TabsContent, TabsList, TabsRoot } from "src/ui/tabs";
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
    class="flex flex-col flex-nowrap h-full contain-layout"
    default-value="ast"
    orientation="horizontal"
    activation-mode="manual"
  >
    <TabsList
      as="nav"
      class="flex flex-grow-0 flex-shrink relative gap-2 items-center px-2 py-3 max-h-1/5 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-px before:bg-no-repeat before:bg-[#e2e2e3] dark:before:bg-[#2e2e32]"
    >
      <TabsTrigger value="ast">AST</TabsTrigger>
      <TabsTrigger value="codegen">Codegen</TabsTrigger>
      <TabsTrigger value="ir">IR</TabsTrigger>
      <TabsTrigger value="prettier">Prettier</TabsTrigger>
      <TabsTrigger value="format">Format (Prettier)</TabsTrigger>
      <TabsTrigger value="scope">Scope</TabsTrigger>
      <TabsTrigger value="symbol">Symbol</TabsTrigger>
    </TabsList>
    <div class="w-full max-h-full overflow-scroll">
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
