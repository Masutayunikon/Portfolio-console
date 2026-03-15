<script setup>
import { ref, onMounted } from 'vue'

const pkgData = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/package.json')
    pkgData.value = await res.json()
  } catch {
    pkgData.value = null
  }
})

function colorToken(key, val) {
  if (typeof val === 'string')  return 'string'
  if (typeof val === 'number')  return 'number'
  if (typeof val === 'boolean') return 'keyword'
  return 'main'
}

function renderVal(val) {
  if (typeof val === 'string') return `"${val}"`
  return String(val)
}
</script>

<template>
  <div class="code-view">
    <div class="line comment">// package.json — easter egg 🥚</div>
    <div class="spacer" />

    <div v-if="!pkgData" class="line comment">// Loading…</div>

    <template v-else>
      <div class="line"><span class="token-operator">{</span></div>
      <template v-for="(val, key) in pkgData" :key="key">
        <!-- Object value -->
        <template v-if="typeof val === 'object' && val !== null && !Array.isArray(val)">
          <div class="line indent">
            <span class="token-function">"{{ key }}"</span><span class="token-operator">:</span> <span class="token-operator">{</span>
          </div>
          <div v-for="(v2, k2) in val" :key="k2" class="line indent2">
            <span class="token-function">"{{ k2 }}"</span><span class="token-operator">:</span>
            <span :class="`token-${colorToken(k2, v2)}`">&nbsp;{{ renderVal(v2) }}</span><span class="token-operator">,</span>
          </div>
          <div class="line indent"><span class="token-operator">}</span><span class="token-operator">,</span></div>
        </template>

        <!-- Array value -->
        <template v-else-if="Array.isArray(val)">
          <div class="line indent">
            <span class="token-function">"{{ key }}"</span><span class="token-operator">:</span>
            <span class="token-operator">[</span>
            <span v-for="(item, i) in val" :key="i">
              <span class="token-string">"{{ item }}"</span><span v-if="i < val.length - 1" class="token-operator">, </span>
            </span>
            <span class="token-operator">]</span><span class="token-operator">,</span>
          </div>
        </template>

        <!-- Primitive -->
        <template v-else>
          <div class="line indent">
            <span class="token-function">"{{ key }}"</span><span class="token-operator">:</span>
            <span :class="`token-${colorToken(key, val)}`">&nbsp;{{ renderVal(val) }}</span><span class="token-operator">,</span>
          </div>
        </template>
      </template>
      <div class="line"><span class="token-operator">}</span></div>
    </template>
  </div>
</template>

<style scoped>
.code-view { font-family: var(--font-mono); font-size: var(--font-size); line-height: var(--line-height); color: var(--text-main); }
.line { white-space: pre-wrap; display: flex; flex-wrap: wrap; align-items: baseline; }
.indent  { padding-left: 2em; }
.indent2 { padding-left: 4em; }
.spacer  { height: 1em; }
.comment { color: var(--text-comment); font-style: italic; }
.token-main { color: var(--text-main); }
</style>
