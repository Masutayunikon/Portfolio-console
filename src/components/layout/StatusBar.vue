<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useTabs } from '@/composables/useTabs.js'
import { useSpotify } from '@/composables/useSpotify.js'

const emit = defineEmits(['toggle-spotify', 'toggle-terminal'])

const { tabs, activeTabId } = useTabs()
const { track, isPlaying, error: spotifyError, hasCredentials, startPolling } = useSpotify()

const now = ref(new Date())
let clockTimer

onMounted(() => {
  clockTimer = setInterval(() => { now.value = new Date() }, 1000)
  startPolling()
})

onUnmounted(() => clearInterval(clockTimer))

const timeStr = computed(() =>
  now.value.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
)

const activeFile = computed(() => tabs.value.find(t => t.id === activeTabId.value)?.label ?? 'README.md')

const spotifyLabel = computed(() => {
  if (!hasCredentials) return null
  if (spotifyError.value === 'missing_credentials') return null
  if (!isPlaying.value || !track.value) return '⏸ Not playing'
  return `▶ ${track.value.artist} — ${track.value.name}`
})
</script>

<template>
  <footer class="status-bar">
    <!-- Left -->
    <div class="status-left">
      <span class="status-item branch">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="18" r="2"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/>
          <path d="M12 16V8M6 8l6-2 6 2"/>
        </svg>
        main
      </span>
      <span class="status-item">{{ activeFile }}</span>
      <span
        class="status-item terminal-toggle"
        title="Toggle terminal (Ctrl+`)"
        @click="$emit('toggle-terminal')"
      >⌨ TERMINAL</span>
    </div>

    <!-- Right -->
    <div class="status-right">
      <span class="status-item time">{{ timeStr }}</span>
      <span
        v-if="spotifyLabel"
        class="status-item spotify-item"
        :class="{ playing: isPlaying }"
        @click="$emit('toggle-spotify')"
        title="Cliquer pour ouvrir le widget Spotify"
      >
        <span class="spotify-icon" :class="{ pulse: isPlaying }">🎵</span>
        {{ spotifyLabel }}
      </span>
      <span class="status-item lang">Vue</span>
      <span class="status-item encoding">UTF-8</span>
    </div>
  </footer>
</template>

<style scoped>
.status-bar {
  height: var(--status-height);
  background: var(--status-bar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 12px;
  color: var(--status-bar-text);
  flex-shrink: 0;
  user-select: none;
}

.status-left, .status-right {
  display: flex;
  align-items: center;
  gap: 2px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px;
  height: var(--status-height);
  cursor: default;
  white-space: nowrap;
  transition: background 0.15s;
}
.status-item:hover { background: rgba(255,255,255,0.1); }

.branch { gap: 5px; }
.terminal-toggle { cursor: pointer; font-size: 11px; opacity: 0.8; }
.terminal-toggle:hover { opacity: 1; }

.spotify-item { cursor: pointer; max-width: 280px; overflow: hidden; text-overflow: ellipsis; }
.spotify-icon { font-size: 11px; }

/* Hide some items on mobile */
@media (max-width: 768px) {
  .time, .lang, .encoding { display: none; }
  .spotify-item { max-width: 160px; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.pulse { animation: pulse 1.5s ease-in-out infinite; }
</style>
