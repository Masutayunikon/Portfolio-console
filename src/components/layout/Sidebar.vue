<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTabs } from '@/composables/useTabs.js'
import { useGitHub } from '@/composables/useGitHub.js'

const props = defineProps({
  panel: { type: String, default: 'explorer' }
})

const router = useRouter()
const { openTab } = useTabs()
const { repos, loading, error, fetchRepos } = useGitHub()

const projectsOpen = ref(true)

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Vue: '#42b883',
  Python: '#3572A5', PHP: '#4F5D95', HTML: '#e34c26', CSS: '#563d7c',
  SCSS: '#c6538c', Shell: '#89e051', Go: '#00ADD8', Rust: '#dea584',
  Java: '#b07219', 'C#': '#178600', Ruby: '#701516', Swift: '#fa7343',
}

function langColor(lang) {
  return LANG_COLORS[lang] ?? '#858585'
}

const staticFiles = [
  { id: 'home',        label: 'README.md',      route: '/',           icon: 'md'  },
  { id: 'about',       label: 'about.vue',       route: '/about',      icon: 'vue' },
  { id: 'experience',  label: 'experience.vue',  route: '/experience', icon: 'vue' },
  { id: 'projects',    label: 'projects.vue',    route: '/projects',   icon: 'vue' },
  { id: 'skills',      label: 'skills.vue',      route: '/skills',     icon: 'vue' },
  { id: 'contact',     label: 'contact.vue',     route: '/contact',    icon: 'vue' },
  { id: 'package-json', label: 'package.json',   route: '/package-json', icon: 'json' },
]

function navigate(file) {
  openTab({ id: file.id, label: file.label, route: file.route, icon: file.icon })
  router.push(file.route)
}

function navigateRepo(repo) {
  openTab({
    id: `repo-${repo.name}`,
    label: repo.name,
    route: `/projects/${repo.name}`,
    icon: 'md'
  })
  router.push(`/projects/${repo.name}`)
}

// Fetch repos when sidebar mounts
fetchRepos()
</script>

<template>
  <aside class="sidebar">
    <!-- ── EXPLORER panel ─────────────────────────── -->
    <template v-if="panel === 'explorer'">
      <div class="panel-title">EXPLORER</div>

      <div class="tree">
        <div class="tree-root">
          <span class="folder-icon">▾</span>
          <span class="root-label">PORTFOLIO — QUENTIN ROBERT</span>
        </div>

        <!-- src/ folder -->
        <div class="tree-group">
          <div class="tree-folder">
            <span class="folder-icon">▾</span>
            <span class="folder-icon-file">📁</span>
            <span>src</span>
          </div>

          <div class="tree-children">
            <div
              v-for="file in staticFiles.filter(f => f.icon === 'vue')"
              :key="file.id"
              class="tree-file"
              @click="navigate(file)"
            >
              <span class="file-dot vue-dot" />
              <span class="file-ext-icon vue">V</span>
              {{ file.label }}
            </div>

            <!-- projects/ sub-folder -->
            <div class="tree-folder sub" @click="projectsOpen = !projectsOpen">
              <span class="folder-icon">{{ projectsOpen ? '▾' : '▸' }}</span>
              <span class="folder-icon-file">📁</span>
              <span>projects</span>
            </div>

            <template v-if="projectsOpen">
              <!-- Loading state -->
              <div v-if="loading" class="tree-file comment">
                // Fetching repos…
              </div>
              <!-- Token missing -->
              <div v-else-if="error === 'missing_token'" class="tree-file error-msg">
                <div class="comment">// GitHub token missing</div>
                <div class="comment">// Add VITE_GITHUB_TOKEN to .env</div>
              </div>
              <!-- Error -->
              <div v-else-if="error" class="tree-file error-msg">
                <div class="comment">// Error: {{ error }}</div>
              </div>
              <!-- Repos list -->
              <template v-else>
                <div
                  v-for="repo in repos"
                  :key="repo.id"
                  class="tree-file repo-file"
                  @click="navigateRepo(repo)"
                >
                  <span class="file-dot" :style="{ background: langColor(repo.language) }" />
                  <span class="repo-name">{{ repo.name }}</span>
                  <span class="repo-meta">
                    <span v-if="repo.stargazers_count" class="stars">⭐{{ repo.stargazers_count }}</span>
                    <span v-if="repo.fork" class="fork-badge">fork</span>
                  </span>
                </div>
              </template>
            </template>
          </div>
        </div>

        <!-- Root files -->
        <div
          class="tree-file root-file"
          @click="navigate(staticFiles.find(f => f.id === 'home'))"
        >
          <span class="file-dot md-dot" />
          <span class="file-ext-icon md">M</span>
          README.md
        </div>
        <div
          class="tree-file root-file"
          @click="navigate(staticFiles.find(f => f.id === 'package-json'))"
        >
          <span class="file-dot json-dot" />
          <span class="file-ext-icon json">{}</span>
          package.json
        </div>
      </div>
    </template>

    <!-- ── GITHUB / SOURCE CONTROL panel ─────────── -->
    <template v-else-if="panel === 'github'">
      <div class="panel-title">SOURCE CONTROL</div>
      <div class="gh-panel">
        <div v-if="loading" class="comment">// Loading repositories…</div>
        <div v-else-if="error === 'missing_token'" class="comment">
          <div>// GitHub token missing</div>
          <div>// Add VITE_GITHUB_TOKEN to .env</div>
        </div>
        <template v-else>
          <div v-for="repo in repos" :key="repo.id" class="gh-repo" @click="navigateRepo(repo)">
            <div class="gh-repo-name">{{ repo.name }}</div>
            <div class="gh-repo-meta">
              <span v-if="repo.language" class="lang-badge" :style="{ borderColor: langColor(repo.language) }">
                {{ repo.language }}
              </span>
              <span class="gh-date">{{ new Date(repo.updated_at).toLocaleDateString('fr-FR') }}</span>
            </div>
          </div>
        </template>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
}

