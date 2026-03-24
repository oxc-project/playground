<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/ui/navigation-menu";
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-3"
            href="https://oxc.rs/docs/guide/introduction.html"
            target="_blank"
            rel="noopener"
          >
            <span class="text-sm text-foreground font-medium hover:text-primary"> Guide </span>
            <Icon icon="ri:arrow-right-up-line" class="ml-1 h-3 w-3 text-muted-foreground" />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-3"
            href="https://oxc.rs/docs/learn/parser_in_rust/intro.html"
            target="_blank"
            rel="noopener"
          >
            <span class="text-sm text-foreground font-medium hover:text-primary">Learn</span>
            <Icon icon="ri:arrow-right-up-line" class="ml-1 h-3 w-3 text-muted-foreground" />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          class="flex items-center px-3"
          href="https://oxc.rs/docs/contribute/introduction.html"
        >
          <span class="text-sm text-foreground font-medium hover:text-primary"> Contribute </span>
          <div class="i-ri:arrow-right-up-line ml-1 h-3 w-3 text-muted-foreground" />
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink class="flex items-center px-3" href="#" active>
          <span class="text-sm text-primary font-medium">Playground</span>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
