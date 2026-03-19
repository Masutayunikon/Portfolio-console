import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app  = express()
const PORT = process.env.PORT || 3000

const GITHUB_TOKEN    = process.env.VITE_GITHUB_TOKEN
const GITHUB_USERNAME = process.env.VITE_GITHUB_USERNAME || 'Masutayunikon'

const SPOTIFY_CLIENT_ID     = process.env.VITE_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET
const SPOTIFY_REFRESH_TOKEN = process.env.VITE_SPOTIFY_REFRESH_TOKEN

const githubHeaders = {
  Accept: 'application/vnd.github.v3+json',
  ...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {})
}

// ── Spotify token cache (server-side) ───────────────────────────────
let spotifyToken = null
let tokenExpiry  = 0

async function getSpotifyToken() {
  if (spotifyToken && Date.now() < tokenExpiry) return spotifyToken

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN })
  })

  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status}`)
  const data = await res.json()
  spotifyToken = data.access_token
  tokenExpiry  = Date.now() + (data.expires_in - 60) * 1000
  return spotifyToken
}

// ── GitHub routes ────────────────────────────────────────────────────
app.get('/api/github/repos', async (req, res) => {
  try {
    const r = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`,
      { headers: githubHeaders }
    )
    if (!r.ok) return res.status(r.status).json({ error: 'GitHub API error' })
    res.json(await r.json())
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/github/readme/:repo', async (req, res) => {
  try {
    const r = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${req.params.repo}/readme`,
      { headers: githubHeaders }
    )
    if (!r.ok) return res.status(r.status).json({ error: 'README not found' })
    const data = await r.json()

    // UTF-8 decode (atob breaks on multibyte characters)
    const binary = atob(data.content.replace(/\n/g, ''))
    const bytes  = Uint8Array.from(binary, c => c.charCodeAt(0))
    let markdown = new TextDecoder('utf-8').decode(bytes)

    // Rewrite relative image URLs to raw.githubusercontent.com
    const branch  = data.html_url?.match(/blob\/([^/]+)\//)?.[1] ?? 'main'
    const rawBase = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${req.params.repo}/${branch}`
    markdown = markdown.replace(
      /!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
      (_, alt, src) => `![${alt}](${rawBase}/${src.replace(/^\.\//, '')})`
    )

    res.json({ markdown })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Spotify route ────────────────────────────────────────────────────
app.get('/api/spotify/now-playing', async (req, res) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return res.json({ isPlaying: false })
  }

  try {
    const token = await getSpotifyToken()
    const r = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (r.status === 204) return res.json({ isPlaying: false })
    if (!r.ok) throw new Error(`Spotify API error: ${r.status}`)

    const data = await r.json()
    res.json({
      isPlaying: data.is_playing,
      progress:  data.progress_ms,
      duration:  data.item?.duration_ms ?? 0,
      track: data.item ? {
        name:   data.item.name,
        artist: data.item.artists.map(a => a.name).join(', '),
        album:  data.item.album.name,
        cover:  data.item.album.images[1]?.url ?? data.item.album.images[0]?.url,
        url:    data.item.external_urls.spotify
      } : null
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── Static files (production build) ─────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath  = path.join(__dirname, '../dist')

app.use(express.static(distPath))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => console.log(`Server running on :${PORT}`))
