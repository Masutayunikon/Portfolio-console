import { ref } from 'vue'

// Shared state across all components
const repos   = ref([])
const loading = ref(false)
const error   = ref(null)

export function useGitHub() {
  async function fetchRepos() {
    const cached = sessionStorage.getItem('gh_repos')
    if (cached) {
      repos.value = JSON.parse(cached)
      return
    }

    loading.value = true
    error.value   = null
    try {
      const res = await fetch('/api/github/repos')
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      repos.value = data
      sessionStorage.setItem('gh_repos', JSON.stringify(data))
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchReadme(repoName) {
    try {
      const res = await fetch(`/api/github/readme/${repoName}`)
      if (!res.ok) return null
      const { markdown } = await res.json()
      return markdown
    } catch {
      return null
    }
  }

  return { repos, loading, error, fetchRepos, fetchReadme }
}
