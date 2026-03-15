<script setup>
import { computed } from 'vue'
import { useTabs } from '@/composables/useTabs.js'

const { tabs, activeTabId } = useTabs()
const activeLabel = computed(() => tabs.value.find(t => t.id === activeTabId.value)?.label ?? 'README.md')
</script>

<template>
  <div class="title-bar">
    <div class="traffic-lights">
      <span class="light red"   />
      <span class="light yellow"/>
      <span class="light green" />
    </div>
    <div class="title">{{ activeLabel }} — Portfolio · Quentin Robert</div>
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

.title {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: var(--text-dim);
  letter-spacing: 0.02em;
}

.spacer { width: 68px; }
</style>
