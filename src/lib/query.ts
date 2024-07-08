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