<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTasksStore } from '../store/useTasksStore'
import type { Task } from '../types/task'

interface Props {
  taskToEdit?: Task
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useTasksStore()

const title = ref(props.taskToEdit?.title || '')
const description = ref(props.taskToEdit?.description || '')
const priority = ref<'low'|'medium'|'high'>(props.taskToEdit?.priority || 'medium')

watch(() => props.taskToEdit, (newTask) => {
  title.value = newTask?.title || ''
  description.value = newTask?.description || ''
  priority.value = (newTask as Task | undefined)?.priority || 'medium'
})

const submit = async () => {
  if (!title.value.trim()) return alert('Title is required')

  if (props.taskToEdit) {
  await store.editTask(props.taskToEdit.id, title.value, description.value, priority.value)
  } else {
  await store.createTask(title.value, description.value, priority.value)
  }

  title.value = ''
  description.value = ''
  emit('close')
}
</script>

<template>
  <div class="task-card" style="flex-direction:column; align-items:stretch">
    <div class="form-header">
  <strong>{{ props.taskToEdit ? 'Edit task' : 'New task' }}</strong>
    </div>

    <label class="form-label">
      Title
      <input class="input-field" v-model="title" placeholder="Title" @keyup.enter="submit" aria-label="Title" />
    </label>

    <label class="form-label">
      Description
      <textarea class="textarea-field" v-model="description" rows="3" placeholder="Description" aria-label="Description"></textarea>
    </label>

    <label class="form-label">
      Priority
      <select class="input-field select-field" v-model="priority" aria-label="Priority">
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </label>

    <div class="form-actions row">
      <div class="spacer"></div>
    <button class="btn" @click="$emit('close')">Cancel</button>
    <button class="btn btn-primary" @click="submit">{{ props.taskToEdit ? 'Save' : 'Add' }}</button>
    </div>
  </div>
</template>
