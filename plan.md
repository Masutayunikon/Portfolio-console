# Plan — Portfolio Quentin Robert v2
## Fausse fenêtre VS Code · Vue 3 + Vite · Tokyo Night

---

## 1. Vue d'ensemble

Un portfolio single-page qui simule fidèlement l'interface de VS Code dans le navigateur,
avec deux intégrations live : GitHub (repos + README) et Spotify (Now Playing).

---

## 2. Stack technique confirmée

| Outil | Version / choix | Raison |
|---|---|---|
| Vue 3 | Composition API + `<script setup>` | Réactivité fine, lisibilité |
| Vite | 5.x | Build rapide, support `.env` natif |
| Vue Router | 4.x | Hash mode pour GitHub Pages compat |
| marked + marked-highlight | latest | Rendu Markdown des README GitHub |
| highlight.js | latest | Coloration code dans les README |
| CSS variables + scoped styles | — | Contrôle précis layout VS Code |
| sessionStorage | natif | Cache repos GitHub |

Pas de Tailwind dans les composants layout (contrôle pixel-perfect du layout VS Code requis).

---

## 3. Variables d'environnement

```env
VITE_GITHUB_TOKEN=ghp_...
VITE_GITHUB_USERNAME=Masutayunikon
VITE_SPOTIFY_CLIENT_ID=...
VITE_SPOTIFY_CLIENT_SECRET=...   # ⚠ ne jamais inclure en prod — proxy serverless recommandé
VITE_SPOTIFY_REFRESH_TOKEN=...
```

⚠ **Sécurité Spotify** : le `client_secret` est exposé dans le bundle Vite côté client.
En production, un proxy Vercel Edge Function (ou Netlify Function) est fortement recommandé
pour effectuer le refresh token côté serveur sans exposer le secret.
Pour ce build, le flow est implémenté côté client avec un commentaire d'avertissement explicite.

---

## 4. Architecture des fichiers

```
mon-portfolio/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── .gitignore
├── src/
│   ├── main.js
│   ├── App.vue                        ← shell VS Code (layout racine)
│   ├── router/
│   │   └── index.js                   ← routes hash mode
│   ├── composables/
│   │   ├── useGitHub.js               ← fetch repos, README, cache sessionStorage
│   │   └── useSpotify.js              ← now playing, token refresh, polling 30s
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TitleBar.vue           ← feux tricolores macOS + nom fichier actif
│   │   │   ├── ActivityBar.vue        ← icônes verticales (Explorer, Search, Git, Extensions)
│   │   │   ├── Sidebar.vue            ← arborescence cliquable + panel GitHub
│   │   │   ├── TabBar.vue             ← onglets ouverts, closables
│   │   │   ├── LineNumbers.vue        ← numéros de ligne à gauche du contenu
│   │   │   ├── StatusBar.vue          ← branche, heure, Spotify info
│   │   │   └── MiniMap.vue            ← minimap décorative (droite éditeur)
│   │   └── widgets/
│   │       ├── SpotifyWidget.vue      ← panneau flottant Now Playing
│   │       └── GitHubPanel.vue        ← panel Source Control (liste repos + activité)
│   └── views/
│       ├── HomeView.vue               ← README.md hero + typewriter
│       ├── AboutView.vue
│       ├── ExperienceView.vue
│       ├── ProjectsView.vue           ← liste repos GitHub dynamique
│       ├── ProjectDetailView.vue      ← README rendu ou page vide stylisée
│       ├── SkillsView.vue
│       └── ContactView.vue
└── public/
    └── favicon.ico
```

---

## 5. Layout VS Code — structure CSS

