<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGitHub } from '@/composables/useGitHub.js'
import { useTabs } from '@/composables/useTabs.js'

const router = useRouter()
const { repos, loading, error, fetchRepos } = useGitHub()
const { openTab } = useTabs()

onMounted(fetchRepos)

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Vue: '#42b883',
  Python: '#3572A5', PHP: '#4F5D95', HTML: '#e34c26', CSS: '#563d7c',
}

function langColor(lang) { return LANG_COLORS[lang] ?? '#858585' }

function openRepo(repo) {
  openTab({ id: `repo-${repo.name}`, label: repo.name, route: `/projects/${repo.name}`, icon: 'md' })
  router.push(`/projects/${repo.name}`)
}
</script>

<template>
  <div class="code-view">
    <div class="line comment">// projects.vue</div>
    <div class="spacer" />

    <template v-if="loading">
      <div class="line comment">// Fetching repositories…</div>
      <div class="line comment">// GET /users/Masutayunikon/repos</div>
    </template>

    <template v-else-if="error === 'missing_token'">
      <div class="line comment">// GitHub token missing</div>
      <div class="line comment">// Add VITE_GITHUB_TOKEN to .env</div>
    </template>

    <template v-else-if="error">
      <div class="line comment">// Error: {{ error }}</div>
    </template>

    <template v-else>
      <div class="line comment">// {{ repos.length }} repositories found</div>
      <div class="spacer" />
      <div class="repos-grid">
        <div
          v-for="repo in repos"
          :key="repo.id"
          class="repo-card"
          @click="openRepo(repo)"
        >
          <div class="repo-header">
            <span class="repo-name">{{ repo.name }}</span>
            <span v-if="repo.fork" class="fork-tag">fork</span>
          </div>
          <p v-if="repo.description" class="repo-desc">{{ repo.description }}</p>
          <p v-else class="repo-desc comment">// No description</p>
          <div class="repo-footer">
            <span v-if="repo.language" class="lang">
              <span class="lang-dot" :style="{ background: langColor(repo.language) }" />
              {{ repo.language }}
            </span>
            <span v-if="repo.stargazers_count" class="stars">⭐ {{ repo.stargazers_count }}</span>
            <span class="updated">{{ new Date(repo.updated_at).toLocaleDateString('fr-FR') }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.code-view { font-family: var(--font-mono); font-size: var(--font-size); line-height: var(--line-height); color: var(--text-main); }
.line { white-space: pre-wrap; }
.spacer { height: 1em; }
.comment { color: var(--text-comment); font-style: italic; }

.repos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.repo-card {
  background: var(--bg-sidebar);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 14px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.repo-card:hover { background: var(--bg-hover); border-color: var(--status-bar); }

.repo-header { display: flex; align-items: center; gap: 8px; }
.repo-name { color: var(--text-function); font-weight: 500; }
.fork-tag { font-size: 10px; border: 1px solid var(--border); border-radius: 2px; padding: 0 4px; color: var(--text-dim); }

.repo-desc { font-size: 12px; color: var(--text-dim); flex: 1; }
.repo-desc.comment { font-style: italic; color: var(--text-comment); }

.repo-footer { display: flex; align-items: center; gap: 10px; font-size: 11px; color: var(--text-dim); margin-top: auto; }

.lang { display: flex; align-items: center; gap: 4px; }
.lang-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.stars { color: var(--text-warning); }
.updated { margin-left: auto; color: var(--text-comment); }
</style>
