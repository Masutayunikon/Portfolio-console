<script setup>
import { useRouter } from 'vue-router'
import { useTabs } from '@/composables/useTabs.js'

const router = useRouter()
const { tabs, activeTabId, closeTab, setActiveTab } = useTabs()

function clickTab(tab) {
  setActiveTab(tab.id)
  router.push(tab.route)
}

function handleClose(e, tab) {
  e.stopPropagation()
  const current = activeTabId.value === tab.id
  closeTab(tab.id)
  if (current) {
    const remaining = tabs.value
    const target = remaining[remaining.length - 1]
    if (target) router.push(target.route)
  }
}

const EXT_COLORS = {
  vue:  '#42b883',
  md:   '#519aba',
  json: '#cbcb41',
}
</script>

<template>
  <div class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.id"
      class="tab"
      :class="{ active: tab.id === activeTabId }"
      @click="clickTab(tab)"
    >
      <span
        class="tab-dot"
        :style="{ background: EXT_COLORS[tab.icon] ?? '#858585' }"
      />
      <span class="tab-label">{{ tab.label }}</span>
      <button
        v-if="tab.closable !== false"
        class="tab-close"
        @click="handleClose($event, tab)"
      >×</button>
    </div>
  </div>
</template>

<style scoped>
.tab-bar {
  height: var(--tab-height);
  background: var(--bg-tab-inactive);
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 0;
}

.tab-bar::-webkit-scrollbar { height: 3px; }

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  min-width: 100px;
  max-width: 180px;
  cursor: pointer;
  background: var(--bg-tab-inactive);
  border-right: 1px solid var(--border);
  color: var(--text-dim);
  font-size: 13px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s;
  position: relative;
}

.tab:hover { background: var(--bg-hover); color: var(--text-main); }

.tab.active {
  background: var(--bg-tab-active);
  color: var(--text-main);
  border-top: 1px solid var(--status-bar);
}

.tab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tab-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-close {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0 2px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s;
}

.tab:hover .tab-close,
.tab.active .tab-close { opacity: 1; }
.tab-close:hover { background: var(--bg-selection); color: var(--text-main); }
</style>
