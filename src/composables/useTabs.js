import { ref, readonly } from 'vue'

const tabs = ref([
  { id: 'home', label: 'README.md', route: '/', icon: 'markdown', closable: false }
])
const activeTabId = ref('home')

export function useTabs() {
  function openTab({ id, label, route, icon = 'vue' }) {
    if (!tabs.value.find(t => t.id === id)) {
      tabs.value.push({ id, label, route, icon, closable: true })
    }
    activeTabId.value = id
  }

  function closeTab(id) {
    const idx = tabs.value.findIndex(t => t.id === id)
    if (idx === -1) return
    tabs.value.splice(idx, 1)
    if (activeTabId.value === id) {
      const next = tabs.value[idx] || tabs.value[idx - 1] || tabs.value[0]
      activeTabId.value = next?.id ?? 'home'
    }
  }

  function setActiveTab(id) {
    activeTabId.value = id
  }

  return {
    tabs: readonly(tabs),
    activeTabId: readonly(activeTabId),
    openTab,
    closeTab,
    setActiveTab
  }
}
