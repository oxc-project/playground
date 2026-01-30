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
              class="text-sm text-[#16171d] font-medium dark:text-white hover:text-[#0d6a73] dark:hover:text-[#32F3E9]"
            >
              Guide
            </span>
            <Icon
              icon="ri:arrow-right-up-line"
              class="ml-1 h-3 w-3 text-[#827A89]"
            />
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
              class="text-sm text-[#16171d] font-medium dark:text-white hover:text-[#0d6a73] dark:hover:text-[#32F3E9]"
            >Learn</span>
            <Icon
              icon="ri:arrow-right-up-line"
              class="ml-1 h-3 w-3 text-[#827A89]"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          class="flex items-center px-3"
          href="https://oxc.rs/docs/contribute/introduction.html"
        >
          <span
            class="text-sm text-[#16171d] font-medium dark:text-white hover:text-[#0d6a73] dark:hover:text-[#32F3E9]"
          >
            Contribute
          </span>
          <div
            class="i-ri:arrow-right-up-line ml-1 h-3 w-3 text-[#827A89]"
          />
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink class="flex items-center px-3" href="#" active>
          <span class="text-sm text-[#0d6a73] font-medium dark:text-[#32F3E9]">Playground</span>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a class="flex items-center px-3" href="#" target="_blank" rel="noopener">
            <span
              class="text-sm text-[#16171d] font-medium dark:text-white hover:text-[#0d6a73] dark:hover:text-[#32F3E9]"
            >
              Resources
            </span>
            <Icon
              icon="ri:arrow-right-up-line"
              class="ml-1 h-3 w-3 text-[#827A89]"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
