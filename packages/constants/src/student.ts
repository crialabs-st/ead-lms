export const STUDENT_CONFIG = {
  statuses: [
    { value: 'cursando', label: 'Em Andamento' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'trancado', label: 'Trancado' },
    { value: 'jubilado', label: 'Jubilado' },
  ],
  gradeScale: {
    min: 0,
    max: 10,
    passing: 7,
  },
  frequencyScale: {
    min: 0,
    max: 100,
    required: 75,
  },
} as const;
