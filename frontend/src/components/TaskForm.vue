<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTasksStore } from '../store/useTasksStore'
import type { Task } from '../types/task'

interface Props {
  taskToEdit?: { id: number; title: string; description?: string | null }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useTasksStore()

const title = ref(props.taskToEdit?.title || '')
const description = ref(props.taskToEdit?.description || '')

watch(() => props.taskToEdit, (newTask) => {
  title.value = newTask?.title || ''
  description.value = newTask?.description || ''
})

const submit = async () => {
  if (!title.value.trim()) return alert('El título es obligatorio')

  if (props.taskToEdit) {
    await store.editTask(props.taskToEdit.id, title.value, description.value)
  } else {
    await store.createTask(title.value, description.value)
  }

  title.value = ''
  description.value = ''
  emit('close')
}
</script>

<template>
  <div>
    <input v-model="title" placeholder="Título" />
    <input v-model="description" placeholder="Descripción" />
    <button @click="submit">{{ props.taskToEdit ? 'Editar' : 'Agregar' }}</button>
    <button @click="$emit('close')">Cancelar</button>
  </div>
</template>