import { ref, onUnmounted } from 'vue'

// ⚠️ WARNING: The client_secret is exposed in the client bundle.
// In production, replace this with a Vercel/Netlify Edge Function
// that handles the token refresh server-side.
const CLIENT_ID     = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN

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

  function startPolling() {
    if (!hasCredentials) return
    fetchNowPlaying()
    pollInterval = setInterval(fetchNowPlaying, 30000)

    // Smooth progress ticker
    progressTimer = setInterval(() => {
      if (isPlaying.value && progress.value < duration.value) {
        progress.value += 1000
      }
    }, 1000)
  }

  function stopPolling() {
    clearInterval(pollInterval)
    clearInterval(progressTimer)
  }

  onUnmounted(stopPolling)

  return {
    track, isPlaying, progress, duration, error,
    hasCredentials,
    startPolling, stopPolling, fetchNowPlaying
  }
}
