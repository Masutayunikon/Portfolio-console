<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTabs } from '@/composables/useTabs.js'
import { useGitHub } from '@/composables/useGitHub.js'
import { useBlog } from '@/composables/useBlog.js'

const props = defineProps({
  panel: { type: String, default: 'explorer' }
})

const router = useRouter()
const { openTab } = useTabs()
const { repos, loading: reposLoading, error: reposError, fetchRepos } = useGitHub()
const { posts, loading: blogLoading, error: blogError, fetchPosts } = useBlog()

const projectsOpen = ref(true)
const searchQuery  = ref('')

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
  { id: 'home',         label: 'README.md',      route: '/',            icon: 'md'   },
  { id: 'about',        label: 'about.vue',       route: '/about',       icon: 'vue'  },
  { id: 'stats',        label: 'stats.vue',       route: '/stats',       icon: 'vue'  },
  { id: 'experience',   label: 'experience.vue',  route: '/experience',  icon: 'vue'  },
  { id: 'projects',     label: 'projects.vue',    route: '/projects',    icon: 'vue'  },
  { id: 'skills',       label: 'skills.vue',      route: '/skills',      icon: 'vue'  },
  { id: 'contact',      label: 'contact.vue',     route: '/contact',     icon: 'vue'  },
  { id: 'package-json', label: 'package.json',    route: '/package-json', icon: 'json' },
]

function navigate(file) {
  openTab({ id: file.id, label: file.label, route: file.route, icon: file.icon })
  router.push(file.route)
}

function navigateRepo(repo) {
  openTab({ id: `repo-${repo.name}`, label: repo.name, route: `/projects/${repo.name}`, icon: 'md' })
  router.push(`/projects/${repo.name}`)
}

function navigateBlogPost(post) {
  openTab({ id: `blog-${post.slug}`, label: `${post.slug}.md`, route: `/blog/${post.slug}`, icon: 'md' })
  router.push(`/blog/${post.slug}`)
}

// Search across static pages + repos + blog posts
const STATIC_PAGES = [
  { id: 'home',       label: 'README.md',     route: '/',           icon: 'md',  group: 'Pages' },
  { id: 'about',      label: 'about.vue',      route: '/about',      icon: 'vue', group: 'Pages' },
  { id: 'experience', label: 'experience.vue', route: '/experience', icon: 'vue', group: 'Pages' },
  { id: 'skills',     label: 'skills.vue',     route: '/skills',     icon: 'vue', group: 'Pages' },
  { id: 'contact',    label: 'contact.vue',    route: '/contact',    icon: 'vue', group: 'Pages' },
  { id: 'stats',      label: 'stats.vue',      route: '/stats',      icon: 'vue', group: 'Pages' },
]

