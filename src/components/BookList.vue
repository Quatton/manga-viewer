<script setup lang="ts">
import type { Book } from '@/lib/query';

defineProps<{
  books: Array<Book> | null,
  error: Error | null,
  selected: number | null,
}>();
</script>

<template>
  <nav>
    <template v-if="books && books.length > 1">
      <a v-for="book in books" :key="book.id" :class="{ selected: selected === book.id }"
        @click="() => $emit('update:selected', book.id)">
        {{ book.title }}
      </a>
    </template>
    <template v-else>
      <p v-if="error">{{ error.message }}</p>
      <p v-else>Loading...</p>
    </template>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.selected {
  font-weight: bold;
  background-color: hsla(160, 100%, 37%, 0.2);
}
</style>