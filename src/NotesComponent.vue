<script lang="ts" setup>

import StyledButton from '@/components/StyledButton.vue';
import {computed, ref, watch} from 'vue';
import StyledCheckbox from '@/components/StyledCheckbox.vue';

const open = ref(false);
const canEdit = ref(false);
const text = ref(localStorage.getItem('notes') ?? '');

const textBoxClass = computed(() => {
  return {
    'bg-white': canEdit.value,
    'bg-transparent': !canEdit.value,
    'p-2': true,
    'border': canEdit.value,
    'rounded-lg': true,
    'shadow': canEdit.value,
    'w-full': true,
    'outline-none': true,
    'resize-none': !canEdit.value,
  }
})

watch(text, (newValue) => {
  localStorage.setItem('notes', newValue);
})
</script>

<template>
  <div class="relative h-full">
    <div class="absolute bottom-2 right-2">
      <StyledButton @click="open = !open" :active="canEdit">N</StyledButton>
    </div>
    <div v-if="open">
      <textarea
          :value="text"
          @input="text = ($event.target as HTMLInputElement).value"
          :class="textBoxClass"
          rows="10"
          :readonly="!canEdit"
      ></textarea>
      <div class="flex pr-4 justify-end">
        <StyledCheckbox id="notesEditable" v-model:checked="canEdit" label="Editierbar"/>
      </div>
    </div>
  </div>
</template>