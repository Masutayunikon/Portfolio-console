<script setup>
import { ref, reactive } from 'vue'

const form = reactive({ name: '', email: '', message: '' })
const state = ref('idle') // idle | loading | success | error
const errorMsg = ref('')

async function submit() {
  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
    errorMsg.value = 'Tous les champs sont requis.'
    state.value = 'error'
    return
  }
  state.value = 'loading'
  errorMsg.value = ''
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erreur inconnue')
    state.value = 'success'
    form.name = form.email = form.message = ''
  } catch (e) {
    errorMsg.value = e.message
    state.value = 'error'
  }
}
</script>

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

    <!-- Success state -->
    <Transition name="fade">
      <div v-if="state === 'success'" class="result-box success">
        <span class="token-keyword">return</span>
        <span class="token-string">"Message envoyé ✓ Je te répondrai rapidement !"</span>
      </div>
    </Transition>

    <form v-if="state !== 'success'" class="contact-form" @submit.prevent="submit">
      <div class="field">
        <label class="field-label">
          <span class="token-string">nom</span><span class="token-operator">:</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          placeholder="votre_nom"
          class="field-input"
          :disabled="state === 'loading'"
        />
      </div>
      <div class="field">
        <label class="field-label">
          <span class="token-string">email</span><span class="token-operator">:</span>
        </label>
        <input
          v-model="form.email"
          type="email"
          placeholder="votre@email.com"
          class="field-input"
          :disabled="state === 'loading'"
        />
      </div>
      <div class="field">
        <label class="field-label">
          <span class="token-string">message</span><span class="token-operator">:</span>
        </label>
        <textarea
          v-model="form.message"
          placeholder="// votre message ici&#8230;"
          rows="5"
          class="field-input textarea"
          :disabled="state === 'loading'"
        />
      </div>

      <!-- Error message -->
      <div v-if="state === 'error'" class="result-box error">
        <span class="comment">// Error: {{ errorMsg }}</span>
      </div>

      <button type="submit" class="submit-btn" :class="{ loading: state === 'loading' }" :disabled="state === 'loading'">
        <span v-if="state === 'loading'" class="token-comment">// envoi en cours&#8230;</span>
        <template v-else>
          <span class="token-function">envoyer</span><span class="token-operator">()</span>
        </template>
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
.field-input:disabled { opacity: 0.5; cursor: not-allowed; }
.textarea { resize: vertical; min-height: 80px; }

.result-box {
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 13px;
  max-width: 480px;
}
.result-box.success {
  background: color-mix(in srgb, var(--text-string) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--text-string) 30%, transparent);
  color: var(--text-string);
  display: flex;
  gap: 8px;
  align-items: center;
}
.result-box.error {
  background: color-mix(in srgb, #f44747 10%, transparent);
  border: 1px solid color-mix(in srgb, #f44747 30%, transparent);
}

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
  transition: background 0.15s, opacity 0.15s;
}
.submit-btn:hover:not(:disabled) { background: rgba(124, 58, 237, 0.15); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.submit-btn.loading { border-color: var(--text-comment); }

.token-comment { color: var(--text-comment); font-style: italic; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
