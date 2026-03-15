#!/bin/sh
# Generates /usr/share/nginx/html/env-config.js at container startup
# so runtime env vars override the build-time ones.

cat > /usr/share/nginx/html/env-config.js << EOF
window.__env__ = {
  VITE_GITHUB_TOKEN:           "${VITE_GITHUB_TOKEN:-}",
  VITE_GITHUB_USERNAME:        "${VITE_GITHUB_USERNAME:-Masutayunikon}",
  VITE_SPOTIFY_CLIENT_ID:      "${VITE_SPOTIFY_CLIENT_ID:-}",
  VITE_SPOTIFY_CLIENT_SECRET:  "${VITE_SPOTIFY_CLIENT_SECRET:-}",
  VITE_SPOTIFY_REFRESH_TOKEN:  "${VITE_SPOTIFY_REFRESH_TOKEN:-}"
};
EOF

exec nginx -g "daemon off;"
