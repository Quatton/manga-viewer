import { ref, watch, watchEffect, type Ref } from "vue";

export const baseUrl = "http://52.195.171.228:8080/"

export type Book = {
  id: number
  title: string
  chapter_ids: number[]
}

export type Chapter = {
  id: number
  title: string
  chapter_index: number,
  pages: Array<Page>
}

export type Page = {
  id: number
  image: PageImage
}

export type PageImage = {
  id: number
  file: string
}


/**
 * This is a very simple implementation of a useFetch hook that can handle loading, error, and timeout.
 * Casting data as `T | null` here is not ideal because it is misleading to the compiler, but it does help
 * with quick development. It stills lack `refresh` but if we were to go deeper with this, let's just use a library.
 * 
 * @param path The path after the base url (this is fixed)
 * @param key (optional) Not actually key but a reactive element that can be used to change the path (i don't think i like my solution here)
 * @param when (optional) A function that returns a boolean to determine if the fetch should be made, this is to prevent initial fetches when no chapter is selected
 * @returns 
 */
export function useFetch<T, D = any>(path: string | ((ref: Ref<D>) => string), key?: Ref<D>, when: (ref: Ref<D>) => boolean = () => true) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const abortController = new AbortController()
  const timer = ref<number | null>(null)


  watchEffect(async () => {
    if (key && when(key) === false) {
      return
    }

    try {
      loading.value = true
      error.value = null

      timer.value = setTimeout(() => {
        abortController.abort()
        throw new Error("Request timeout")
      }, 5000)

      const p = typeof path === "function" ?
        // todo: key is required
        path(key!) : path

      const res = await fetch(`${baseUrl}${p.replace(/^\//, "")}/`, {
        signal: abortController.signal,
      })

      if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
      }

      if (!res.ok) {
        throw new Error("Failed to fetch")
      }
      data.value = await res.json()
    } catch (e) {
      error.value = e as Error
      console.error(e)
    } finally {
      loading.value = false
    }
  })

  return { data, error, loading }
}