```
┌─────────────────────────────────────────────────────┐
│  TitleBar (⬤ ⬤ ⬤  |  README.md — Portfolio)       │
├──┬──────────────────────────────────────────────┬───┤
│  │  Sidebar (Explorer / GitHub Panel)           │   │
│A │──────────────────────────────────────────────│ M │
│c │  TabBar (about.vue × | experience.vue | ...) │ i │
│t │──────────────────────────────────────────────│ n │
│i │ LN │  <router-view> (contenu section)        │ i │
│v │    │                                         │ M │
│i │    │                                         │ a │
│t │    │                                         │ p │
│y │    │                                         │   │
│B │    │                                         │   │
│a │    │                                         │   │
│r │    │                                         │   │
├──┴──────────────────────────────────────────────┴───┤
│  StatusBar (main | fichier | heure | ▶ Spotify)     │
└─────────────────────────────────────────────────────┘
```

- `App.vue` = grid CSS `[activity-bar] [sidebar] [editor-area] [minimap]`
- `editor-area` = flex column `[tab-bar] [content-with-line-numbers]`
- Sidebar width : ~240px, resizable optionnel
- ActivityBar width : ~48px

---

## 6. Thème Tokyo Night — variables CSS

```css
:root {
  --bg-editor:      #1a1b2e;
  --bg-sidebar:     #16161f;
  --bg-activity:    #16161f;
  --bg-tab-active:  #1a1b2e;
  --bg-tab-inactive:#13131a;
  --status-bar:     #7c3aed;
  --text-main:      #c0caf5;
  --text-comment:   #565f89;
  --text-keyword:   #bb9af7;
  --text-string:    #9ece6a;
  --text-function:  #7dcfff;
  --text-number:    #ff9e64;
  --border:         #2a2b3e;
  --font-mono:      'JetBrains Mono', 'Fira Code', monospace;
}
```

---

## 7. Composables

### `useGitHub.js`
```
- fetchRepos()      → GET /users/{username}/repos?sort=updated&per_page=20
                      Cache dans sessionStorage['gh_repos']
- fetchReadme(repo) → GET /repos/{owner}/{repo}/readme
                      Décode base64, retourne markdown string
- État réactif :    repos[], loading, error
```

### `useSpotify.js`
```
- refreshAccessToken()  → POST https://accounts.spotify.com/api/token
                           (client_credentials via client_id + client_secret + refresh_token)
                           ⚠ exposé côté client — voir note sécurité
- fetchNowPlaying()     → GET https://api.spotify.com/v1/me/player/currently-playing
- Polling : setInterval toutes les 30 secondes
- État réactif :    track{}, isPlaying, progress, duration, loading, error
```

---

## 8. Sidebar Explorer — arborescence

```
📁 PORTFOLIO — QUENTIN ROBERT
└── 📁 src
    ├── 📄 about.vue          → /about
    ├── 📄 experience.vue     → /experience
    ├── 📄 projects.vue       → /projects
    │   └── 📁 projects/      ← généré dynamiquement depuis GitHub
    │       ├── 📄 repo-1
    │       └── 📄 repo-2
    ├── 📄 skills.vue         → /skills
    └── 📄 contact.vue        → /contact
📄 README.md                  → / (home)
📄 package.json               → /package-json (easter egg)
```

- Chaque clic = navigation + création onglet si pas déjà ouvert
- Repos GitHub = sous-dossier `📁 projects/` dans la sidebar
- Chaque repo = `📄 nom-repo` avec badge langage + ⭐ + fork indicator

---

## 9. Système d'onglets

- Store réactif `tabs[]` (composable ou `ref` global dans App.vue)
- Chaque onglet : `{ id, label, route, closable: true }`
- `README.md` = onglet non fermable par défaut (toujours présent)
- Fermer un onglet → navigation vers l'onglet précédent ou `README.md`
- Onglet actif = surlignage + curseur visible en pseudo-element

---

## 10. Animations

| Animation | Implémentation |
|---|---|
| Typewriter hero | `setInterval` + ref string, CSS cursor blink |
| Curseur clignotant | `@keyframes blink` sur `::after` pseudo-element |
| Transition sections | Vue `<Transition name="fade">` sur `<router-view>` |
| Hover sidebar | CSS `:hover` background highlight |
| Icône Spotify pulse | `@keyframes pulse` quand `isPlaying === true` |
| Scrollbar VS Code | `::-webkit-scrollbar` custom CSS |

