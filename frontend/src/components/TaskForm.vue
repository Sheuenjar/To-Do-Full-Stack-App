<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTasksStore } from '../store/useTasksStore'

interface Props {
  taskToEdit?: { id: number; title: string; description: string }
  onClose?: () => void
}

const props = defineProps<Props>()
const store = useTasksStore()

const title = ref(props.taskToEdit?.title || '')
const description = ref(props.taskToEdit?.description || '')

// Si cambia la tarea a editar, actualizar los campos
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
  props.onClose?.()
}
</script>

<template>
  <div>
    <input v-model="title" placeholder="Título" />
    <input v-model="description" placeholder="Descripción" />
    <button @click="submit">{{ props.taskToEdit ? 'Editar' : 'Agregar' }}</button>
    <button v-if="props.onClose" @click="props.onClose">Cancelar</button>
  </div>
</template>
