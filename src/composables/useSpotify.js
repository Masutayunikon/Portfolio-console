import { ref } from 'vue'

// ⚠️ WARNING: The client_secret is exposed in the client bundle.
// In production, replace this with a Vercel/Netlify Edge Function
// that handles the token refresh server-side.
const env           = window.__env__ ?? {}
const CLIENT_ID     = env.VITE_SPOTIFY_CLIENT_ID     || import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.VITE_SPOTIFY_CLIENT_SECRET || import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = env.VITE_SPOTIFY_REFRESH_TOKEN || import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN

const track     = ref(null)
const isPlaying = ref(false)
const progress  = ref(0)
const duration  = ref(0)
const error     = ref(null)

let accessToken   = null
let tokenExpiry   = 0
let pollInterval  = null
let progressTimer = null

export function useSpotify() {
  const hasCredentials = CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN

  async function refreshAccessToken() {
    if (!hasCredentials) return null
    try {
      const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          grant_type:    'refresh_token',
          refresh_token: REFRESH_TOKEN
        })
      })
      if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)
      const data = await res.json()
      accessToken = data.access_token
      tokenExpiry = Date.now() + data.expires_in * 1000
      return accessToken
    } catch (e) {
      error.value = e.message
      return null
    }
  }

  async function getToken() {
    if (accessToken && Date.now() < tokenExpiry - 10000) return accessToken
    return refreshAccessToken()
  }

  async function fetchNowPlaying() {
    if (!hasCredentials) {
      error.value = 'missing_credentials'
      return
    }
    const token = await getToken()
    if (!token) return
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.status === 204) {
        // Nothing playing
        isPlaying.value = false
        track.value = null
        return
      }
      if (!res.ok) throw new Error(`Spotify API error: ${res.status}`)
      const data = await res.json()
      isPlaying.value = data.is_playing
      progress.value  = data.progress_ms
      duration.value  = data.item?.duration_ms ?? 0
      track.value = data.item ? {
        name:     data.item.name,
        artist:   data.item.artists.map(a => a.name).join(', '),
        album:    data.item.album.name,
        cover:    data.item.album.images[1]?.url ?? data.item.album.images[0]?.url,
        url:      data.item.external_urls.spotify
      } : null
    } catch (e) {
      error.value = e.message
    }
  }

  // Polling is managed at module level — not tied to any single component lifecycle
  function startPolling() {
    if (!hasCredentials || pollInterval) return  // already running
    fetchNowPlaying()
    pollInterval = setInterval(fetchNowPlaying, 10000)

    // Smooth progress ticker — triggers immediate fetch when song ends
    progressTimer = setInterval(() => {
      if (isPlaying.value && progress.value < duration.value) {
        progress.value += 1000
        // Song ending in < 2s — fetch next track immediately
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
    hasCredentials,
    startPolling, stopPolling, fetchNowPlaying
  }
}
