<script setup>
import { ref } from 'vue'
import TitleBar    from '@/components/layout/TitleBar.vue'
import ActivityBar from '@/components/layout/ActivityBar.vue'
import Sidebar     from '@/components/layout/Sidebar.vue'
import TabBar      from '@/components/layout/TabBar.vue'
import LineNumbers from '@/components/layout/LineNumbers.vue'
import StatusBar   from '@/components/layout/StatusBar.vue'
import MiniMap     from '@/components/layout/MiniMap.vue'
import SpotifyWidget from '@/components/widgets/SpotifyWidget.vue'

const activePanel    = ref('explorer')   // 'explorer' | 'github'
const sidebarVisible = ref(true)
const spotifyOpen    = ref(false)
const lineCount      = ref(60)

function toggleSidebar(panel) {
  if (activePanel.value === panel && sidebarVisible.value) {
    sidebarVisible.value = false
  } else {
    activePanel.value = panel
    sidebarVisible.value = true
  }
}
</script>

<template>
  <div class="vscode-shell">
    <TitleBar />

    <div class="vscode-body">
      <ActivityBar :active-panel="activePanel" @toggle-sidebar="toggleSidebar" />

      <Sidebar v-if="sidebarVisible" :panel="activePanel" />

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
      </div>
    </div>

    <StatusBar @toggle-spotify="spotifyOpen = !spotifyOpen" />

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
</style>
