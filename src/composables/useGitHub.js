import { ref } from 'vue'

const TOKEN    = import.meta.env.VITE_GITHUB_TOKEN
const USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'Masutayunikon'
const BASE     = 'https://api.github.com'

const headers = TOKEN
  ? { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3+json' }
  : { Accept: 'application/vnd.github.v3+json' }

// Shared state
const repos   = ref([])
const loading = ref(false)
const error   = ref(null)

export function useGitHub() {
  async function fetchRepos() {
    // Check sessionStorage cache first
    const cached = sessionStorage.getItem('gh_repos')
    if (cached) {
      repos.value = JSON.parse(cached)
      return
    }

    if (!TOKEN) {
      error.value = 'missing_token'
      return
    }

    loading.value = true
    error.value = null
    try {
      const res = await fetch(
        `${BASE}/users/${USERNAME}/repos?sort=updated&per_page=20`,
        { headers }
      )
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
      const res = await fetch(
        `${BASE}/repos/${USERNAME}/${repoName}/readme`,
        { headers }
      )
      if (!res.ok) return null
      const data = await res.json()
      return atob(data.content.replace(/\n/g, ''))
    } catch {
      return null
    }
  }

  return { repos, loading, error, fetchRepos, fetchReadme }
}
