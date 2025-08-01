<script setup lang="ts"></script>

<template>
  <div
    class="hidden items-center before:ml-4 before:mr-4 before:h-6 before:w-px xl:flex before:bg-gray-300 before:content-[''] dark:before:bg-gray-600"
  >
    <ul class="flex items-center gap-1">
      <li>
        <a
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          href="https://bsky.app/profile/boshen.github.io"
          aria-label="Bluesky"
          target="_blank"
          rel="noopener"
        >
          <div
            class="i-ri:bluesky-fill h-5 w-5 text-gray-600 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors duration-200"
          />
        </a>
      </li>
      <li>
        <a
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          href="https://discord.gg/9uXCAwqQZW"
          aria-label="Discord"
          target="_blank"
          rel="noopener"
        >
          <div
            class="i-ri:discord-fill h-5 w-5 text-gray-600 group-hover:text-indigo-500 dark:text-gray-400 dark:group-hover:text-indigo-400 transition-colors duration-200"
          />
        </a>
      </li>
      <li>
        <a
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          href="https://github.com/oxc-project/oxc"
          aria-label="GitHub"
          target="_blank"
          rel="noopener"
        >
          <div
            class="i-ri:github-fill h-5 w-5 text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white transition-colors duration-200"
          />
        </a>
      </li>
    </ul>
  </div>
</template>
