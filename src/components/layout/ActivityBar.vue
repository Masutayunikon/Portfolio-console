<script setup>
const emit = defineEmits(['toggle-sidebar', 'toggle-github'])

const props = defineProps({
  activePanel: { type: String, default: 'explorer' }
})
</script>

<template>
  <div class="activity-bar">
    <div class="icons-top">
      <!-- Explorer -->
      <button
        class="icon-btn"
        :class="{ active: activePanel === 'explorer' }"
        title="Explorer"
        @click="$emit('toggle-sidebar', 'explorer')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
        </svg>
      </button>

      <!-- Search -->
      <button class="icon-btn" title="Search (décoratif)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="7"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      </button>

      <!-- Git / Source Control -->
      <button
        class="icon-btn"
        :class="{ active: activePanel === 'github' }"
        title="Source Control (GitHub)"
        @click="$emit('toggle-sidebar', 'github')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="18" r="2"/>
          <circle cx="6"  cy="6"  r="2"/>
          <circle cx="18" cy="6"  r="2"/>
          <path d="M12 16V8M6 8l6-2 6 2"/>
        </svg>
      </button>

      <!-- Extensions -->
      <button class="icon-btn" title="Extensions (décoratif)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3"  y="3"  width="7" height="7" rx="1"/>
          <rect x="14" y="3"  width="7" height="7" rx="1"/>
          <rect x="3"  y="14" width="7" height="7" rx="1"/>
          <path d="M14 17.5h3m0 0V14m0 3.5V21"/>
        </svg>
      </button>
    </div>

    <div class="icons-bottom">
      <!-- Settings -->
      <button class="icon-btn" title="Paramètres (décoratif)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.activity-bar {
  width: var(--activity-width);
  background: var(--bg-activity);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
  border-right: 1px solid var(--border);
  flex-shrink: 0;
}

.icons-top, .icons-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-comment);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color 0.15s;
  position: relative;
}

.icon-btn svg {
  width: 22px;
  height: 22px;
}

.icon-btn:hover { color: var(--text-main); }
.icon-btn.active {
  color: var(--text-main);
}
.icon-btn.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 24px;
  background: var(--status-bar);
  border-radius: 0 2px 2px 0;
}
</style>
