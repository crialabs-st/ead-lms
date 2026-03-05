export const COURSE_CONFIG = {
  levels: [
    { value: 'tecnico', label: 'Técnico' },
    { value: 'graduacao', label: 'Graduação' },
    { value: 'pos-graduacao', label: 'Pós-Graduação' },
    { value: 'extensao', label: 'Extensão' },
  ],
  modalities: [
    { value: 'presencial', label: 'Presencial' },
    { value: 'ead', label: 'EAD' },
    { value: 'hibrido', label: 'Híbrido' },
  ],
  statuses: [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'em_breve', label: 'Em Breve' },
    { value: 'encerrado', label: 'Encerrado' },
  ],
  categories: [
    'Tecnologia',
    'Saúde',
    'Gestão',
    'Marketing',
    'Idiomas',
    'Educação',
    'Engenharia',
    'Design',
    'Comunicação',
  ],
} as const;
