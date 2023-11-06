<script setup lang="ts">

withDefaults(defineProps<{
  id: string,
  label?: string,
  checked: boolean,
}>(), {});

const emit = defineEmits<{
  (event: 'update:checked', value: boolean): void
}>();
</script>

<template>
  <div class="flex flex-row gap-3 items-center">
    <input type="checkbox"
           :id="id"
           :checked="checked"
           @input="emit('update:checked', ($event.target as HTMLInputElement).checked)"
           class="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
    >
    <label :for="id" class="text-sm font-medium text-gray-900">{{ label }}</label>
  </div>
</template>