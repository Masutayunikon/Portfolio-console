import 'dotenv/config'
import express from 'express'
import nodemailer from 'nodemailer'
import path from 'path'
import { fileURLToPath } from 'url'

const app  = express()
const PORT = process.env.PORT || 3000

const GITHUB_TOKEN    = process.env.VITE_GITHUB_TOKEN
const GITHUB_USERNAME = process.env.VITE_GITHUB_USERNAME || 'Masutayunikon'
const BLOG_REPO       = process.env.VITE_BLOG_REPO       || 'Portfolio-console'

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

// ── Blog routes ──────────────────────────────────────────────────────
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { frontmatter: {}, content: raw }
  const frontmatter = {}
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':')
    if (colon > 0) {
      const key = line.slice(0, colon).trim()
      const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
      frontmatter[key] = val
    }
  })
  return { frontmatter, content: match[2] }
}

function slugToTitle(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function decodeGithubContent(b64) {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes  = Uint8Array.from(binary, c => c.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

app.get('/api/blog/posts', async (req, res) => {
  try {
    const r = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${BLOG_REPO}/contents/blog`,
      { headers: githubHeaders }
    )
    if (!r.ok) return res.status(r.status).json({ error: 'Blog folder not found' })
    const files = await r.json()

    // Fetch each file in parallel to extract frontmatter title/date
    const posts = await Promise.all(
      files
        .filter(f => f.type === 'file' && f.name.endsWith('.md'))
        .map(async f => {
          const slug = f.name.replace('.md', '')
          try {
            const fr = await fetch(f.download_url)
            const raw = await fr.text()
            const { frontmatter } = parseFrontmatter(raw)
            return {
              slug,
              title:       frontmatter.title       || slugToTitle(slug),
              date:        frontmatter.date         || null,
              description: frontmatter.description  || '',
              tags:        frontmatter.tags
                ? frontmatter.tags.replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(Boolean)
                : []
            }
          } catch {
            return { slug, title: slugToTitle(slug), date: null, description: '', tags: [] }
          }
        })
    )

    // Sort by date descending (nulls last)
    posts.sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date) - new Date(a.date)
    })

    res.json(posts)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.get('/api/blog/post/:slug', async (req, res) => {
  try {
    const r = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${BLOG_REPO}/contents/blog/${req.params.slug}.md`,
      { headers: githubHeaders }
    )
    if (!r.ok) return res.status(r.status).json({ error: 'Post not found' })
    const data = await r.json()

    const raw = decodeGithubContent(data.content)
    const { frontmatter, content } = parseFrontmatter(raw)

    res.json({
      slug:        req.params.slug,
      title:       frontmatter.title       || slugToTitle(req.params.slug),
      date:        frontmatter.date         || null,
      description: frontmatter.description  || '',
      tags:        frontmatter.tags
        ? frontmatter.tags.replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(Boolean)
        : [],
      markdown: content
    })
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

// ── Contact route ────────────────────────────────────────────────────
const smtpTransport = (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
  : null

app.post('/api/contact', express.json(), async (req, res) => {
  const { name, email, message } = req.body ?? {}

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Adresse email invalide.' })
  }
  if (!smtpTransport) {
    return res.status(503).json({ error: 'Service email non configuré.' })
  }

  try {
    await smtpTransport.sendMail({
      from:    `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to:      process.env.SMTP_TO || process.env.SMTP_USER,
      subject: `[Portfolio] Message de ${name}`,
      text:    `De : ${name} <${email}>\n\n${message}`,
      html:    `<p><strong>De :</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br>')}</p>`
    })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi. Réessayez plus tard.' })
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
