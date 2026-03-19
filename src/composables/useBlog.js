import { ref } from 'vue'

// Shared state — posts list cached at module level
const posts   = ref([])
const loading = ref(false)
const error   = ref(null)

export function useBlog() {
  async function fetchPosts() {
    if (posts.value.length) return // already loaded
    loading.value = true
    error.value   = null
    try {
      const res = await fetch('/api/blog/posts')
      if (!res.ok) throw new Error(`${res.status}`)
      posts.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchPost(slug) {
    try {
      const res = await fetch(`/api/blog/post/${slug}`)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }

  return { posts, loading, error, fetchPosts, fetchPost }
}
