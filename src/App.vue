<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import BookList from './components/BookList.vue';

import { useFetch, type Book, type Chapter } from '@/lib/query';
import ChapterNav from './components/ChapterNav.vue';
const { data: books, error: booksError } = useFetch<Array<Book>>("/books");

const currentBook = ref<number | null>(0);
const currentChapter = ref<number>(0);
const currentPage = ref<number>(0);
const matchingBook = ref<Book | null>(null);

watch(currentBook, (v) => {
  if (books.value === null || books.value.length === 0) {
    currentBook.value = null;
    return;
  }

  matchingBook.value = books.value.find((book) => book.id === v) ?? null;
  if (!matchingBook.value) {
    currentBook.value = books.value[0].id;
    return;
  }

})

watch(currentChapter, (v) => {
  if (!matchingBook.value) {
    currentChapter.value = 0;
    return;
  }

  if (v < matchingBook.value.chapter_ids[0]) {
    currentChapter.value = matchingBook.value.chapter_ids[0];
    return;
  }

  if (v > matchingBook.value.chapter_ids[matchingBook.value.chapter_ids.length - 1]) {
    currentChapter.value = matchingBook.value.chapter_ids[matchingBook.value.chapter_ids.length - 1];
    return;
  }
})

const { data: chapters, error: chaptersError } = useFetch<Chapter>((currentChapter) => `/chapters/${currentChapter.value}`, currentChapter, (currentChapter) => currentChapter.value !== 0);

</script>

<template>
  <header>
    <BookList @update:selected="currentBook = $event" :books="books" :error="booksError" :selected="currentBook" />
    <ChapterNav @update:chapter="currentChapter = $event; currentPage = 0;" v-if="matchingBook" :book="matchingBook"
      :currentChapter="currentChapter" />
  </header>

  <main>
    <template v-if="matchingBook && chapters && chapters.pages.length > 0">
      <template v-for="(page, idx) in chapters.pages">
        <div class="page" v-if="idx === currentPage" :key="page.id">
          <img :src="page.image.file" :alt="`Page ${page.id}, Image ID ${page.image.id}`" class="image" />
          <div class="absolute right" @click="currentPage < chapters.pages.length - 1 ? currentPage++ :
            currentChapter < matchingBook.chapter_ids[matchingBook.chapter_ids.length - 1] ?
              currentChapter++ && (currentPage = 0) : null
            ">

          </div>
          <div class="absolute left" @click="currentPage > 0 ? currentPage-- : currentPage = 0">

          </div>
        </div>
      </template>

      <p class="page-num">
        {{ currentPage + 1 }} / {{ chapters.pages.length }}
      </p>
    </template>
    <template v-else>
      <p v-if="chaptersError">{{ chaptersError.message }}</p>
    </template>

  </main>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.page {
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  position: relative;
}

.image {
  max-width: 60%;
  max-height: 50%;
}

.absolute {
  position: absolute;
  width: 50%;
  height: 100%;
}

.left {
  left: 0;
  background-color: red / 0.5;
}

.right {
  right: 0;
  background-color: blue / 0.5;
}

.page-num {
  text-align: center;
}
</style>
