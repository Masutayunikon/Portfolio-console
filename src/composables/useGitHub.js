import { ref } from 'vue'

const env      = window.__env__ ?? {}
const TOKEN    = env.VITE_GITHUB_TOKEN    || import.meta.env.VITE_GITHUB_TOKEN
const USERNAME = env.VITE_GITHUB_USERNAME || import.meta.env.VITE_GITHUB_USERNAME || 'Masutayunikon'
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

      // Proper UTF-8 decode (atob breaks on non-ASCII characters)
      const binary = atob(data.content.replace(/\n/g, ''))
      const bytes  = Uint8Array.from(binary, c => c.charCodeAt(0))
      let markdown = new TextDecoder('utf-8').decode(bytes)

      // Rewrite relative image URLs to raw.githubusercontent.com
      const branch = data.url?.includes('/git/blobs/') ? 'HEAD' : (data.html_url?.match(/blob\/([^/]+)\//)?.[1] ?? 'main')
      const rawBase = `https://raw.githubusercontent.com/${USERNAME}/${repoName}/${branch}`

      markdown = markdown.replace(
        /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
        (_, alt, src) => `![${alt}](${rawBase}/${src.replace(/^\.\//, '')})`
      )

      return markdown
    } catch {
      return null
    }
  }

  return { repos, loading, error, fetchRepos, fetchReadme }
}
