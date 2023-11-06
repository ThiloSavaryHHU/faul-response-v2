<script setup lang="ts">
import StyledRadio from '@/components/StyledRadio.vue';

defineProps<{
  options: Array<{
    label: string,
    value: string | number,
  }>
  modelValue: string | number,
  name: string,
  title?: string,
}>();
</script>

<template>
  <div>
    <div class="font-bold" v-if="title !== undefined">{{ title }}</div>
    <template v-for="option in options" :key="option.value">
      <StyledRadio
          :name="name"
          :value="option.value"
          :id="name + '-' + option.value"
          :checked="modelValue === option.value"
          @update:checked="$emit('update:modelValue', option.value)"
          :label="option.label"
      />
    </template>
  </div>
</template>