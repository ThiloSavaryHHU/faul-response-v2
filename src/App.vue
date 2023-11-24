<script setup lang="ts">
import StyledInput from '@/components/StyledInput.vue';
import {reactive, ref, watch} from 'vue';
import RadioGroup from '@/components/RadioGroup.vue';
import CheckboxGroup from '@/components/CheckboxGroup.vue';
import type {GenerativeOption, GenerativeSection, GenerativeSettings, GenerativeTaskOption} from '@/types';
import StyledButton from '@/components/StyledButton.vue';
import StyledCheckbox from '@/components/StyledCheckbox.vue';
import StyledSelect from '@/components/StyledSelect.vue';

type State = {
  quality: string;
  taskErrors: string[];
  syntaxErrors: string[];
  extra: string[];
}

// Parse initial state from URL
const url = new URL(window.location.href);
const urlState = JSON.parse(url.searchParams.get('state') ?? '{}');

const points = ref(url.searchParams.get('points') ?? 1);
const maxPoints = ref(url.searchParams.get('maxPoints') ?? 1);

const tasks = ref<String[]>([])
const task = ref(url.searchParams.get('task') ?? '---')

console.debug(urlState)

const state = reactive<State>({
  quality: urlState.quality ?? '',
  taskErrors: urlState.taskErrors ?? [],
  syntaxErrors: urlState.syntaxErrors ?? [],
  extra: urlState.extra ?? []
})

let options = reactive<GenerativeSettings>({
  quality: {
    options: []
  },
  taskErrors: {
    options: []
  },
  syntaxErrors: {
    options: []
  },
  extra: {
    options: []
  }
})

type ResponseDataGenerativeOptions = {
  [x: string]: {
    label: string,
    text: string | string[]
  }
}

type ResponseData = {
  tasks: string[],
  quality: {
    options: ResponseDataGenerativeOptions
  },
  taskErrors: {
    intro?: string,
    options: ResponseDataGenerativeOptions
  }
  syntaxErrors: {
    intro?: string,
    options: ResponseDataGenerativeOptions
  },
  extra: {
    intro?: string,
    options: ResponseDataGenerativeOptions
  }
}

function responseToGenerativeOptions(response: ResponseDataGenerativeOptions): GenerativeOption[] {
  return Object.entries(response).reduce((acc, [key, value]) => {
    acc.push({
      value: key,
      label: value.label,
      text: value.text,
    })
    return acc
  }, [] as Array<GenerativeOption>);
}

function responseToGenerativeTaskOptions(response: ResponseDataGenerativeOptions): GenerativeTaskOption[] {
  return Object.entries(response).reduce((acc, [key, value]) => {
    acc.push({
      value: key,
      label: value.label,
      text: value.text,
      task: value.task ?? '__all__'
    })
    return acc
  }, [] as Array<GenerativeTaskOption>);
}

fetch('/responses.json').then((response) => {
  response.json().then((data) => data as ResponseData).then((data) => {
    console.debug(data)
    tasks.value = ['---'].concat(data.tasks ?? []);

    options.quality.options = responseToGenerativeOptions(data.quality.options);
    if (options.quality.options.length > 0 && state.quality === '') {
      state.quality = options.quality.options[0].value;
    }
    options.taskErrors.options = responseToGenerativeTaskOptions(data.taskErrors.options);
    options.taskErrors.intro = data.taskErrors.intro;
    options.syntaxErrors.options = responseToGenerativeOptions(data.syntaxErrors.options);
    options.syntaxErrors.intro = data.syntaxErrors.intro;
    options.extra.options = responseToGenerativeOptions(data.extra.options);
    options.extra.intro = data.extra.intro;
    generateText();
    console.debug(options)
  });
});

function generateTextForSingleChoiceSection(
  section: GenerativeSection, state: string | number, suffix: string = '\n', prefix: string = ''
): string {
  const option = section.options.find((option) => option.value === state);
  if (!option) {
    return '';
  }
  if (typeof option.text === 'string') {
    return prefix + option.text + suffix;
  } else {
    return prefix + option.text[Math.floor(Math.random() * option.text.length)] + suffix;
  }
}

function generateTextForMultipleChoiceSection(
  section: GenerativeSection, state: string[], suffix: string = '\n', prefix: string = ''
): string {
  const options = section.options.filter((option) => state.includes(option.value));
  if (options.length === 0) {
    return '';
  }
  return prefix + (section.intro !== undefined ? (section.intro + '\n') : '') + options.map((option) => {
    if (typeof option.text === 'string') {
      return option.text;
    } else {
      return option.text[Math.floor(Math.random() * option.text.length)];
    }
  }).join('\n') + suffix;
}

const text = ref('');
const canEdit = ref(false);

function copyTextToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
}

