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
            <span
              class="text-xs text-muted-foreground font-medium transition-colors hover:text-foreground"
            >
              Guide
            </span>
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
            <span
              class="text-xs text-muted-foreground font-medium transition-colors hover:text-foreground"
              >Learn</span
            >
            <Icon icon="ri:arrow-right-up-line" class="ml-1 h-3 w-3 text-muted-foreground" />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          class="flex items-center px-3"
          href="https://oxc.rs/docs/contribute/introduction.html"
        >
          <span
            class="text-xs text-muted-foreground font-medium transition-colors hover:text-foreground"
          >
            Contribute
          </span>
          <div class="i-ri:arrow-right-up-line ml-1 h-3 w-3 text-muted-foreground" />
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
