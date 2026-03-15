<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTabs } from '@/composables/useTabs.js'

const router = useRouter()
const { openTab } = useTabs()

const FULL_TEXT = '# Quentin Robert'
const typed = ref('')
const showCursor = ref(true)

onMounted(() => {
  let i = 0
  const interval = setInterval(() => {
    typed.value = FULL_TEXT.slice(0, ++i)
    if (i >= FULL_TEXT.length) clearInterval(interval)
  }, 60)
})

function goProjects() {
  openTab({ id: 'projects', label: 'projects.vue', route: '/projects', icon: 'vue' })
  router.push('/projects')
}
function goContact() {
  openTab({ id: 'contact', label: 'contact.vue', route: '/contact', icon: 'vue' })
  router.push('/contact')
}
</script>

<template>
  <div class="home-view">
    <div class="line">
      <span class="token-keyword">{{ typed }}</span>
      <span class="cursor" />
    </div>

    <div class="spacer" />

    <div class="line comment">&gt; Développeur Full-Stack · Vue.js · Nuxt.js · Node.js</div>

    <div class="spacer" />

    <div class="line"><span class="token-keyword">const</span> <span class="token-function">dev</span> <span class="token-operator">=</span> <span class="token-operator">{</span></div>
    <div class="line indent"><span class="token-string">name</span><span class="token-operator">:</span>      <span class="token-string">"Quentin Robert"</span><span class="token-operator">,</span></div>
    <div class="line indent"><span class="token-string">age</span><span class="token-operator">:</span>       <span class="token-number">23</span><span class="token-operator">,</span></div>
    <div class="line indent"><span class="token-string">location</span><span class="token-operator">:</span>  <span class="token-string">"Toulouse, France"</span><span class="token-operator">,</span></div>
    <div class="line indent"><span class="token-string">available</span><span class="token-operator">:</span> <span class="token-keyword">true</span><span class="token-operator">,</span></div>
    <div class="line indent"><span class="token-string">contact</span><span class="token-operator">:</span>   <span class="token-string">"quentin@yunikon.re"</span></div>
    <div class="line"><span class="token-operator">}</span></div>

    <div class="spacer" />

    <div class="line comment">// Spécialisé en Vue.js, Nuxt.js et Node.js</div>
    <div class="line comment">// 2 ans d'expérience professionnelle</div>
    <div class="line comment">// De la conception à la mise en production</div>

    <div class="spacer" />

    <div class="cta-row">
      <button class="cta-btn primary" @click="goProjects">
        <span class="token-function">voir_mes_projets</span><span class="token-operator">()</span>
      </button>
      <button class="cta-btn secondary" @click="goContact">
        <span class="token-function">me_contacter</span><span class="token-operator">()</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  font-family: var(--font-mono);
  font-size: var(--font-size);
  line-height: var(--line-height);
  color: var(--text-main);
  padding: 8px 0;
}

.line {
  display: flex;
  align-items: baseline;
  gap: 0;
  white-space: pre;
  flex-wrap: wrap;
}

.indent { padding-left: 2em; }
.comment { color: var(--text-comment); font-style: italic; }
.spacer { height: 1em; }

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: var(--text-main);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.cta-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.cta-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 8px 20px;
  font-family: var(--font-mono);
  font-size: var(--font-size);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.cta-btn.primary {
  border-color: var(--status-bar);
  background: rgba(124, 58, 237, 0.1);
}
.cta-btn.primary:hover { background: rgba(124, 58, 237, 0.2); }

.cta-btn.secondary { border-color: var(--border); }
.cta-btn.secondary:hover { background: var(--bg-hover); }
</style>