---

## 11. Responsive mobile

- `< 768px` : Sidebar cachée par défaut
- ActivityBar remplacée par une bottom-nav fixe avec les mêmes icônes
- Sidebar s'ouvre en overlay (drawer) depuis la bottom-nav
- StatusBar Spotify reste visible (scroll horizontal si trop long)
- MiniMap cachée sur mobile

---

## 12. Easter egg `package.json`

- Route `/package-json`
- Affiche le vrai `package.json` du projet fetché depuis `/package.json`
- JSON avec coloration syntaxique Tokyo Night (clés en bleu, strings en vert, nombres en orange)
- Onglet `package.json` avec icône JSON

---

## 13. Ordre d'implémentation

### Phase 1 — Scaffold + layout shell (structure visuelle)
1. `vite create` projet Vue 3
2. Variables CSS Tokyo Night dans `src/style.css`
3. `App.vue` — grille CSS complète (activity bar + sidebar + editor + status bar)
4. `TitleBar.vue` — feux macOS + nom fichier
5. `ActivityBar.vue` — icônes (SVG inline ou icônes texte Unicode)
6. `Sidebar.vue` — arborescence statique (sans GitHub pour l'instant)
7. `TabBar.vue` — système d'onglets réactif
8. `StatusBar.vue` — heure temps réel + placeholders Spotify
9. `LineNumbers.vue` + scroll synchro

### Phase 2 — Vues statiques (contenu)
10. `HomeView.vue` — README hero + typewriter
11. `AboutView.vue`
12. `ExperienceView.vue`
13. `SkillsView.vue`
14. `ContactView.vue`
15. `package.json` easter egg view

### Phase 3 — Intégration GitHub
16. `useGitHub.js` — fetch repos + sessionStorage cache
17. `ProjectsView.vue` — liste dynamique avec états loading/error
18. Sidebar — sous-dossier `projects/` dynamique
19. `ProjectDetailView.vue` — README rendu + page vide stylisée
20. `GitHubPanel.vue` — panel Source Control

### Phase 4 — Intégration Spotify
21. `useSpotify.js` — now playing + token refresh + polling
22. `StatusBar.vue` — info Spotify live
23. `SpotifyWidget.vue` — panneau flottant

### Phase 5 — Polish & responsive
24. Animations (typewriter, transitions, pulse)
25. MiniMap décorative
26. Responsive mobile (bottom-nav, drawer)
27. `.env.example` + `.gitignore`
28. README projet

---

## 14. Décisions techniques à valider

1. **Routing mode** : hash (`#/about`) recommandé pour compat hébergement statique.
   Alternatif : history mode avec config Vite/Vercel rewrite.

2. **Spotify client_secret** : exposé dans le bundle en dev.
   En prod → Vercel Edge Function `/api/spotify-token` recommandé.
   Implémenter les deux (commentaire + fallback côté client pour le dev local).

3. **marked vs vue-markdown-it** : `marked` + `highlight.js` choisi
   pour le rendu des README GitHub avec Tokyo Night highlight.

4. **MiniMap** : décorative (image statique générée CSS) ou fonctionnelle (scroll synchro) ?
   Recommandation : décorative avec lignes simulées en CSS pour ne pas alourdir le bundle.

5. **Store tabs** : `ref` partagé via `provide/inject` dans `App.vue`
   ou composable `useTabs.js` léger (pas de Pinia pour ce projet).

---

## 15. Points d'attention

- Ne jamais committer `.env` (`.gitignore` inclus)
- `VITE_GITHUB_TOKEN` exposé côté client — utiliser un token avec scope minimal (read-only public repos)
- Rate limit GitHub API : 60 req/h sans token, 5000/h avec token — sessionStorage cache mitige ça
- Spotify : si `currently-playing` retourne 204 (rien en lecture), afficher `⏸ Not playing`
- Marked : sanitiser le HTML rendu (marked v5+ désactive HTML par défaut — ok)

---

*Attente de validation avant implémentation.*
