<template>
  <div class="code-view">
    <div class="line comment">// experience.vue</div>
    <div class="spacer" />
    <div class="line"><span class="token-keyword">const</span> <span class="token-function">experience</span> <span class="token-operator">=</span> <span class="token-operator">[</span></div>

    <!-- BBN Solutions -->
    <div class="line indent"><span class="token-operator">{</span></div>
    <div class="line indent2"><span class="token-string">company</span><span class="token-operator">:</span> <span class="token-string">"BBN Solutions"</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">role</span><span class="token-operator">:</span> <span class="token-string">"Stagiaire / Part-time"</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">periods</span><span class="token-operator">:</span> <span class="token-operator">[</span></div>
    <div class="line indent3"><span class="token-string">"sept. 2021 – déc. 2021"</span><span class="token-operator">,</span></div>
    <div class="line indent3"><span class="token-string">"sept. 2022 – fév. 2023"</span><span class="token-operator">,</span></div>
    <div class="line indent3"><span class="token-string">"avr. 2023 – juil. 2023"</span></div>
    <div class="line indent2"><span class="token-operator">]</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">stack</span><span class="token-operator">:</span> <span class="token-operator">[</span><span class="token-string">"PHP MVC"</span><span class="token-operator">,</span> <span class="token-string">"Vue 2"</span><span class="token-operator">,</span> <span class="token-string">"SCSS"</span><span class="token-operator">,</span> <span class="token-string">"CodeMirror"</span><span class="token-operator">]</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">highlights</span><span class="token-operator">:</span> <span class="token-operator">[</span></div>
    <div class="line indent3"><span class="token-string">"Développement webapp interne (framework maison)"</span><span class="token-operator">,</span></div>
    <div class="line indent3"><span class="token-string">"Création d'une boîte mail complète (CRON, contacts, envoi/réception)"</span><span class="token-operator">,</span></div>
    <div class="line indent3"><span class="token-string">"Mise à jour IDE interne : autocomplétion, LSP, extensions"</span><span class="token-operator">,</span></div>
    <div class="line indent3"><span class="token-string">"Chef de projet — refonte app client (3 stagiaires supervisés)"</span><span class="token-operator">,</span></div>
    <div class="line indent3"><span class="token-string">"App interne type ChatGPT pour intégrer l'API IA"</span></div>
    <div class="line indent2"><span class="token-operator">]</span></div>
    <div class="line indent"><span class="token-operator">}</span><span class="token-operator">,</span></div>

    <!-- Pappers -->
    <div class="line indent"><span class="token-operator">{</span></div>
    <div class="line indent2"><span class="token-string">company</span><span class="token-operator">:</span> <span class="token-string">"Pappers Entreprise"</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">role</span><span class="token-operator">:</span> <span class="token-string">"Stagiaire / Part-time"</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">stack</span><span class="token-operator">:</span> <span class="token-operator">[</span><span class="token-string">"Nuxt.js"</span><span class="token-operator">,</span> <span class="token-string">"TailwindCSS"</span><span class="token-operator">,</span> <span class="token-string">"REST API"</span><span class="token-operator">]</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">highlights</span><span class="token-operator">:</span> <span class="token-operator">[</span></div>
    <div class="line indent3"><span class="token-string">"Refonte frontend en Nuxt.js + Tailwind"</span><span class="token-operator">,</span></div>
    <div class="line indent3"><span class="token-string">"Intégration API données entreprises (BE, ES, CH, DE, UK)"</span><span class="token-operator">,</span></div>
    <div class="line indent3"><span class="token-string">"Amélioration du back-office"</span></div>
    <div class="line indent2"><span class="token-operator">]</span></div>
    <div class="line indent"><span class="token-operator">}</span></div>

    <div class="line"><span class="token-operator">]</span></div>

    <div class="spacer" />
    <div class="line comment">// ─── Formation ───────────────────────────────────────</div>
    <div class="spacer" />

    <div class="line"><span class="token-keyword">const</span> <span class="token-function">education</span> <span class="token-operator">=</span> <span class="token-operator">[</span></div>
    <div class="line indent"><span class="token-operator">{</span></div>
    <div class="line indent2"><span class="token-string">school</span><span class="token-operator">:</span> <span class="token-string">"Epitech (Réunion - Paris)"</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">degree</span><span class="token-operator">:</span> <span class="token-string">"Expert Informatique en Ingénierie Logicielle"</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">years</span><span class="token-operator">:</span>  <span class="token-string">"2020 – 2025"</span></div>
    <div class="line indent"><span class="token-operator">}</span><span class="token-operator">,</span></div>
    <div class="line indent"><span class="token-operator">{</span></div>
    <div class="line indent2"><span class="token-string">school</span><span class="token-operator">:</span> <span class="token-string">"Université de Jönköping, Suède"</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">degree</span><span class="token-operator">:</span> <span class="token-string">"Master UI/UX (échange international)"</span><span class="token-operator">,</span></div>
    <div class="line indent2"><span class="token-string">years</span><span class="token-operator">:</span>  <span class="token-string">"2024 – 2025"</span></div>
    <div class="line indent"><span class="token-operator">}</span></div>
    <div class="line"><span class="token-operator">]</span></div>
  </div>
</template>

<style scoped>
.code-view { font-family: var(--font-mono); font-size: var(--font-size); line-height: var(--line-height); color: var(--text-main); }
.line { white-space: pre-wrap; }
.indent  { padding-left: 2em; }
.indent2 { padding-left: 4em; }
.indent3 { padding-left: 6em; }
.spacer  { height: 1em; }
.comment { color: var(--text-comment); font-style: italic; }
</style>
