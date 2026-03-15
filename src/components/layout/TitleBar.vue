<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTabs } from '@/composables/useTabs.js'

const { tabs, activeTabId } = useTabs()
const route = useRoute()

const activeLabel = computed(() => tabs.value.find(t => t.id === activeTabId.value)?.label ?? 'README.md')

const breadcrumb = computed(() => {
  const path = route.path
  if (path === '/') return ['PORTFOLIO', 'README.md']
  if (path.startsWith('/projects/')) return ['PORTFOLIO', 'projects', path.split('/projects/')[1]]
  return ['PORTFOLIO', 'src', activeLabel.value]
})
</script>

<template>
  <div class="title-bar">
    <div class="traffic-lights">
      <span class="light red"   />
      <span class="light yellow"/>
      <span class="light green" />
    </div>

    <div class="breadcrumb">
      <template v-for="(seg, i) in breadcrumb" :key="i">
        <span v-if="i > 0" class="sep">›</span>
        <span class="seg" :class="{ last: i === breadcrumb.length - 1 }">{{ seg }}</span>
      </template>
    </div>

    <div class="spacer" />
  </div>
</template>

<style scoped>
.title-bar {
  height: var(--title-height);
  background: var(--title-bar);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  user-select: none;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.traffic-lights {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}

.light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
}
.light.red    { background: #ff5f57; }
.light.yellow { background: #ffbd2e; }
.light.green  { background: #28ca41; }

.breadcrumb {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12px;
  overflow: hidden;
}

.sep { color: var(--text-comment); font-size: 10px; }

.seg {
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
.seg.last { color: var(--text-main); }

.spacer { width: 68px; flex-shrink: 0; }
</style>
