<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '~/ui/navigation-menu'
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList class="gap-2">
      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-4 py-2 rounded-lg transition-all duration-200 group"
            href="https://oxc.rs/docs/guide/introduction.html"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff] transition-colors duration-200"
            >
              Guide
            </span>
            <div
              class="i-ri:arrow-right-up-line ml-2 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-4 py-2 rounded-lg transition-all duration-200 group"
            href="https://oxc.rs/docs/learn/parser_in_rust/intro.html"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff] transition-colors duration-200"
              >Learn</span
            >
            <div
              class="i-ri:arrow-right-up-line ml-2 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          class="flex items-center px-4 py-2 rounded-lg transition-all duration-200 group"
          href="https://oxc.rs/docs/contribute/introduction.html"
        >
          <span
            class="text-sm font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff] transition-colors duration-200"
          >
            Contribute
          </span>
          <div
            class="i-ri:arrow-right-up-line ml-2 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink class="flex items-center px-4 py-2 rounded-lg" href="#" active>
          <span class="text-sm font-semibold text-[#3451b2] dark:text-[#a8b1ff]"
            >Playground</span
          >
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-4 py-2 rounded-lg transition-all duration-200 group"
            href="#"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm font-medium text-[#3c3c43] dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff] transition-colors duration-200"
            >
              Resources
            </span>
            <div
              class="i-ri:arrow-right-up-line ml-2 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
