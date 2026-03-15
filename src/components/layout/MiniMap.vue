<template>
  <div class="minimap" aria-hidden="true">
    <div v-for="i in 80" :key="i" class="mm-line">
      <span
        v-for="j in lineSegments(i)"
        :key="j.key"
        class="mm-seg"
        :style="{ width: j.w + 'px', background: j.color, opacity: j.opacity }"
      />
    </div>
  </div>
</template>

<script setup>
// Generates deterministic pseudo-random decorative lines seeded by index
function lineSegments(i) {
  const COLORS = ['#bb9af7', '#9ece6a', '#7dcfff', '#ff9e64', '#565f89', '#c0caf5']
  const seed = (i * 2654435761) >>> 0
  const count = (seed % 4) + 1
  const segs = []
  let x = 0
  for (let k = 0; k < count; k++) {
    const s2 = ((seed ^ (k * 40503)) * 2246822519) >>> 0
    const w = 8 + (s2 % 28)
    const gap = 2 + (((s2 >> 8)) % 6)
    segs.push({ key: k, w, color: COLORS[s2 % COLORS.length], opacity: 0.25 + (s2 % 4) * 0.1 })
    x += w + gap
    if (x > 80) break
  }
  return segs
}
</script>

<style scoped>
.minimap {
  width: 60px;
  background: var(--bg-sidebar);
  border-left: 1px solid var(--border);
  padding: 16px 4px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mm-line {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 2px;
}

.mm-seg {
  height: 2px;
  border-radius: 1px;
  display: block;
}

@media (max-width: 900px) {
  .minimap { display: none; }
}
</style>
