import type {
  Class,
  CreateClass,
  UpdateClass,
} from '@repo/packages-types/class';
import type {
  PaginatedResponse,
  QueryOptions,
} from '@repo/packages-types/pagination';
import { ForbiddenError, NotFoundError } from '@repo/packages-utils/errors';

import type { LoggerService } from '@/common/logger.service';
import type { PrismaClient } from '@/generated/client/client.js';

export class ClassService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('ClassService');
  }

  async getClassesByCourse(
    courseId: string,
    query: QueryOptions
  ): Promise<PaginatedResponse<Class>> {
    const where = { courseId };

    const [classes, total] = await Promise.all([
      this.prisma.class.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.class.count({ where }),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: classes as Class[],
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async getClassById(id: string): Promise<Class> {
    const classData = await this.prisma.class.findUnique({
      where: { id },
    });

    if (!classData) {
      this.logger.warn('Class not found', { classId: id });
      throw new NotFoundError('Class not found', { classId: id });
    }

    return classData as Class;
  }

  async createClass(
    courseId: string,
    instructorId: string,
    createClass: CreateClass
  ): Promise<Class> {
    this.logger.info('Creating class', {
      courseId,
      instructorId,
      code: createClass.code,
    });

    const newClass = await this.prisma.class.create({
      data: {
        ...createClass,
        courseId,
        instructorId,
      },
    });

    this.logger.info('Class created successfully', { classId: newClass.id });
    return newClass as Class;
  }

  async updateClass(
    actorId: string,
    classId: string,
    updateClass: UpdateClass
  ): Promise<Class> {
    const classData = await this.getClassById(classId);

    if (classData.instructorId !== actorId) {
      this.logger.warn('Unauthorized class update attempt', {
        actorId,
        classId,
      });
      throw new ForbiddenError('You can only update classes you instruct');
    }

    this.logger.info('Updating class', { classId, actorId });

    const updated = await this.prisma.class.update({
      where: { id: classId },
      data: updateClass,
    });

    return updated as Class;
  }

  async deleteClass(actorId: string, classId: string): Promise<void> {
    const classData = await this.getClassById(classId);

    if (classData.instructorId !== actorId) {
      this.logger.warn('Unauthorized class delete attempt', {
        actorId,
        classId,
      });
      throw new ForbiddenError('You can only delete classes you instruct');
    }

    this.logger.info('Deleting class', { classId, actorId });

    await this.prisma.class.delete({
      where: { id: classId },
    });
  }
}
