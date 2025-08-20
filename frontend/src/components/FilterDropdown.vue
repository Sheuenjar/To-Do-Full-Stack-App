<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const toggle = () => { open.value = !open.value }
const select = (val: string) => { emit('update:modelValue', val); open.value = false }

function onDocClick(e: MouseEvent) {
  if (!root.value) return
  if (!(e.target instanceof Node)) return
  if (!root.value.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div ref="root" class="filter-dropdown">
    <label class="form-label filter-label">
      <span v-if="props.label">{{ props.label }}</span>
      <button class="menu-btn filter-btn" type="button" @click.prevent="toggle" :aria-expanded="open">
        <span class="filter-btn-inner">
          {{ (props.options.find(o => o.value === props.modelValue) || { label: 'All' }).label }}
        </span>
      </button>
    </label>

    <transition name="fade">
      <div v-if="open" class="menu-dropdown filter-menu">
        <button v-for="opt in props.options" :key="opt.value" class="menu-item" @click="select(opt.value)">
          <span class="menu-item-inner">
            <span>{{ opt.label }}</span>
          </span>
        </button>
      </div>
    </transition>
  </div>
</template>
