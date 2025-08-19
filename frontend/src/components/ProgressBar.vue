<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ completed: number; total: number }>()
const completed = computed(() => props.completed)
const total = computed(() => props.total)
const percent = computed(() => total.value > 0 ? Math.round((completed.value / total.value) * 100) : 0)
</script>

<template>
  <div class="progress-container" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: percent + '%' }"></div>
    </div>
    <div class="progress-label">{{ completed }} / {{ total }} completed — {{ percent }}%</div>
  </div>
</template>

<style scoped>
.progress-container{ display:flex; align-items:center; gap:12px; width:100%; margin:6px 0 12px }
.progress-track{ flex:1; height:12px; background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:999px; overflow:hidden; border:1px solid rgba(255,255,255,0.03) }
.progress-fill{ height:100%; background: linear-gradient(90deg, var(--accent), var(--primary)); transition: width 360ms cubic-bezier(.2,.9,.3,1) }
.progress-label{ white-space:nowrap; color:var(--muted); font-size:0.85rem }
</style>
