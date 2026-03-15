<template>
  <div class="code-view">
    <div class="line comment">// contact.vue</div>
    <div class="spacer" />
    <div class="line"><span class="token-keyword">const</span> <span class="token-function">contact</span> <span class="token-operator">=</span> <span class="token-operator">{</span></div>
    <div class="line indent">
      <span class="token-string">email</span><span class="token-operator">:</span>
      <a href="mailto:quentin@yunikon.re" class="token-string link">"quentin@yunikon.re"</a><span class="token-operator">,</span>
      <span class="comment">&nbsp;// cliquable</span>
    </div>
    <div class="line indent">
      <span class="token-string">portfolio</span><span class="token-operator">:</span>
      <a href="https://portfolio.yunikon.re" target="_blank" rel="noopener" class="token-string link">"portfolio.yunikon.re"</a><span class="token-operator">,</span>
      <span class="comment">&nbsp;// cliquable</span>
    </div>
    <div class="line indent">
      <span class="token-string">github</span><span class="token-operator">:</span>
      <a href="https://github.com/Masutayunikon" target="_blank" rel="noopener" class="token-string link">"@Masutayunikon"</a><span class="token-operator">,</span>
      <span class="comment">&nbsp;// lien GitHub</span>
    </div>
    <div class="line indent">
      <span class="token-string">twitter</span><span class="token-operator">:</span>
      <a href="https://x.com/Masutayunikon" target="_blank" rel="noopener" class="token-string link">"@Masutayunikon"</a><span class="token-operator">,</span>
      <span class="comment">&nbsp;// lien Twitter/X</span>
    </div>
    <div class="line"><span class="token-operator">}</span></div>

    <div class="spacer" />
    <div class="line comment">// TODO: connect form to API</div>
    <div class="spacer" />

    <form class="contact-form" @submit.prevent>
      <div class="field">
        <label class="field-label">
          <span class="token-string">nom</span><span class="token-operator">:</span>
        </label>
        <input type="text" name="name" placeholder="votre_nom" class="field-input" />
      </div>
      <div class="field">
        <label class="field-label">
          <span class="token-string">email</span><span class="token-operator">:</span>
        </label>
        <input type="email" name="email" placeholder="votre@email.com" class="field-input" />
      </div>
      <div class="field">
        <label class="field-label">
          <span class="token-string">message</span><span class="token-operator">:</span>
        </label>
        <textarea name="message" placeholder="// votre message ici…" rows="5" class="field-input textarea" />
      </div>
      <button type="submit" class="submit-btn">
        <span class="token-function">envoyer</span><span class="token-operator">()</span>
        <span class="comment">&nbsp;// coming soon</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.code-view { font-family: var(--font-mono); font-size: var(--font-size); line-height: var(--line-height); color: var(--text-main); }
.line { white-space: pre-wrap; display: flex; align-items: baseline; flex-wrap: wrap; }
.indent { padding-left: 2em; }
.spacer { height: 1em; }
.comment { color: var(--text-comment); font-style: italic; }

.link { color: var(--text-string); cursor: pointer; }
.link:hover { text-decoration: underline; }

.contact-form { display: flex; flex-direction: column; gap: 12px; max-width: 480px; }

.field { display: flex; align-items: flex-start; gap: 12px; }
.field-label { flex-shrink: 0; padding-top: 6px; min-width: 80px; }

.field-input {
  flex: 1;
  background: var(--bg-sidebar);
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text-main);
  font-family: var(--font-mono);
  font-size: var(--font-size);
  padding: 6px 10px;
  outline: none;
  transition: border-color 0.15s;
}
.field-input:focus { border-color: var(--status-bar); }
.field-input::placeholder { color: var(--text-comment); }
.textarea { resize: vertical; min-height: 80px; }

.submit-btn {
  align-self: flex-start;
  background: none;
  border: 1px solid var(--status-bar);
  border-radius: 4px;
  padding: 8px 20px;
  font-family: var(--font-mono);
  font-size: var(--font-size);
  cursor: pointer;
  color: var(--text-main);
  transition: background 0.15s;
}
.submit-btn:hover { background: rgba(124, 58, 237, 0.15); }
</style>
