<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import BookList from './components/BookList.vue';
import Seeker from "./components/Seeker.vue";

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
    currentChapter.value = books.value[0].chapter_ids[0];
    return;
  }

  if (currentChapter.value < matchingBook.value.chapter_ids[0]) {
    currentChapter.value = matchingBook.value.chapter_ids[0];
    return;
  }

})

watch(currentChapter, (v) => {

  currentPage.value = 0;

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
    <div v-if="matchingBook && chapters && chapters.pages.length > 0" class="book-view">
      <template v-for="(page, idx) in chapters.pages">
        <div class="page" v-if="idx === currentPage" :key="page.id">
          <div class="image-container">
            <img :src="page.image.file" :alt="`Page ${page.id}, Image ID ${page.image.id}`" class="image" />
          </div>
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

      <!-- <input type="range" class="seeker" v-model.number="currentPage" :max="chapters.pages.length" :min="0" /> -->

      <Seeker v-model.number="currentPage" :max="chapters.pages.length" :min="0" />
    </div>
    <template v-else>
      <p v-if="chaptersError">{{ chaptersError.message }}</p>
    </template>

  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-items: center;
  flex: 1;
}

.image-container {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-items: center;
}

.book-view {
  display: flex;
  flex-direction: column;
  justify-items: center;
  height: 100%;
  flex-grow: 1;
}


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
  flex-grow: 1;
  position: relative;
}

.image {
  height: 500px;
  max-width: 100%;
  object-fit: contain;
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
