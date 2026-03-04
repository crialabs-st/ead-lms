import type {
  Enrollment,
  UpdateEnrollment,
} from '@repo/packages-types/enrollment';
import type {
  PaginatedResponse,
  QueryOptions,
} from '@repo/packages-types/pagination';
import { ForbiddenError, NotFoundError } from '@repo/packages-utils/errors';

import type { LoggerService } from '@/common/logger.service';
import type { PrismaClient } from '@/generated/client/client.js';

export class EnrollmentService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('EnrollmentService');
  }

  async getEnrollmentsByClass(
    classId: string,
    query: QueryOptions
  ): Promise<PaginatedResponse<Enrollment>> {
    const where = { classId };

    const [enrollments, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.enrollment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: enrollments as Enrollment[],
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
      },
    };
  }

  async getEnrollmentById(id: string): Promise<Enrollment> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment) {
      this.logger.warn('Enrollment not found', { enrollmentId: id });
      throw new NotFoundError('Enrollment not found', { enrollmentId: id });
    }

    return enrollment as Enrollment;
  }

  async enrollStudent(classId: string, userId: string): Promise<Enrollment> {
    this.logger.info('Enrolling student', { classId, userId });

    const existing = await this.prisma.enrollment.findUnique({
      where: { classId_userId: { classId, userId } },
    });

    if (existing) {
      this.logger.warn('Student already enrolled', { classId, userId });
      throw new Error('Student already enrolled in this class');
    }

    const enrollment = await this.prisma.enrollment.create({
      data: {
        classId,
        userId,
      },
    });

    this.logger.info('Student enrolled successfully', {
      enrollmentId: enrollment.id,
    });
    return enrollment as Enrollment;
  }

  async updateEnrollment(
    actorId: string,
    enrollmentId: string,
    updateEnrollment: UpdateEnrollment
  ): Promise<Enrollment> {
    const enrollment = await this.getEnrollmentById(enrollmentId);

    const classData = await this.prisma.class.findUnique({
      where: { id: enrollment.classId },
    });

    if (!classData || classData.instructorId !== actorId) {
      this.logger.warn('Unauthorized enrollment update attempt', {
        actorId,
        enrollmentId,
      });
      throw new ForbiddenError(
        'You can only update enrollments in classes you instruct'
      );
    }

    this.logger.info('Updating enrollment', { enrollmentId, actorId });

    const updated = await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: updateEnrollment,
    });

    return updated as Enrollment;
  }

  async unenrollStudent(
    instructorId: string,
    enrollmentId: string
  ): Promise<void> {
    const enrollment = await this.getEnrollmentById(enrollmentId);

    const classData = await this.prisma.class.findUnique({
      where: { id: enrollment.classId },
    });

    if (!classData || classData.instructorId !== instructorId) {
      this.logger.warn('Unauthorized unenroll attempt', {
        instructorId,
        enrollmentId,
      });
      throw new ForbiddenError(
        'You can only unenroll students from classes you instruct'
      );
    }

    this.logger.info('Unenrolling student', { enrollmentId, instructorId });

    await this.prisma.enrollment.delete({
      where: { id: enrollmentId },
    });
  }
}
