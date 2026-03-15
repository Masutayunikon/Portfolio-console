<script setup>
import { computed } from 'vue'
import { useSpotify } from '@/composables/useSpotify.js'

defineEmits(['close'])

const { track, isPlaying, progress, duration, error, hasCredentials } = useSpotify()

const progressPct = computed(() => {
  if (!duration.value) return 0
  return Math.min(100, (progress.value / duration.value) * 100)
})

function fmt(ms) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
</script>

<template>
  <div class="spotify-widget" @keydown.esc="$emit('close')">
    <div class="widget-header">
      <span class="widget-title">NOW PLAYING</span>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>

    <div class="widget-body">
      <!-- No credentials -->
      <div v-if="!hasCredentials || error === 'missing_credentials'" class="no-data">
        <div class="comment">// Spotify not connected</div>
        <div class="comment">// Add credentials to .env</div>
      </div>

      <!-- Not playing -->
      <div v-else-if="!track" class="no-data">
        <div class="comment">// ⏸ Nothing playing right now</div>
      </div>

      <!-- Track info -->
      <template v-else>
        <div class="track-info">
          <img v-if="track.cover" :src="track.cover" class="cover" :alt="track.album" />
          <div class="track-text">
            <div class="track-name">{{ track.name }}</div>
            <div class="track-artist">{{ track.artist }}</div>
            <div class="track-album comment">{{ track.album }}</div>
          </div>
        </div>

        <div class="progress-bar">
          <span class="time">{{ fmt(progress) }}</span>
          <div class="bar-track">
            <div class="bar-fill" :style="{ width: progressPct + '%' }" />
          </div>
          <span class="time">{{ fmt(duration) }}</span>
        </div>

        <a :href="track.url" target="_blank" rel="noopener" class="open-btn">
          ↗ Ouvrir dans Spotify
        </a>
      </template>
    </div>
  </div>
</template>

<style scoped>
.spotify-widget {
  position: absolute;
  bottom: calc(var(--status-height) + 8px);
  right: 12px;
  width: 300px;
  background: var(--bg-sidebar);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  z-index: 100;
  overflow: hidden;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-activity);
}

.widget-title {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--text-dim);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0 2px;
}
.close-btn:hover { color: var(--text-main); }

.widget-body { padding: 12px; }

.no-data { display: flex; flex-direction: column; gap: 4px; }
.comment { color: var(--text-comment); font-style: italic; font-size: 12px; }

.track-info { display: flex; gap: 10px; margin-bottom: 12px; }

.cover {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.track-text { flex: 1; overflow: hidden; }
.track-name { font-size: 13px; color: var(--text-main); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.track-artist { font-size: 12px; color: var(--text-function); margin: 2px 0; }
.track-album { font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.progress-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.time { font-size: 10px; color: var(--text-dim); flex-shrink: 0; }

.bar-track {
  flex: 1;
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--status-bar);
  border-radius: 2px;
  transition: width 0.5s linear;
}

.open-btn {
  display: block;
  text-align: center;
  font-size: 11px;
  color: var(--text-string);
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 3px;
  transition: background 0.15s;
}
.open-btn:hover { background: var(--bg-hover); text-decoration: none; }
</style>
