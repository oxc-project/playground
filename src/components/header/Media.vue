<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="header-media hidden items-center border-l border-border pl-3 xl:flex">
    <ul class="flex items-center">
      <li>
        <a
          class="mx-2 block"
          href="https://x.com/OxcProject"
          aria-label="x"
          target="_blank"
          rel="noopener"
        >
          <Icon
            icon="ri:twitter-x-fill"
            class="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground"
          />
        </a>
      </li>
      <li>
        <a
          class="mx-2 block"
          href="https://bsky.app/profile/boshen.github.io"
          aria-label="bluesky"
          target="_blank"
          rel="noopener"
        >
          <Icon
            icon="ri:bluesky-fill"
            class="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground"
          />
        </a>
      </li>
      <li>
        <a
          class="mx-2 block"
          href="https://discord.gg/9uXCAwqQZW"
          aria-label="discord"
          target="_blank"
          rel="noopener"
        >
          <Icon
            icon="ri:discord-fill"
            class="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground"
          />
        </a>
      </li>
      <li>
        <a
          class="mx-2 block"
          href="https://github.com/oxc-project/oxc"
          aria-label="github"
          target="_blank"
          rel="noopener"
        >
          <Icon
            icon="ri:github-fill"
            class="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground"
          />
        </a>
      </li>
    </ul>
  </div>
</template>