const searchResults = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  const results = []
  STATIC_PAGES.forEach(p => {
    if (p.label.toLowerCase().includes(q))
      results.push({ ...p, type: 'page' })
  })
  repos.value.forEach(r => {
    if (`${r.name} ${r.description ?? ''}`.toLowerCase().includes(q))
      results.push({ id: `repo-${r.name}`, label: r.name, route: `/projects/${r.name}`, icon: 'md', group: 'Projets', type: 'repo', lang: r.language })
  })
  posts.value.forEach(p => {
    if (`${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase().includes(q))
      results.push({ id: `blog-${p.slug}`, label: p.title, route: `/blog/${p.slug}`, icon: 'md', group: 'Blog', type: 'blog', date: p.date })
  })
  return results
})

const groupedResults = computed(() => {
  const groups = {}
  searchResults.value.forEach(r => {
    if (!groups[r.group]) groups[r.group] = []
    groups[r.group].push(r)
  })
  return Object.entries(groups)
})

function openSearchResult(item) {
  openTab({ id: item.id, label: item.label, route: item.route, icon: item.icon })
  router.push(item.route)
}

fetchRepos()
watch(() => props.panel, (p) => {
  if (p === 'blog' || p === 'search') fetchPosts()
}, { immediate: true })
</script>

<template>
  <aside class="sidebar">

    <!-- EXPLORER -->
    <template v-if="panel === 'explorer'">
      <div class="panel-title">EXPLORER</div>
      <div class="tree">
        <div class="tree-root">
          <span class="folder-icon">&#9660;</span>
          <span class="root-label">PORTFOLIO — QUENTIN ROBERT</span>
        </div>
        <div class="tree-group">
          <div class="tree-folder">
            <span class="folder-icon">&#9660;</span>
            <span class="folder-icon-file">&#128193;</span>
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
            <div class="tree-folder sub" @click="projectsOpen = !projectsOpen">
              <span class="folder-icon">{{ projectsOpen ? '&#9660;' : '&#9658;' }}</span>
              <span class="folder-icon-file">&#128193;</span>
              <span>projects</span>
            </div>
            <template v-if="projectsOpen">
              <div v-if="reposLoading" class="tree-file comment">// Fetching repos&#8230;</div>
              <div v-else-if="reposError" class="tree-file error-msg">
                <div class="comment">// Error: {{ reposError }}</div>
              </div>
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
                    <span v-if="repo.stargazers_count" class="stars">&#11088;{{ repo.stargazers_count }}</span>
                    <span v-if="repo.fork" class="fork-badge">fork</span>
                  </span>
                </div>
              </template>
            </template>
          </div>
        </div>
        <div class="tree-file root-file" @click="navigate(staticFiles.find(f => f.id === 'home'))">
          <span class="file-dot md-dot" /><span class="file-ext-icon md">M</span>README.md
        </div>
        <div class="tree-file root-file" @click="navigate(staticFiles.find(f => f.id === 'package-json'))">
          <span class="file-dot json-dot" /><span class="file-ext-icon json">{}</span>package.json
        </div>
      </div>
    </template>

    <!-- SEARCH -->
    <template v-else-if="panel === 'search'">
      <div class="panel-title">RECHERCHE</div>
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          class="search-input"
          placeholder="Rechercher&#8230;"
          autofocus
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">&#215;</button>
      </div>
      <div v-if="!searchQuery" class="search-hint comment">// projets, blog, pages&#8230;</div>
      <div v-else-if="searchResults.length === 0" class="search-hint comment">
        // Aucun resultat pour "{{ searchQuery }}"
      </div>
      <div v-else class="search-results">
        <div v-for="[group, items] in groupedResults" :key="group" class="result-group">
          <div class="result-group-label">{{ group }}</div>
          <div
            v-for="item in items"
            :key="item.id"
            class="result-item"
            @click="openSearchResult(item)"
          >
            <span class="result-icon">
              <span v-if="item.type === 'blog'">&#128221;</span>
              <span v-else-if="item.type === 'repo'">
                <span class="lang-dot" :style="{ background: langColor(item.lang) }" />
              </span>
              <span v-else class="file-ext-icon vue" style="font-size:8px">V</span>
            </span>
            <span class="result-label">{{ item.label }}</span>
            <span v-if="item.date" class="result-date">{{ item.date }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- GITHUB / SOURCE CONTROL -->
    <template v-else-if="panel === 'github'">
      <div class="panel-title">SOURCE CONTROL</div>
      <div class="gh-panel">
        <div v-if="reposLoading" class="comment">// Loading repositories&#8230;</div>
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

    <!-- BLOG -->
    <template v-else-if="panel === 'blog'">
      <div class="panel-title">BLOG</div>
      <div v-if="blogLoading" class="comment" style="padding:12px">// Chargement des articles&#8230;</div>
      <div v-else-if="blogError" class="comment" style="padding:12px">// Erreur : {{ blogError }}</div>
      <div v-else-if="!posts.length" class="comment" style="padding:12px">// Aucun article pour l'instant.</div>
      <div v-else class="blog-list">
        <div
          v-for="post in posts"
          :key="post.slug"
          class="blog-item"
          @click="navigateBlogPost(post)"
        >
          <div class="blog-item-header">
            <span class="file-dot md-dot" />
            <span class="blog-item-title">{{ post.title }}</span>
          </div>
          <div v-if="post.date" class="blog-item-date">{{ post.date }}</div>
          <div v-if="post.description" class="blog-item-desc">{{ post.description }}</div>
          <div v-if="post.tags.length" class="blog-item-tags">
            <span v-for="tag in post.tags" :key="tag" class="blog-tag">#{{ tag }}</span>
          </div>
        </div>
      </div>
    </template>

  </aside>
</template>

<style scoped>
.sidebar { width: var(--sidebar-width); background: var(--bg-sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; flex-shrink: 0; }
.panel-title { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; color: var(--text-dim); padding: 10px 12px 6px; text-transform: uppercase; }

/* Tree */
.tree { padding: 0 0 12px; }
.tree-root { display: flex; align-items: center; gap: 4px; padding: 4px 8px; font-size: 11px; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
.tree-group { margin-bottom: 4px; }
.tree-folder { display: flex; align-items: center; gap: 4px; padding: 3px 8px 3px 12px; cursor: pointer; color: var(--text-main); font-size: 13px; }
.tree-folder.sub { padding-left: 24px; }
.tree-folder:hover { background: var(--bg-hover); }
.folder-icon { font-size: 10px; color: var(--text-dim); }
.folder-icon-file { font-size: 12px; }
.tree-file { display: flex; align-items: center; gap: 6px; padding: 2px 8px 2px 36px; cursor: pointer; color: var(--text-main); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: background 0.1s; }
.tree-file:hover { background: var(--bg-hover); }
.tree-file.root-file { padding-left: 16px; }
.file-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: var(--text-dim); }
.vue-dot  { background: #42b883; }
.md-dot   { background: #519aba; }
.json-dot { background: #cbcb41; }
.file-ext-icon { font-size: 9px; font-weight: 700; padding: 0 3px; border-radius: 2px; flex-shrink: 0; }
.file-ext-icon.vue  { background: #42b883; color: #fff; }
.file-ext-icon.md   { background: #519aba; color: #fff; }
.file-ext-icon.json { background: #cbcb41; color: #000; }
.comment { color: var(--text-comment); font-style: italic; font-size: 12px; }
.error-msg { flex-direction: column; align-items: flex-start; }
.repo-file { padding-left: 44px; }
.repo-name { flex: 1; overflow: hidden; text-overflow: ellipsis; }
.repo-meta { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.stars { font-size: 10px; color: var(--text-warning); }
.fork-badge { font-size: 9px; color: var(--text-dim); border: 1px solid var(--border); border-radius: 2px; padding: 0 3px; }

/* Search */
.search-box { display: flex; align-items: center; gap: 6px; margin: 6px 8px 2px; background: var(--bg-editor); border: 1px solid var(--border); border-radius: 4px; padding: 4px 8px; }
.search-icon { width: 14px; height: 14px; color: var(--text-dim); flex-shrink: 0; }
.search-input { flex: 1; background: none; border: none; outline: none; color: var(--text-main); font-family: var(--font-mono); font-size: 12px; }
.search-input::placeholder { color: var(--text-dim); }
.search-clear { background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 14px; padding: 0; line-height: 1; }
.search-clear:hover { color: var(--text-main); }
.search-hint { padding: 10px 12px; font-size: 11px; }
.search-results { padding: 4px 0; }
.result-group-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-dim); padding: 8px 12px 4px; }
.result-item { display: flex; align-items: center; gap: 6px; padding: 4px 12px; cursor: pointer; font-size: 12px; color: var(--text-main); transition: background 0.1s; }
.result-item:hover { background: var(--bg-hover); }
.result-icon { display: flex; align-items: center; font-size: 12px; flex-shrink: 0; width: 16px; }
.result-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.result-date { font-size: 10px; color: var(--text-dim); flex-shrink: 0; }
.lang-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

/* GitHub */
.gh-panel { padding: 8px; display: flex; flex-direction: column; gap: 6px; }
.gh-repo { padding: 8px; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; transition: background 0.15s; }
.gh-repo:hover { background: var(--bg-hover); }
.gh-repo-name { font-size: 12px; color: var(--text-function); margin-bottom: 4px; }
.gh-repo-meta { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.lang-badge { border-left: 3px solid; padding-left: 4px; color: var(--text-dim); }
.gh-date { color: var(--text-comment); }

/* Blog */
.blog-list { display: flex; flex-direction: column; padding: 4px 0; }
.blog-item { padding: 8px 12px; cursor: pointer; transition: background 0.1s; border-bottom: 1px solid var(--border); }
.blog-item:hover { background: var(--bg-hover); }
.blog-item-header { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.blog-item-title { font-size: 12px; color: var(--text-function); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.blog-item-date { font-size: 10px; color: var(--text-dim); margin-bottom: 2px; }
.blog-item-desc { font-size: 11px; color: var(--text-comment); font-style: italic; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.blog-item-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.blog-tag { font-size: 9px; color: var(--text-keyword); background: color-mix(in srgb, var(--text-keyword) 10%, transparent); border-radius: 3px; padding: 1px 5px; }
</style>
