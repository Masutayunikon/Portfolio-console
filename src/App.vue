<script setup>
import { ref } from 'vue'
import TitleBar      from '@/components/layout/TitleBar.vue'
import ActivityBar   from '@/components/layout/ActivityBar.vue'
import Sidebar       from '@/components/layout/Sidebar.vue'
import TabBar        from '@/components/layout/TabBar.vue'
import LineNumbers   from '@/components/layout/LineNumbers.vue'
import StatusBar     from '@/components/layout/StatusBar.vue'
import MiniMap       from '@/components/layout/MiniMap.vue'
import TerminalPanel from '@/components/layout/TerminalPanel.vue'
import BottomNav     from '@/components/layout/BottomNav.vue'
import SpotifyWidget from '@/components/widgets/SpotifyWidget.vue'

const activePanel      = ref('explorer')
const sidebarVisible   = ref(true)
const spotifyOpen      = ref(false)
const terminalOpen     = ref(false)
const lineCount        = ref(60)
const mobileSidebar    = ref(false)

function toggleSidebar(panel) {
  if (activePanel.value === panel && sidebarVisible.value) {
    sidebarVisible.value = false
  } else {
    activePanel.value = panel
    sidebarVisible.value = true
  }
}

function toggleMobileSidebar() {
  mobileSidebar.value = !mobileSidebar.value
}
</script>

<template>
  <div class="vscode-shell">
    <TitleBar />

    <div class="vscode-body">
      <!-- Desktop activity bar -->
      <ActivityBar :active-panel="activePanel" @toggle-sidebar="toggleSidebar" />

      <!-- Desktop sidebar -->
      <Sidebar v-if="sidebarVisible" :panel="activePanel" class="desktop-sidebar" />

      <!-- Mobile sidebar overlay -->
      <Transition name="slide">
        <div v-if="mobileSidebar" class="mobile-sidebar-overlay" @click.self="mobileSidebar = false">
          <Sidebar panel="explorer" class="mobile-sidebar" />
        </div>
      </Transition>

      <div class="editor-area">
        <TabBar />
        <div class="editor-content">
          <LineNumbers :count="lineCount" />
          <div class="editor-scroll">
            <RouterView v-slot="{ Component }">
              <Transition name="fade" mode="out-in">
                <component :is="Component" @line-count="lineCount = $event" />
              </Transition>
            </RouterView>
          </div>
          <MiniMap />
        </div>

        <!-- Terminal panel -->
        <Transition name="slide-up">
          <TerminalPanel v-if="terminalOpen" @close="terminalOpen = false" />
        </Transition>
      </div>
    </div>

    <StatusBar
      @toggle-spotify="spotifyOpen = !spotifyOpen"
      @toggle-terminal="terminalOpen = !terminalOpen"
    />

    <!-- Mobile bottom nav -->
    <BottomNav @toggle-sidebar="toggleMobileSidebar" />

    <!-- Spotify widget -->
    <Transition name="fade">
      <SpotifyWidget v-if="spotifyOpen" @close="spotifyOpen = false" />
    </Transition>
  </div>
</template>

<style scoped>
.vscode-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-editor);
}

.vscode-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  padding: 16px 24px 40px;
}

/* Mobile sidebar overlay */
.mobile-sidebar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 50;
  display: flex;
}

.mobile-sidebar {
  width: var(--sidebar-width);
  height: 100%;
  flex-shrink: 0;
}

/* Hide desktop sidebar on mobile */
@media (max-width: 768px) {
  .desktop-sidebar { display: none; }
}

/* Terminal slide transition */
.slide-up-enter-active,
.slide-up-leave-active { transition: height 0.2s ease; overflow: hidden; }
.slide-up-enter-from,
.slide-up-leave-to { height: 0 !important; }

/* Mobile overlay slide */
.slide-enter-active,
.slide-leave-active { transition: opacity 0.2s ease; }
.slide-enter-from,
.slide-leave-to { opacity: 0; }
</style>
