import type {
  CreateLesson,
  Lesson,
  UpdateLesson,
} from '@repo/packages-types/lesson';
import type {
  PaginatedResponse,
  QueryOptions,
} from '@repo/packages-types/pagination';
import { ForbiddenError, NotFoundError } from '@repo/packages-utils/errors';

import type { LoggerService } from '@/common/logger.service';
import type { PrismaClient } from '@/generated/client/client.js';

export class LessonService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('LessonService');
  }

  async getLessonsByDiscipline(
    disciplineId: string,
    query: QueryOptions
  ): Promise<PaginatedResponse<Lesson>> {
    const where = { disciplineId };

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.lesson.count({ where }),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: lessons as Lesson[],
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async getLessonById(id: string): Promise<Lesson> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      this.logger.warn('Lesson not found', { lessonId: id });
      throw new NotFoundError('Lesson not found', { lessonId: id });
    }

    return lesson as Lesson;
  }

  async createLesson(
    disciplineId: string,
    createLesson: CreateLesson
  ): Promise<Lesson> {
    this.logger.info('Creating lesson', {
      disciplineId,
      type: createLesson.type,
      title: createLesson.title,
    });

    const data: any = {
      disciplineId,
      type: createLesson.type,
      title: createLesson.title,
    };

    if (createLesson.description !== undefined)
      data.description = createLesson.description;
    if (createLesson.content !== undefined) data.content = createLesson.content;
    if (createLesson.order !== undefined) data.order = createLesson.order;
    if (createLesson.publishedAt !== undefined)
      data.publishedAt = createLesson.publishedAt;
    if (createLesson.dueDate !== undefined) data.dueDate = createLesson.dueDate;
    if (createLesson.points !== undefined) data.points = createLesson.points;

    const lesson = await this.prisma.lesson.create({
      data,
    });

    this.logger.info('Lesson created successfully', { lessonId: lesson.id });
    return lesson as Lesson;
  }

  async updateLesson(
    actorId: string,
    lessonId: string,
    updateLesson: UpdateLesson
  ): Promise<Lesson> {
    const lesson = await this.getLessonById(lessonId);

    const discipline = await this.prisma.discipline.findUnique({
      where: { id: lesson.disciplineId },
    });

    if (!discipline || discipline.instructorId !== actorId) {
      this.logger.warn('Unauthorized lesson update attempt', {
        actorId,
        lessonId,
      });
      throw new ForbiddenError(
        'You can only update lessons in disciplines you teach'
      );
    }

    this.logger.info('Updating lesson', { lessonId, actorId });

    const updateData: any = {};

    if (updateLesson.type !== undefined) updateData.type = updateLesson.type;
    if (updateLesson.title !== undefined) updateData.title = updateLesson.title;
    if (updateLesson.description !== undefined)
      updateData.description = updateLesson.description;
    if (updateLesson.content !== undefined)
      updateData.content = updateLesson.content;
    if (updateLesson.order !== undefined) updateData.order = updateLesson.order;
    if (updateLesson.publishedAt !== undefined)
      updateData.publishedAt = updateLesson.publishedAt;
    if (updateLesson.dueDate !== undefined)
      updateData.dueDate = updateLesson.dueDate;
    if (updateLesson.points !== undefined)
      updateData.points = updateLesson.points;

    const updated = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
    });

    return updated as Lesson;
  }

  async deleteLesson(actorId: string, lessonId: string): Promise<void> {
    const lesson = await this.getLessonById(lessonId);

    const discipline = await this.prisma.discipline.findUnique({
      where: { id: lesson.disciplineId },
    });

    if (!discipline || discipline.instructorId !== actorId) {
      this.logger.warn('Unauthorized lesson delete attempt', {
        actorId,
        lessonId,
      });
      throw new ForbiddenError(
        'You can only delete lessons in disciplines you teach'
      );
    }

    this.logger.info('Deleting lesson', { lessonId, actorId });

    await this.prisma.lesson.delete({
      where: { id: lessonId },
    });
  }

  async publishLesson(actorId: string, lessonId: string): Promise<Lesson> {
    const lesson = await this.getLessonById(lessonId);

    const discipline = await this.prisma.discipline.findUnique({
      where: { id: lesson.disciplineId },
    });

    if (!discipline || discipline.instructorId !== actorId) {
      throw new ForbiddenError(
        'You can only publish lessons in disciplines you teach'
      );
    }

    this.logger.info('Publishing lesson', { lessonId, actorId });

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: { publishedAt: new Date() },
    }) as Promise<Lesson>;
  }
}
