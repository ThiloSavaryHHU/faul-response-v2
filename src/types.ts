export type GenerativeOption = {
  label: string,
  value: string
  text: string | string[],
  points?: number | 'MAX',
}

export type GenerativeSection = {
  intro?: string,
  options: GenerativeOption[]
}

export type GenerativeTaskOption = GenerativeOption & {
  task: string
}

export type GenerativeSettings = {
  quality: GenerativeSection,
  taskErrors: GenerativeTaskOption,
  syntaxErrors: GenerativeSection,
  extra: GenerativeSection
}