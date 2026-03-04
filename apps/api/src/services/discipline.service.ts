import type {
  CreateDiscipline,
  Discipline,
  UpdateDiscipline,
} from '@repo/packages-types/discipline';
import type {
  PaginatedResponse,
  QueryOptions,
} from '@repo/packages-types/pagination';
import { ForbiddenError, NotFoundError } from '@repo/packages-utils/errors';

import type { LoggerService } from '@/common/logger.service';
import type { PrismaClient } from '@/generated/client/client.js';

export class DisciplineService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('DisciplineService');
  }

  async getDisciplinesByClass(
    classId: string,
    query: QueryOptions
  ): Promise<PaginatedResponse<Discipline>> {
    const where = { classId };

    const [disciplines, total] = await Promise.all([
      this.prisma.discipline.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.discipline.count({ where }),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: disciplines as Discipline[],
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async getDisciplineById(id: string): Promise<Discipline> {
    const discipline = await this.prisma.discipline.findUnique({
      where: { id },
    });

    if (!discipline) {
      this.logger.warn('Discipline not found', { disciplineId: id });
      throw new NotFoundError('Discipline not found', { disciplineId: id });
    }

    return discipline as Discipline;
  }

  async createDiscipline(
    classId: string,
    instructorId: string,
    createDiscipline: CreateDiscipline
  ): Promise<Discipline> {
    this.logger.info('Creating discipline', {
      classId,
      instructorId,
      code: createDiscipline.code,
    });

    const discipline = await this.prisma.discipline.create({
      data: {
        ...createDiscipline,
        classId,
        instructorId,
      },
    });

    this.logger.info('Discipline created successfully', {
      disciplineId: discipline.id,
    });
    return discipline as Discipline;
  }

  async updateDiscipline(
    actorId: string,
    disciplineId: string,
    updateDiscipline: UpdateDiscipline
  ): Promise<Discipline> {
    const discipline = await this.getDisciplineById(disciplineId);

    if (discipline.instructorId !== actorId) {
      this.logger.warn('Unauthorized discipline update attempt', {
        actorId,
        disciplineId,
      });
      throw new ForbiddenError('You can only update disciplines you teach');
    }

    this.logger.info('Updating discipline', { disciplineId, actorId });

    const updated = await this.prisma.discipline.update({
      where: { id: disciplineId },
      data: updateDiscipline,
    });

    return updated as Discipline;
  }

  async deleteDiscipline(actorId: string, disciplineId: string): Promise<void> {
    const discipline = await this.getDisciplineById(disciplineId);

    if (discipline.instructorId !== actorId) {
      this.logger.warn('Unauthorized discipline delete attempt', {
        actorId,
        disciplineId,
      });
      throw new ForbiddenError('You can only delete disciplines you teach');
    }

    this.logger.info('Deleting discipline', { disciplineId, actorId });

    await this.prisma.discipline.delete({
      where: { id: disciplineId },
    });
  }
}
