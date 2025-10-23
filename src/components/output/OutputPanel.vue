<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useOxc } from '~/composables/oxc'
import { activeTab } from '~/composables/state'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/ui/tabs'

import CodegenPanel from './CodegenPanel.vue'
import ControlflowPanel from './ControlflowPanel.vue'
import EsTreePanel from './EsTreePanel.vue'
import FormatterPanel from './FormatterPanel.vue'
import RustAstPanel from './RustAstPanel.vue'
import ScopePanel from './ScopePanel.vue'
import SymbolPanel from './SymbolPanel.vue'

const { options } = await useOxc()

function updateRunOptions() {
  options.value.run.formatter = activeTab.value === 'formatter'
  options.value.run.cfg = activeTab.value === 'cfg'
}

watch([activeTab], updateRunOptions)

onMounted(updateRunOptions)
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
      class="scrollbar-thin relative h-auto flex flex-shrink-0 justify-start gap-1.5 overflow-auto border-b border-[#e2e2e3]/50 rounded-none from-white/50 to-transparent bg-gradient-to-b p-2 md:gap-2 dark:border-[#2e2e32]/50 dark:from-[#1b1b1f]/50 md:p-3"
    >
      <TabsTrigger
        value="codegen"
        class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-blue-50/50 data-[state=active]:from-blue-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:bg-gradient-to-r md:px-4 md:py-2 md:text-sm data-[state=active]:shadow-sm dark:hover:bg-blue-950/20 dark:data-[state=active]:from-blue-500/20 dark:data-[state=active]:to-purple-500/20"
        >Printed</TabsTrigger
      >
      <TabsTrigger
        value="ast"
        class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-blue-50/50 data-[state=active]:from-blue-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:bg-gradient-to-r md:px-4 md:py-2 md:text-sm data-[state=active]:shadow-sm dark:hover:bg-blue-950/20 dark:data-[state=active]:from-blue-500/20 dark:data-[state=active]:to-purple-500/20"
        >ESTree AST</TabsTrigger
      >
      <TabsTrigger
        value="ir"
        class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-blue-50/50 data-[state=active]:from-blue-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:bg-gradient-to-r md:px-4 md:py-2 md:text-sm data-[state=active]:shadow-sm dark:hover:bg-blue-950/20 dark:data-[state=active]:from-blue-500/20 dark:data-[state=active]:to-purple-500/20"
        >Rust AST</TabsTrigger
      >
      <TabsTrigger
        value="formatter"
        class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-blue-50/50 data-[state=active]:from-blue-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:bg-gradient-to-r md:px-4 md:py-2 md:text-sm data-[state=active]:shadow-sm dark:hover:bg-blue-950/20 dark:data-[state=active]:from-blue-500/20 dark:data-[state=active]:to-purple-500/20"
        >Formatter</TabsTrigger
      >
      <TabsTrigger
        value="scope"
        class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-blue-50/50 data-[state=active]:from-blue-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:bg-gradient-to-r md:px-4 md:py-2 md:text-sm data-[state=active]:shadow-sm dark:hover:bg-blue-950/20 dark:data-[state=active]:from-blue-500/20 dark:data-[state=active]:to-purple-500/20"
        >Scope</TabsTrigger
      >
      <TabsTrigger
        value="symbol"
        class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-blue-50/50 data-[state=active]:from-blue-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:bg-gradient-to-r md:px-4 md:py-2 md:text-sm data-[state=active]:shadow-sm dark:hover:bg-blue-950/20 dark:data-[state=active]:from-blue-500/20 dark:data-[state=active]:to-purple-500/20"
        >Symbol</TabsTrigger
      >
      <TabsTrigger
        value="cfg"
        class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:bg-blue-50/50 data-[state=active]:from-blue-500/10 data-[state=active]:to-purple-500/10 data-[state=active]:bg-gradient-to-r md:px-4 md:py-2 md:text-sm data-[state=active]:shadow-sm dark:hover:bg-blue-950/20 dark:data-[state=active]:from-blue-500/20 dark:data-[state=active]:to-purple-500/20"
        >Controlflow</TabsTrigger
      >
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
