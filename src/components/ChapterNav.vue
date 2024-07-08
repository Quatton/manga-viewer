<script setup lang="ts">
import type { Book } from '@/lib/query';

defineProps<{
  book: Book,
  currentChapter: number,
}>();

</script>


<template>
  <div class="chapter-nav">
    <button v-for="chapter in book.chapter_ids" @click="() => $emit('update:chapter', chapter)" :key="chapter" :class="{
      selected
        : currentChapter === chapter
    }">
      {{ chapter }}
    </button>
  </div>
</template>


<style scoped>
.chapter-nav {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 0.5rem;
  background-color: hsla(160, 100%, 37%, 1);
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
}

.selected {
  background-color: hsla(160, 100%, 37%, 0.2);
}
</style>