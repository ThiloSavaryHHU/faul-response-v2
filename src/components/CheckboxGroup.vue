<script setup lang="ts">

import StyledCheckbox from '@/components/StyledCheckbox.vue';

const props = defineProps<{
  options: Array<{
    label: string,
    value: string | number,
  }>
  modelValue: Array<string | number>,
  name: string,
  title?: string,
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: Array<string | number>): void
}>();

function handleUpdate(key: string | number, checked: boolean): void {
  emit(
    'update:modelValue',
    checked ? [...props.modelValue, key] : props.modelValue.filter((value) => value !== key)
  )
}
</script>

<template>
  <div>
    <div class="font-bold" v-if="title !== undefined">{{ title }}</div>
    <template v-for="option in options" :key="option.value">
      <StyledCheckbox
          :name="name"
          :value="option.value"
          :id="name + '-' + option.value"
          :checked="modelValue.includes(option.value)"
          @update:checked="(checked) => handleUpdate(option.value, checked)"
          :label="option.label"
      />
    </template>
  </div>
</template>