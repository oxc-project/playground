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
            href="https://oxc.rs/docs/guide/introduction"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86] hover:text-[#3451b2] dark:hover:text-[#a8b1ff]"
            >
              Guide
            </span>
            <Icon
              icon="ri:arrow-right-up-line"
              class="ml-1 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6]"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-3"
            href="https://oxc.rs/docs/contribute/introduction"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86] hover:text-[#3451b2] dark:hover:text-[#a8b1ff]"
            >
              Contribute
            </span>
            <Icon
              icon="ri:arrow-right-up-line"
              class="ml-1 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6]"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink class="flex items-center px-3" href="#" active>
          <span class="text-sm text-[#3451b2] font-medium dark:text-[#a8b1ff]">Playground</span>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-3"
            href="https://oxc.rs/sponsor"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86] hover:text-[#3451b2] dark:hover:text-[#a8b1ff]"
            >
              Sponsor
            </span>
            <Icon
              icon="ri:arrow-right-up-line"
              class="ml-1 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6]"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-3"
            href="https://oxc.rs/docs/learn/parser_in_rust/intro"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86] hover:text-[#3451b2] dark:hover:text-[#a8b1ff]"
            >
              Resources
            </span>
            <Icon
              icon="ri:arrow-right-up-line"
              class="ml-1 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6]"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
