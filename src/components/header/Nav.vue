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
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="group flex items-center rounded-lg px-3 py-2 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
            href="https://oxc.rs/docs/guide/introduction.html"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm text-[#3c3c43] font-medium transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
            >
              Guide
            </span>
            <div
              class="i-ri:arrow-right-up-line ml-1 h-3 w-3 text-[#3c3c43]/[.56] transition-transform group-hover:translate-x-0.5 dark:text-[#fffff5]/[.6] group-hover:-translate-y-0.5"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="group flex items-center rounded-lg px-3 py-2 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
            href="https://oxc.rs/docs/learn/parser_in_rust/intro.html"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm text-[#3c3c43] font-medium transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
              >Learn</span
            >
            <div
              class="i-ri:arrow-right-up-line ml-1 h-3 w-3 text-[#3c3c43]/[.56] transition-transform group-hover:translate-x-0.5 dark:text-[#fffff5]/[.6] group-hover:-translate-y-0.5"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          class="group flex items-center rounded-lg px-3 py-2 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
          href="https://oxc.rs/docs/contribute/introduction.html"
        >
          <span
            class="text-sm text-[#3c3c43] font-medium transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
          >
            Contribute
          </span>
          <div
            class="i-ri:arrow-right-up-line ml-1 h-3 w-3 text-[#3c3c43]/[.56] transition-transform group-hover:translate-x-0.5 dark:text-[#fffff5]/[.6] group-hover:-translate-y-0.5"
          />
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          class="flex items-center border border-blue-200/50 rounded-lg from-blue-500/10 to-purple-500/10 bg-gradient-to-r px-3 py-2 dark:border-blue-800/50 dark:from-blue-500/20 dark:to-purple-500/20"
          href="#"
          active
        >
          <span class="text-sm text-[#3451b2] font-semibold dark:text-[#a8b1ff]"
            >Playground</span
          >
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="group flex items-center rounded-lg px-3 py-2 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
            href="#"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm text-[#3c3c43] font-medium transition-colors dark:text-[#fffff5]/[.86] group-hover:text-[#3451b2] dark:group-hover:text-[#a8b1ff]"
            >
              Resources
            </span>
            <div
              class="i-ri:arrow-right-up-line ml-1 h-3 w-3 text-[#3c3c43]/[.56] transition-transform group-hover:translate-x-0.5 dark:text-[#fffff5]/[.6] group-hover:-translate-y-0.5"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