function generateText(): void {
  let result = `Punkte: ${points.value}/${maxPoints.value}\n\n`;
  result += '*Wenden Sie sich bei Rückfragen zur Korrektur unter Nennung Ihres GitHub-Namens und der Aufgabe per https://rocketchat.hhu.de an Ihre:n Korrektor:in. Die Kontaktdaten finden Sie im Ilias.*\n\n';
  result += generateTextForSingleChoiceSection(options.quality, state.quality);
  result += generateTextForMultipleChoiceSection(options.taskErrors, state.taskErrors, '\n', '')
  result += generateTextForMultipleChoiceSection(options.syntaxErrors, state.syntaxErrors, '\n', '\n')
  result += generateTextForMultipleChoiceSection(options.extra, state.extra, '\n', '\n')
  result = result.trim();
  text.value = result;
}

function reset(): void {
  state.quality = state.quality.length > 0 ? options.quality.options[0].value : '';
  state.taskErrors = [];
  state.syntaxErrors = [];
  state.extra = [];
}

function filterTaskOptions(options: GenerativeTaskOption[], task: string): GenerativeTaskOption[] {
  return options.filter((option) => option.task === task || option.task === '__all__');
}

watch([task], () => {
  reset();
})

watch([points, maxPoints, state], () => {
  if (!canEdit.value) {
    generateText();
  }
})

watch([points, maxPoints, state, task], () => {
  const stateEncoded = JSON.stringify(state);
  const url = new URL(window.location.href);
  url.searchParams.set('state', stateEncoded);
  url.searchParams.set('points', points.value.toString());
  url.searchParams.set('maxPoints', maxPoints.value.toString());
  url.searchParams.set('task', task.value.toString());
  window.history.replaceState({}, '', url.toString());
})


</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 sm:justify-around w-screen h-screen bg-slate-50 p-4 overflow-y-scroll">
    <div class="rounded-lg border border-slate-200 shadow-lg bg-slate-100 flex flex-col flex-1">
      <div class="flex flex-col md:flex-row justify-stretch p-2 gap-5">
        <StyledInput id="points" v-model="points" label="Punkte" placeholder="Punkte"
                     type="number" class="w-full"/>
        <StyledInput id="maxPoints" v-model="maxPoints" label="Max Punkte" placeholder="Max Punkte"
                     type="number" class="w-full"/>
        <StyledSelect id="task" v-model="task" v-if="tasks.length > 0" label="Aufgabe">
          <option v-for="t in tasks" :value="t" :key="t">{{ t }}</option>
        </StyledSelect>
        <!--        <StyledSelect id="task" v-model="task" label="Aufgabe" class="w-full">-->
        <!--          <optgroup label="Blatt 1">-->
        <!--            <option value="1.1">Aufgabe 1</option>-->
        <!--            <option value="1.2">Aufgabe 2</option>-->
        <!--          </optgroup>-->
        <!--        </StyledSelect>-->
      </div>
      <div class="flex flex-col items-start min-h-0 overflow-scroll xl-screen-flex-wrap">

        <div class="p-2">
          <RadioGroup :options="options.quality.options" name="quality" v-model="state.quality"
                      title="Ingesamte Qualität"/>
        </div>
        <div class="p-2" v-if="filterTaskOptions(options.taskErrors.options, task).length > 0">
          <CheckboxGroup :options="filterTaskOptions(options.taskErrors.options, task)" name="quality" v-model="state.taskErrors"
                         title="Aufgabenspezifische Fehler"/>
        </div>
        <div class="p-2">
          <CheckboxGroup :options="options.syntaxErrors.options" name="syntaxErrors" v-model="state.syntaxErrors"
                         title="Syntax"/>
        </div>
        <div class="p-2" v-if="options.extra.options.length > 0">
          <CheckboxGroup :options="options.extra.options" name="quality" v-model="state.extra"
                         title="Weitere Anmerkungen"/>
        </div>

      </div>
    </div>

    <div class="rounded-lg border border-slate-200 shadow-lg  bg-slate-100 flex-1 overflow-scroll ">
      <div class="p-2 flex justify-between">
        <StyledButton @click="copyTextToClipboard(text)">Kopieren</StyledButton>
        <StyledButton @click="reset()">Reset</StyledButton>
        <StyledButton @click="generateText()">Neu generieren</StyledButton>
      </div>
      <div class="p-2">
        <textarea
            :value="text"
            @input="text = ($event.target as HTMLInputElement).value"
            class="bg-white p-2 border rounded-lg shadow w-full h-96 outline-none"
            :readonly="!canEdit"
        ></textarea>
      </div>
      <div class="flex pr-4 justify-end">
        <StyledCheckbox id="editable" v-model:checked="canEdit" label="Editierbar"/>
      </div>
    </div>
  </div>

</template>

