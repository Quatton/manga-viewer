# manga-viewer

This project is created for the selection process of Summer Internship Program at Mantra.
It is intended to be as dependency-free as possible, although the developer experience could be drastically improved by 
(but not limited to) using:

- TailwindCSS
- Nuxt.js (or with router and better data fetching utilities like a real `useFetch` or `useAsyncData`)
  - Deduplication and caching
  - Prefetching
  - Better error handling & pending states
  - Refreshing & abort signals
- Everything is being handled in `App.vue` with children components emitting events. This is not very ideal and could be improved by using a more robust state management solution.

Other details will be included in the comments.

## Project setup

I used bun to scaffold and manage the packages but it is compatible with npm as well.

```
npm install
npm run dev
```