.panel-title {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  padding: 10px 12px 6px;
  text-transform: uppercase;
}

/* Tree */
.tree { padding: 0 0 12px; }

.tree-root {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tree-group { margin-bottom: 4px; }

.tree-folder {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px 3px 12px;
  cursor: pointer;
  color: var(--text-main);
  font-size: 13px;
}
.tree-folder.sub { padding-left: 24px; }
.tree-folder:hover { background: var(--bg-hover); }

.folder-icon { font-size: 10px; color: var(--text-dim); }
.folder-icon-file { font-size: 12px; }

.tree-children { }

.tree-file {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px 2px 36px;
  cursor: pointer;
  color: var(--text-main);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background 0.1s;
}
.tree-file:hover { background: var(--bg-hover); }
.tree-file.root-file { padding-left: 16px; }

.file-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--text-dim);
}
.vue-dot  { background: #42b883; }
.md-dot   { background: #519aba; }
.json-dot { background: #cbcb41; }

.file-ext-icon {
  font-size: 9px;
  font-weight: 700;
  padding: 0 3px;
  border-radius: 2px;
  flex-shrink: 0;
}
.file-ext-icon.vue  { background: #42b883; color: #fff; }
.file-ext-icon.md   { background: #519aba; color: #fff; }
.file-ext-icon.json { background: #cbcb41; color: #000; }

.comment { color: var(--text-comment); font-style: italic; padding: 4px 12px; font-size: 12px; }
.error-msg { flex-direction: column; align-items: flex-start; }

/* Repo file */
.repo-file { padding-left: 44px; }
.repo-name { flex: 1; overflow: hidden; text-overflow: ellipsis; }
.repo-meta { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.stars { font-size: 10px; color: var(--text-warning); }
.fork-badge {
  font-size: 9px;
  color: var(--text-dim);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 0 3px;
}

/* GitHub panel */
.gh-panel { padding: 8px; display: flex; flex-direction: column; gap: 6px; }

.gh-repo {
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}
.gh-repo:hover { background: var(--bg-hover); }

.gh-repo-name { font-size: 12px; color: var(--text-function); margin-bottom: 4px; }
.gh-repo-meta { display: flex; align-items: center; gap: 8px; font-size: 11px; }

.lang-badge {
  border-left: 3px solid;
  padding-left: 4px;
  color: var(--text-dim);
}
.gh-date { color: var(--text-comment); }
</style>
