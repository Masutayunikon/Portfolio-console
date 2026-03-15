<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useTabs } from '@/composables/useTabs.js'

const emit = defineEmits(['toggle-sidebar'])
const router = useRouter()
const route  = useRoute()
const { openTab } = useTabs()

const NAV = [
  { id: 'home',       label: 'Home',       icon: 'M',  route: '/',           tabLabel: 'README.md',     tabIcon: 'md'   },
  { id: 'about',      label: 'About',      icon: '👤', route: '/about',      tabLabel: 'about.vue',     tabIcon: 'vue'  },
  { id: 'experience', label: 'XP',         icon: '💼', route: '/experience', tabLabel: 'experience.vue',tabIcon: 'vue'  },
  { id: 'projects',   label: 'Projects',   icon: '📁', route: '/projects',   tabLabel: 'projects.vue',  tabIcon: 'vue'  },
  { id: 'skills',     label: 'Skills',     icon: '⚡', route: '/skills',     tabLabel: 'skills.vue',    tabIcon: 'vue'  },
  { id: 'contact',    label: 'Contact',    icon: '✉',  route: '/contact',    tabLabel: 'contact.vue',   tabIcon: 'vue'  },
]

function navigate(item) {
  openTab({ id: item.id, label: item.tabLabel, route: item.route, icon: item.tabIcon })
  router.push(item.route)
}

function isActive(item) {
  return route.path === item.route || (item.route !== '/' && route.path.startsWith(item.route))
}
</script>

<template>
  <nav class="bottom-nav">
    <button
      v-for="item in NAV"
      :key="item.id"
      class="nav-item"
      :class="{ active: isActive(item) }"
      @click="navigate(item)"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </button>

    <!-- Explorer toggle -->
    <button class="nav-item" @click="$emit('toggle-sidebar')">
      <span class="nav-icon">☰</span>
      <span class="nav-label">Files</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: none;
  height: 52px;
  background: var(--bg-activity);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-dim);
  font-family: var(--font-mono);
  padding: 4px 2px;
  transition: color 0.15s;
  min-width: 0;
}
.nav-item:hover, .nav-item.active { color: var(--text-main); }
.nav-item.active { border-top: 2px solid var(--status-bar); }

.nav-icon  { font-size: 14px; line-height: 1; }
.nav-label { font-size: 9px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }

@media (max-width: 768px) {
  .bottom-nav { display: flex; }
}
</style>
