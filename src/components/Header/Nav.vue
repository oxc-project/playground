<script setup lang="ts">
import ArrowTopRightIcon from '~icons/ri/arrow-right-up-line'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from 'src/ui/navigation-menu'
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-3"
            href="https://oxc-project.github.io/docs/guide/introduction.html"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86] hover:text-[#3451b2] dark:hover:text-[#a8b1ff]"
            >
              Guide
            </span>
            <ArrowTopRightIcon
              class="ml-1 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6]"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-3"
            href="https://oxc-project.github.io/docs/learn/parser_in_rust/intro.html"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86] hover:text-[#3451b2] dark:hover:text-[#a8b1ff]"
              >Learn</span
            >
            <ArrowTopRightIcon
              class="ml-1 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6]"
            />
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          class="flex items-center px-3"
          href="https://oxc-project.github.io/docs/contribute/introduction.html"
        >
          <span
            class="text-sm text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86] hover:text-[#3451b2] dark:hover:text-[#a8b1ff]"
          >
            Contribute
          </span>
          <ArrowTopRightIcon
            class="ml-1 h-3 w-3 text-[#3c3c43]/[.56] dark:text-[#fffff5]/[.6]"
          />
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink class="flex items-center px-3" href="#" active>
          <span class="text-sm text-[#3451b2] font-medium dark:text-[#a8b1ff]"
            >Playground</span
          >
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink as-child>
          <a
            class="flex items-center px-3"
            href="#"
            target="_blank"
            rel="noopener"
          >
            <span
              class="text-sm text-[#3c3c43] font-medium dark:text-[#fffff5]/[.86] hover:text-[#3451b2] dark:hover:text-[#a8b1ff]"
            >
              Resources
            </span>
          </a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
