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

export type GenerativeSettings = {
  quality: GenerativeSection,
  taskErrors: GenerativeSection,
  syntaxErrors: GenerativeSection,
  extra: GenerativeSection
}