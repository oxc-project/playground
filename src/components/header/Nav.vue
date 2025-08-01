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
            class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
            href="https://oxc.rs/docs/guide/introduction.html"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            >
              Guide
            </span>
            <div
              class="i-ri:arrow-right-up-line ml-2 h-3 w-3 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
            href="https://oxc.rs/docs/learn/parser_in_rust/intro.html"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
              >Learn</span
            >
            <div
              class="i-ri:arrow-right-up-line ml-2 h-3 w-3 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          href="https://oxc.rs/docs/contribute/introduction.html"
        >
          <span
            class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
          >
            Contribute
          </span>
          <div
            class="i-ri:arrow-right-up-line ml-2 h-3 w-3 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink class="flex items-center px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30" href="#" active>
          <span class="text-sm font-semibold text-blue-700 dark:text-blue-300"
            >Playground</span
          >
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
            href="#"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            >
              Resources
            </span>
            <div
              class="i-ri:arrow-right-up-line ml-2 h-3 w-3 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
