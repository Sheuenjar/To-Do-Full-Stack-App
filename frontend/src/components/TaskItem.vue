<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'
import type { Task } from '../types/task'
import TaskForm from './TaskForm.vue'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{ (e: 'edit', task: Task): void; (e: 'delete', id: number): void; (e: 'toggle', id: number): void }>()

const showMenu = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const isEditing = ref(false)

const toggle = () => emit('toggle', props.task.id)
const edit = () => { isEditing.value = true; showMenu.value = false }
const del = () => { emit('delete', props.task.id); showMenu.value = false }

const onDocumentClick = (e: MouseEvent) => {
  if (menuRef.value && !(menuRef.value as HTMLElement).contains(e.target as Node)) {
    showMenu.value = false
  }
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') showMenu.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="task-row" role="listitem">
  <div :class="['task-card', `priority-${task.priority}`, { 'task-card--completed': task.completed }]">
      <button class="checkbox-visual" :class="{ checked: task.completed }" @click="toggle" aria-label="Toggle completed">
        <svg v-if="task.completed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </button>

      <div style="flex:1; text-align:left">
        <div class="task-title">{{ task.title }}</div>
        <div class="task-meta">{{ task.description }}</div>
      </div>

      <div style="display:flex; align-items:center; gap:8px">
        <span class="priority-badge" :class="`priority-${task.priority}`">{{ task.priority.toUpperCase() }}</span>
      </div>

  <div class="menu-container" ref="menuRef" style="position:relative">
        <button class="menu-btn" @click.stop="showMenu = !showMenu" aria-label="Open menu" :aria-expanded="showMenu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
        </button>

        <div v-if="showMenu" class="menu-dropdown" role="menu">
          <button class="menu-item" @click="edit" role="menuitem">Edit</button>
          <button class="menu-item" @click="del" role="menuitem">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="isEditing" style="margin-top:8px">
      <TaskForm :taskToEdit="task" @close="isEditing = false" />
    </div>
  </div>
</template>
