<script setup lang="ts">
withDefaults(defineProps<{
  id: string,
  label?: string,
  required?: boolean,
  modelValue: string,
}>(), {
  required: false,
});


</script>

<template>
  <div>
    <label for="{{id}}" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
    <select :required="required"
            :id="id"
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            class="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    >
      <slot></slot>
    </select>
  </div>
</template>