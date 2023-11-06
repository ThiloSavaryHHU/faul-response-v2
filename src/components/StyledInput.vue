<script setup lang="ts">
import type {InputHTMLAttributes} from 'vue';

withDefaults(defineProps<{
  id: string,
  label?: string,
  placeholder?: string,
  required?: InputHTMLAttributes['required'],
  modelValue: string | number,
  type?: string,
}>(), {
  type: 'text',
  required: false,
  placeholder: '',
});


</script>

<template>
  <div>
    <label for="{{id}}" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
    <input :type="type"
           :placeholder="placeholder"
           :required="required"
           :id="id"
           :value="modelValue"
           @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
           class="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    >
  </div>
</template>