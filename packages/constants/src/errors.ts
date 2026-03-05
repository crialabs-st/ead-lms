export const ERROR_MESSAGES = {
  generic: 'Algo deu errado. Tente novamente.',
  network: 'Erro de conexão. Verifique sua internet.',
  notFound: 'Recurso não encontrado.',
  unauthorized: 'Você não tem permissão para acessar este recurso.',
  validation: {
    required: 'Este campo é obrigatório.',
    email: 'Digite um e-mail válido.',
    minLength: (min: number) => `Mínimo de ${min} caracteres.`,
    maxLength: (max: number) => `Máximo de ${max} caracteres.`,
  },
} as const;
