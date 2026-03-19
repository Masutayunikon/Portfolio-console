<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { useBlog } from '@/composables/useBlog.js'

const route = useRoute()
const { fetchPost } = useBlog()

const post    = ref(null)
const content = ref(null)
const loading = ref(true)

async function load(slug) {
  loading.value = true
  post.value    = null
  content.value = null
  const data = await fetchPost(slug)
  if (data) {
    post.value    = data
    content.value = marked.parse(data.markdown)
  }
  loading.value = false
}

onMounted(() => load(route.params.slug))
watch(() => route.params.slug, load)
</script>

<template>
  <div class="code-view">
    <div v-if="loading" class="line comment">// Loading article…</div>

    <template v-else-if="post">
      <!-- Post header -->
      <div class="post-header">
        <div class="post-meta">
          <span v-if="post.date" class="post-date">
            <span class="kw">const</span> date = <span class="str">"{{ post.date }}"</span>
          </span>
          <span v-if="post.tags.length" class="post-tags">
            <span class="kw">const</span> tags = [
            <span v-for="(tag, i) in post.tags" :key="tag">
              <span class="str">"{{ tag }}"</span><span v-if="i < post.tags.length - 1">, </span>
            </span>
            ]
          </span>
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        <p v-if="post.description" class="post-description comment">// {{ post.description }}</p>
        <div class="post-divider" />
      </div>

      <!-- Rendered markdown -->
      <div class="readme-render" v-html="content" />
    </template>

    <template v-else>
      <div class="line comment">// Article introuvable</div>
      <div class="line comment">// Ce fichier n'existe pas encore.</div>
    </template>
  </div>
</template>

<style scoped>
.code-view {
  font-family: var(--font-mono);
  font-size: var(--font-size);
  line-height: var(--line-height);
  color: var(--text-main);
}
.line { white-space: pre-wrap; }
.comment { color: var(--text-comment); font-style: italic; }

.post-header { margin-bottom: 28px; }

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 12px;
}
.kw  { color: var(--text-keyword); }
.str { color: var(--text-string); }

.post-title {
  font-size: 1.8em;
  color: var(--text-keyword);
  margin: 0 0 6px;
  font-weight: 600;
}

.post-description {
  margin: 0;
  font-size: 13px;
}

.post-divider {
  margin-top: 16px;
  border-top: 1px solid var(--border);
}
</style>

<style>
/* Blog post markdown — unscoped for v-html (reuses readme-render styles) */
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
.readme-render pre code { background: none; border: none; padding: 0; color: var(--text-main); }

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
