<script setup lang="ts">
withDefaults(defineProps<{
  id: string,
  label?: string,
  checked: boolean,
  name: string,
  value: string | number,
}>(), {});


</script>

<template>
  <div class="flex flex-row gap-3">
    <input type="radio"
           :id="id"
           :checked="checked"
           :name="name"
           :value="value"
           @input="$emit('update:checked', ($event.target as HTMLInputElement).checked)"
           class="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
    >
    <label :for="id" class="text-sm font-medium text-gray-900">{{ label }}</label>
  </div>
</template>