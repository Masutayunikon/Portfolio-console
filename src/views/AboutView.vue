<template>
  <div class="code-view">
    <div class="line comment">// about.vue</div>
    <div class="spacer" />
    <div class="line comment">/**</div>
    <div class="line comment">&nbsp;* Développeur full-stack spécialisé en Vue.js, Nuxt.js et Node.js.</div>
    <div class="line comment">&nbsp;* Autonome, rigoureux et passionné, à l'aise sur toutes les étapes</div>
    <div class="line comment">&nbsp;* d'un projet, de la conception à la mise en production.</div>
    <div class="line comment">&nbsp;*/</div>
    <div class="spacer" />
    <div class="line">
      <span class="token-keyword">const</span>&nbsp;
      <span class="token-function">me</span>&nbsp;
      <span class="token-operator">=</span>&nbsp;
      <span class="token-operator">{</span>
    </div>
    <div class="line indent">
      <span class="token-string">age</span><span class="token-operator">:</span>&nbsp;
      <span class="token-number">23</span><span class="token-operator">,</span>
    </div>
    <div class="line indent">
      <span class="token-string">location</span><span class="token-operator">:</span>&nbsp;
      <span class="token-string">"Toulouse, France"</span><span class="token-operator">,</span>
    </div>
    <div class="line indent">
      <span class="token-string">languages</span><span class="token-operator">:</span>&nbsp;
      <span class="token-operator">[</span>
      <span class="token-string">"Français (natif)"</span><span class="token-operator">,</span>&nbsp;
      <span class="token-string">"Anglais (professionnel)"</span>
      <span class="token-operator">]</span><span class="token-operator">,</span>
    </div>
    <div class="line indent">
      <span class="token-string">available</span><span class="token-operator">:</span>&nbsp;
      <span class="token-keyword">true</span><span class="token-operator">,</span>
    </div>
    <div class="line indent">
      <span class="token-string">license</span><span class="token-operator">:</span>&nbsp;
      <span class="token-string">"Permis B"</span>
    </div>
    <div class="line"><span class="token-operator">}</span></div>
    <div class="spacer" />
    <div class="line comment">// TODO: add photo</div>
    <div class="avatar-placeholder">
      <div class="avatar-box">
        <span class="comment">/* avatar */</span>
      </div>
    </div>
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
.indent { padding-left: 2em; }
.spacer { height: 1em; }
.comment { color: var(--text-comment); font-style: italic; }

.avatar-placeholder { margin-top: 16px; }
.avatar-box {
  width: 100px;
  height: 100px;
  border: 2px dashed var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-comment);
  font-style: italic;
  font-size: 11px;
}
</style>
