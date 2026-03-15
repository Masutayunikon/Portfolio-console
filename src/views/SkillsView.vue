<template>
  <div class="code-view">
    <div class="line comment">// skills.vue</div>
    <div class="spacer" />
    <div class="line"><span class="token-keyword">const</span> <span class="token-function">skills</span> <span class="token-operator">=</span> <span class="token-operator">{</span></div>

    <template v-for="(group, key) in skillGroups" :key="key">
      <div class="spacer-half" />
      <div class="line indent comment">// {{ LABELS[key] }}</div>
      <div class="line indent"><span class="token-string">{{ key }}</span><span class="token-operator">:</span> <span class="token-operator">{</span></div>
      <div v-for="(val, skill) in group" :key="skill" class="line indent2">
        <span class="token-string">"{{ skill }}"</span><span class="token-operator">:</span>
        <span class="skill-badge">
          <span v-if="val.pro"  class="badge pro">pro {{ val.pro }}</span>
          <span v-if="val.perso" class="badge perso">perso {{ val.perso }}</span>
        </span><span class="token-operator">,</span>
      </div>
      <div class="line indent"><span class="token-operator">}</span><span class="token-operator">,</span></div>
    </template>

    <div class="spacer-half" />
    <div class="line indent comment">// Méthodes</div>
    <div class="line indent">
      <span class="token-string">methods</span><span class="token-operator">:</span>
      <span class="token-operator">[</span>
      <span v-for="(m, i) in methods" :key="m">
        <span class="token-string">"{{ m }}"</span><span v-if="i < methods.length - 1" class="token-operator">, </span>
      </span>
      <span class="token-operator">]</span>
    </div>

    <div class="line"><span class="token-operator">}</span></div>
  </div>
</template>

<script setup>
const LABELS = { frontend: 'Frontend', backend: 'Backend', devops: 'DevOps' }

const skillGroups = {
  frontend: {
    'Vue.js':      { pro: '2 ans', perso: '4 ans' },
    'Nuxt.js':     { pro: '1 an',  perso: '3 ans' },
    'TypeScript':  { pro: '2 ans', perso: '3 ans' },
    'JavaScript':  { pro: '2 ans', perso: '6 ans' },
    'HTML / CSS':  { pro: '2 ans', perso: '6 ans' },
    'TailwindCSS': { pro: '1 an',  perso: '3 ans' },
  },
  backend: {
    'Node.js': { pro: '2 ans', perso: '5 ans' },
    'PHP':     { pro: '1 an' },
    'Python':  { perso: '5 ans' },
  },
  devops: {
    'Linux':  { perso: '6 ans' },
    'Docker': { perso: '2 ans' },
    'Git':    { pro: '2 ans', perso: '5 ans' },
  }
}

const methods = ['Agile / Scrum', 'Architecture MVC', 'REST API', 'Self-hosting']
</script>

<style scoped>
.code-view { font-family: var(--font-mono); font-size: var(--font-size); line-height: var(--line-height); color: var(--text-main); }
.line { white-space: pre-wrap; display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px; }
.indent  { padding-left: 2em; }
.indent2 { padding-left: 4em; }
.spacer  { height: 1em; }
.spacer-half { height: 0.5em; }
.comment { color: var(--text-comment); font-style: italic; }

.skill-badge { display: inline-flex; gap: 6px; margin: 0 6px; }

.badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  font-style: normal;
  white-space: nowrap;
}
.badge.pro   { background: rgba(124, 58, 237, 0.2); color: var(--text-keyword); border: 1px solid rgba(124,58,237,0.4); }
.badge.perso { background: rgba(158, 206, 106, 0.1); color: var(--text-string); border: 1px solid rgba(158,206,106,0.3); }
</style>
