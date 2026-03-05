export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatShortDate(
  date: Date | string,
  includeYear = false
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-BR', {
    month: 'short',
    day: '2-digit',
    ...(includeYear && { year: 'numeric' }),
  });
}

export function getRelativeTime(
  date: Date | string,
  options: { short?: boolean; alwaysShowTime?: boolean } = {}
): string {
  const { short = false, alwaysShowTime = false } = options;
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) {
    return alwaysShowTime ? (short ? '1m atrás' : '1 minuto atrás') : 'agora mesmo';
  }

  const minutos = Math.floor(seconds / 60);
  if (minutos < 60) {
    return short ? `${minutos}m atrás` : `${minutos} minutos atrás`;
  }

  const hours = Math.floor(seconds / 3600);
  if (hours < 24) {
    return short ? `${hours}h atrás` : `${hours} hours atrás`;
  }

  const dias = Math.floor(seconds / 86400);
  if (dias < 7) {
    return short ? `${dias}d atrás` : `${dias} dias atrás`;
  }

  const semanas = Math.floor(dias / 7);
  if (semanas < 4) {
    return short ? `${semanas}w atrás` : `${semanas} semanas atrás`;
  }

  return formatDate(d);
}

export function formatTime(date: Date | string | number): string {
  const d =
    typeof date === 'number'
      ? new Date(date)
      : typeof date === 'string'
        ? new Date(date)
        : date;
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}



export class PriceFormatter {
  static formatPrice(value: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(value);
  }

  static formatPriceWithPeriod(
    value: number,
    period: string,
    currency: string = 'BRL'
  ): string {
    const formatted = PriceFormatter.formatPrice(value, currency);
    const periodMap: Record<string, string> = {
      mensal: '/mês',
      semestral: '/semestre',
      anual: '/ano',
      unica: '',
    };
    return `${formatted}${periodMap[period] || ''}`;
  }
}


export class ProgressFormatter {
  static formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
  }

  static getProgressColor(
    percentage: number
  ): 'success' | 'warning' | 'danger' {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  }

  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}min`;
    }

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h${remainingMinutes}min`;
  }
}

export class TextFormatter {
  static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  static formatStudentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'cursando': 'Em Andamento',
      'concluido': 'Concluído',
      'trancado': 'Trancado',
      'jubilado': 'Jubilado'
    };
    return statusMap[status] || status;
  }

  static formatCourseLevel(level: string): string {
    const levelMap: Record<string, string> = {
      'tecnico': 'Técnico',
      'graduacao': 'Graduação',
      'pos-graduacao': 'Pós-Graduação',
      'extensao': 'Extensão'
    };
    return levelMap[level] || level;
  }

  static formatModality(modality: string): string {
    const modalityMap: Record<string, string> = {
      'presencial': 'Presencial',
      'ead': 'EAD',
      'hibrido': 'Híbrido'
    };
    return modalityMap[modality] || modality;
  }

  static capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}

export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidCPF(cpf: string): boolean {
    // Basic CPF validation - in a real app, use a proper library
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    return cleanCPF.length === 11;
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}