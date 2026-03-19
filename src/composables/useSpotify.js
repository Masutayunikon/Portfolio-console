import { ref } from 'vue'

// Shared state — module-level so all components share the same polling loop
const track     = ref(null)
const isPlaying = ref(false)
const progress  = ref(0)
const duration  = ref(0)
const error     = ref(null)

let pollInterval  = null
let progressTimer = null

export function useSpotify() {
  async function fetchNowPlaying() {
    try {
      const res = await fetch('/api/spotify/now-playing')
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      isPlaying.value = data.isPlaying
      progress.value  = data.progress  ?? 0
      duration.value  = data.duration  ?? 0
      track.value     = data.track     ?? null
    } catch (e) {
      error.value = e.message
    }
  }

  function startPolling() {
    if (pollInterval) return // already running
    fetchNowPlaying()
    pollInterval = setInterval(fetchNowPlaying, 10000)

    // Smooth progress ticker — triggers immediate fetch when song ends
    progressTimer = setInterval(() => {
      if (isPlaying.value && progress.value < duration.value) {
        progress.value += 1000
        if (duration.value > 0 && progress.value >= duration.value - 2000) {
          setTimeout(fetchNowPlaying, 2000)
        }
      }
    }, 1000)
  }

  function stopPolling() {
    clearInterval(pollInterval)
    clearInterval(progressTimer)
    pollInterval = null
    progressTimer = null
  }

  return {
    track, isPlaying, progress, duration, error,
    hasCredentials: true, // credentials live server-side now
    startPolling, stopPolling, fetchNowPlaying
  }
}
