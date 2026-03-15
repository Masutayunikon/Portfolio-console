<script setup>
import { ref, onMounted, nextTick } from 'vue'

defineEmits(['close'])

const outputEl = ref(null)
const input = ref('')
const lines = ref([])
const historyIdx = ref(-1)
const cmdHistory = ref([])

const BOOT_SEQUENCE = [
  { text: '  Portfolio — Quentin Robert', color: 'keyword' },
  { text: '  Vue 3 + Vite + Tokyo Night', color: 'comment' },
  { text: '', color: '' },
  { text: "  Type 'help' for available commands.", color: 'dim' },
  { text: '', color: '' },
]

const COMMANDS = {
  help: () => [
    { text: 'Available commands:', color: 'function' },
    { text: '  about       — Who is Quentin?', color: 'main' },
    { text: '  skills      — Tech stack', color: 'main' },
    { text: '  contact     — Get in touch', color: 'main' },
    { text: '  whoami      — Current user', color: 'main' },
    { text: '  ls          — List sections', color: 'main' },
    { text: '  clear       — Clear terminal', color: 'main' },
    { text: '  npm run dev — Already running 🚀', color: 'main' },
    { text: '', color: '' },
  ],
  whoami: () => [{ text: 'quentin@portfolio:~$  Quentin Robert — Développeur Full-Stack', color: 'string' }, { text: '', color: '' }],
  about: () => [
    { text: 'Développeur full-stack · 23 ans · Toulouse', color: 'string' },
    { text: 'Spécialisé Vue.js, Nuxt.js, Node.js', color: 'main' },
    { text: '2 ans d\'expérience pro · Epitech 2025', color: 'main' },
    { text: '', color: '' },
  ],
  skills: () => [
    { text: 'Frontend  ──  Vue.js · Nuxt · TypeScript · HTML/CSS · Tailwind', color: 'keyword' },
    { text: 'Backend   ──  Node.js · PHP · Python', color: 'function' },
    { text: 'DevOps    ──  Linux · Docker · Git', color: 'string' },
    { text: '', color: '' },
  ],
  contact: () => [
    { text: 'email     →  quentin@yunikon.re', color: 'string' },
    { text: 'github    →  github.com/Masutayunikon', color: 'function' },
    { text: 'portfolio →  portfolio.yunikon.re', color: 'function' },
    { text: '', color: '' },
  ],
  ls: () => [
    { text: 'README.md  about.vue  experience.vue  projects.vue  skills.vue  contact.vue  package.json', color: 'main' },
    { text: '', color: '' },
  ],
  'npm run dev': () => [
    { text: '> portfolio@1.0.0 dev', color: 'dim' },
    { text: '> vite', color: 'dim' },
    { text: '', color: '' },
    { text: '  VITE v5.x  ready in 312 ms', color: 'string' },
    { text: '  ➜  Local:   http://localhost:5173/', color: 'function' },
    { text: '', color: '' },
  ],
  clear: () => 'CLEAR',
}

onMounted(async () => {
  lines.value = [...BOOT_SEQUENCE]
  await nextTick()
  scrollBottom()
})

function scrollBottom() {
  nextTick(() => {
    if (outputEl.value) outputEl.value.scrollTop = outputEl.value.scrollHeight
  })
}

async function runCommand() {
  const cmd = input.value.trim()
  if (!cmd) return

  // Add to history
  cmdHistory.value.unshift(cmd)
  historyIdx.value = -1

  // Echo the command
  lines.value.push({ text: `quentin@portfolio:~$ ${cmd}`, color: 'prompt' })

  const handler = COMMANDS[cmd.toLowerCase()]
  if (handler) {
    const result = handler()
    if (result === 'CLEAR') {
      lines.value = []
    } else {
      lines.value.push(...result)
    }
  } else {
    lines.value.push({ text: `bash: ${cmd}: command not found`, color: 'error' })
    lines.value.push({ text: '', color: '' })
  }

  input.value = ''
  scrollBottom()
}

function handleKeydown(e) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIdx.value < cmdHistory.value.length - 1) {
      historyIdx.value++
      input.value = cmdHistory.value[historyIdx.value]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIdx.value > 0) {
      historyIdx.value--
      input.value = cmdHistory.value[historyIdx.value]
    } else {
      historyIdx.value = -1
      input.value = ''
    }
  }
}
</script>

<template>
  <div class="terminal-panel">
    <div class="terminal-header">
      <div class="terminal-tabs">
        <span class="term-tab active">TERMINAL</span>
      </div>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>

    <div class="terminal-body" ref="outputEl">
      <div
        v-for="(line, i) in lines"
        :key="i"
        class="term-line"
        :class="`c-${line.color}`"
      >{{ line.text || ' ' }}</div>

      <div class="term-input-row">
        <span class="prompt">quentin@portfolio:~$</span>
        <input
          v-model="input"
          class="term-input"
          spellcheck="false"
          autocomplete="off"
          @keydown.enter="runCommand"
          @keydown="handleKeydown"
          autofocus
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-panel {
  height: 220px;
  background: var(--bg-sidebar);
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-activity);
  border-bottom: 1px solid var(--border);
  padding: 0 8px;
  flex-shrink: 0;
}

.terminal-tabs { display: flex; }

.term-tab {
  font-size: 11px;
  padding: 5px 12px;
  color: var(--text-dim);
  cursor: default;
  border-bottom: 1px solid transparent;
}
.term-tab.active {
  color: var(--text-main);
  border-bottom-color: var(--status-bar);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 16px;
  padding: 0 4px;
}
.close-btn:hover { color: var(--text-main); }

.terminal-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
}

.term-line {
  white-space: pre-wrap;
  word-break: break-all;
}

/* Colors */
.c-main     { color: var(--text-main); }
.c-dim      { color: var(--text-dim); }
.c-comment  { color: var(--text-comment); font-style: italic; }
.c-keyword  { color: var(--text-keyword); }
.c-string   { color: var(--text-string); }
.c-function { color: var(--text-function); }
.c-error    { color: var(--text-error); }
.c-prompt   { color: var(--text-string); }
.c-         { color: transparent; }

.term-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.prompt { color: var(--text-string); white-space: nowrap; }

.term-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-main);
  font-family: var(--font-mono);
  font-size: 12px;
  caret-color: var(--text-main);
}
</style>
