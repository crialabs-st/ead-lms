import type {
  Course,
  CreateCourse,
  UpdateCourse,
} from '@repo/packages-types/course';
import type {
  PaginatedResponse,
  QueryOptions,
} from '@repo/packages-types/pagination';
import { ForbiddenError, NotFoundError } from '@repo/packages-utils/errors';

import type { LoggerService } from '@/common/logger.service';
import type { PrismaClient } from '@/generated/client/client.js';

export class CourseService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('CourseService');
  }

  async getCourses(query: QueryOptions): Promise<PaginatedResponse<Course>> {
    const where = query.search
      ? {
          OR: [
            { code: { contains: query.search, mode: 'insensitive' as const } },
            { name: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.course.count({ where }),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: courses as Course[],
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async getCourseById(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      this.logger.warn('Course not found', { courseId: id });
      throw new NotFoundError('Course not found', { courseId: id });
    }

    return course as Course;
  }

  async createCourse(
    adminId: string,
    createCourse: CreateCourse
  ): Promise<Course> {
    this.logger.info('Creating course', { code: createCourse.code, adminId });

    const course = await this.prisma.course.create({
      data: {
        ...createCourse,
        adminId,
      },
    });

    this.logger.info('Course created successfully', { courseId: course.id });
    return course as Course;
  }

  async updateCourse(
    actorId: string,
    courseId: string,
    updateCourse: UpdateCourse
  ): Promise<Course> {
    const course = await this.getCourseById(courseId);

    if (course.adminId !== actorId) {
      this.logger.warn('Unauthorized course update attempt', {
        actorId,
        courseId,
      });
      throw new ForbiddenError('You can only update courses you administer');
    }

    this.logger.info('Updating course', { courseId, actorId });

    const updated = await this.prisma.course.update({
      where: { id: courseId },
      data: updateCourse,
    });

    return updated as Course;
  }

  async deleteCourse(actorId: string, courseId: string): Promise<void> {
    const course = await this.getCourseById(courseId);

    if (course.adminId !== actorId) {
      this.logger.warn('Unauthorized course delete attempt', {
        actorId,
        courseId,
      });
      throw new ForbiddenError('You can only delete courses you administer');
    }

    this.logger.info('Deleting course', { courseId, actorId });

    await this.prisma.course.delete({
      where: { id: courseId },
    });
  }
}
