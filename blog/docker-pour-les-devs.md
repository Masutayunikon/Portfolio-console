---
title: Docker pour les devs frontend
date: 2024-04-02
description: Containeriser une app Vue avec un proxy Node — sans exposer ses secrets
tags: [docker, devops, vue, node]
---

# Docker pour les devs frontend

Docker peut sembler intimidant quand on vient du frontend. Voici comment je containerise mes apps Vue sans tomber dans les pièges classiques.

## Le piège des secrets dans l'image

La première erreur que j'ai faite : passer les API keys en `ARG` au moment du build.

```dockerfile
# ❌ À éviter — les secrets sont visibles dans les layers Docker
ARG VITE_API_KEY
RUN npm run build
```

Les `ARG` sont visibles dans l'historique de l'image (`docker history`). Tout le monde peut les lire.

## La solution : un proxy backend

Au lieu d'exposer les tokens côté client, j'ai ajouté un serveur Express qui :

1. Lit les secrets depuis `process.env` (jamais dans le bundle)
2. Proxifie les appels à GitHub et Spotify
3. Sert les fichiers statiques du build Vue

```
Browser → /api/github/repos → Express → GitHub API (avec token)
Browser → /api/spotify/now-playing → Express → Spotify API (avec secret)
Browser → / → Express → dist/ (fichiers statiques)
```

## Le Dockerfile en 2 étapes

```dockerfile
# Étape 1 : build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : serve
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server/ ./server/
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "server/index.js"]
```

Aucun secret dans l'image. On les passe au runtime :

```bash
docker run -p 3000:3000 \
  -e VITE_GITHUB_TOKEN=ghp_xxx \
  -e VITE_SPOTIFY_CLIENT_SECRET=xxx \
  monimage:latest
```

## Résultat

Les tokens ne quittent jamais le serveur. Le bundle Vue ne contient aucune information sensible.
