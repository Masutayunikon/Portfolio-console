<script setup>
import { computed, onMounted } from 'vue'
import { useGitHub } from '@/composables/useGitHub.js'

const { repos, loading, error, fetchRepos } = useGitHub()

onMounted(fetchRepos)

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Vue: '#42b883',
  Python: '#3572A5', PHP: '#4F5D95', HTML: '#e34c26', CSS: '#563d7c',
  SCSS: '#c6538c', Shell: '#89e051', Go: '#00ADD8', Rust: '#dea584',
}

// Compute language stats from repos
const langStats = computed(() => {
  const counts = {}
  for (const repo of repos.value) {
    if (repo.language && !repo.fork) {
      counts[repo.language] = (counts[repo.language] ?? 0) + 1
    }
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({
      lang,
      count,
      pct: Math.round((count / total) * 100),
      color: LANG_COLORS[lang] ?? '#858585',
      bar: Math.round((count / total) * 40), // max 40 chars
    }))
})

// Activity: sort repos by updated_at for recent activity
const recentActivity = computed(() =>
  [...repos.value]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 8)
    .map(r => ({
      name: r.name,
      lang: r.language ?? '—',
      stars: r.stargazers_count,
      updated: new Date(r.updated_at),
      color: LANG_COLORS[r.language] ?? '#858585',
    }))
)

function relativeDate(date) {
  const diff = Math.floor((Date.now() - date) / 1000)
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString('fr-FR')
}
</script>

<template>
  <div class="code-view">
    <div class="line comment">// stats.vue</div>
    <div class="spacer" />

    <div v-if="loading" class="line comment">// Loading GitHub stats…</div>
    <div v-else-if="error" class="line comment">// Error: {{ error }}</div>

    <template v-else>
      <!-- Language breakdown -->
      <div class="line"><span class="token-keyword">const</span> <span class="token-function">languages</span> <span class="token-operator">=</span> <span class="token-operator">{</span></div>
      <div class="spacer-sm" />

      <div v-for="item in langStats" :key="item.lang" class="lang-row">
        <span class="lang-name token-string">"{{ item.lang }}"</span>
        <span class="token-operator">:</span>
        <div class="bar-wrap">
          <div class="bar-fill" :style="{ width: item.pct + '%', background: item.color }" />
        </div>
        <span class="pct token-number">{{ item.pct }}%</span>
        <span class="repo-count token-comment">// {{ item.count }} repo{{ item.count > 1 ? 's' : '' }}</span>
      </div>

      <div class="spacer-sm" />
      <div class="line"><span class="token-operator">}</span></div>

      <div class="spacer" />

      <!-- Recent activity -->
      <div class="line"><span class="token-keyword">const</span> <span class="token-function">recentActivity</span> <span class="token-operator">=</span> <span class="token-operator">[</span></div>
      <div class="spacer-sm" />

      <div v-for="repo in recentActivity" :key="repo.name" class="activity-row">
        <span class="act-dot" :style="{ background: repo.color }" />
        <span class="act-name token-function">{{ repo.name }}</span>
        <span class="act-lang token-comment">{{ repo.lang }}</span>
        <span class="act-stars token-number" v-if="repo.stars">⭐{{ repo.stars }}</span>
        <span class="act-date token-string">// {{ relativeDate(repo.updated) }}</span>
      </div>

      <div class="spacer-sm" />
      <div class="line"><span class="token-operator">]</span></div>

      <div class="spacer" />

      <!-- Summary -->
      <div class="line comment">// {{ repos.filter(r => !r.fork).length }} original repos · {{ repos.filter(r => r.fork).length }} forks · {{ langStats.length }} languages</div>
    </template>
  </div>
</template>

<style scoped>
.code-view { font-family: var(--font-mono); font-size: var(--font-size); line-height: var(--line-height); color: var(--text-main); }
.line { white-space: pre-wrap; display: flex; align-items: baseline; gap: 6px; }
.spacer { height: 1em; }
.spacer-sm { height: 0.4em; }
.comment { color: var(--text-comment); font-style: italic; }

/* Language bars */
.lang-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 0 2px 2em;
  font-size: 13px;
}

.lang-name { min-width: 110px; }

.bar-wrap {
  width: 180px;
  height: 10px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.pct { min-width: 36px; text-align: right; }
.repo-count { color: var(--text-comment); font-style: italic; }

/* Activity */
.activity-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 0 2px 2em;
  font-size: 13px;
}

.act-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.act-name { min-width: 180px; }
.act-lang { min-width: 90px; color: var(--text-comment); font-style: italic; }
.act-stars { color: var(--text-number); min-width: 40px; }
.act-date { color: var(--text-string); font-style: italic; }
</style>
