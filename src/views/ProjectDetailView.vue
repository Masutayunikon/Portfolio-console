<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { useGitHub } from '@/composables/useGitHub.js'

const route = useRoute()
const { fetchReadme } = useGitHub()

const content = ref(null)
const loading = ref(true)

async function load(repoName) {
  loading.value = true
  content.value = null
  const md = await fetchReadme(repoName)
  content.value = md ? marked.parse(md) : null
  loading.value = false
}

onMounted(() => load(route.params.repo))
watch(() => route.params.repo, load)
</script>

<template>
  <div class="code-view">
    <div v-if="loading" class="line comment">// Loading README…</div>

    <template v-else-if="content">
      <!-- Rendered README -->
      <div class="readme-render" v-html="content" />
    </template>

    <template v-else>
      <div class="line comment">// README.md not found</div>
      <div class="line comment">// This file is empty for now.</div>
    </template>
  </div>
</template>

<style scoped>
.code-view { font-family: var(--font-mono); font-size: var(--font-size); line-height: var(--line-height); color: var(--text-main); }
.line { white-space: pre-wrap; }
.comment { color: var(--text-comment); font-style: italic; }
</style>

<style>
/* README rendered markdown — unscoped for v-html */
.readme-render { color: var(--text-main); line-height: 1.7; }

.readme-render h1,
.readme-render h2,
.readme-render h3,
.readme-render h4 { color: var(--text-keyword); margin: 1.2em 0 0.4em; }

.readme-render h1 { font-size: 1.6em; }
.readme-render h2 { font-size: 1.3em; border-bottom: 1px solid var(--border); padding-bottom: 4px; }

.readme-render p { margin: 0.6em 0; }

.readme-render a { color: var(--text-function); }
.readme-render a:hover { text-decoration: underline; }

.readme-render code {
  background: var(--bg-sidebar);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 1px 5px;
  font-family: var(--font-mono);
  font-size: 0.92em;
  color: var(--text-string);
}

.readme-render pre {
  background: var(--bg-sidebar);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px 16px;
  overflow-x: auto;
  margin: 1em 0;
}
.readme-render pre code {
  background: none;
  border: none;
  padding: 0;
  color: var(--text-main);
}

.readme-render ul, .readme-render ol { padding-left: 1.5em; margin: 0.6em 0; }
.readme-render li { margin: 0.2em 0; }

.readme-render blockquote {
  border-left: 3px solid var(--status-bar);
  padding-left: 12px;
  color: var(--text-dim);
  margin: 0.8em 0;
  font-style: italic;
}

.readme-render img { max-width: 100%; border-radius: 4px; }

.readme-render table { border-collapse: collapse; width: 100%; margin: 1em 0; }
.readme-render th, .readme-render td { border: 1px solid var(--border); padding: 6px 12px; }
.readme-render th { background: var(--bg-sidebar); color: var(--text-keyword); }
</style>
