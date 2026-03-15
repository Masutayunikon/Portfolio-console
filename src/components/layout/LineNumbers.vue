<script setup>
defineProps({
  count: { type: Number, default: 60 }
})
</script>

<template>
  <div class="line-numbers" aria-hidden="true">
    <span v-for="n in count" :key="n">{{ n }}</span>
  </div>
</template>

<style scoped>
.line-numbers {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 16px 8px 16px 12px;
  color: var(--text-comment);
  font-size: 13px;
  line-height: var(--line-height);
  user-select: none;
  min-width: 44px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  background: var(--bg-editor);
}

.line-numbers span {
  display: block;
  height: calc(var(--font-size) * var(--line-height));
}
</style>
