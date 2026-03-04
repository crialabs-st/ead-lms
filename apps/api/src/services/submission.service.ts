import type {
  CreateLessonSubmission,
  LessonSubmission,
  UpdateLessonSubmission,
} from '@repo/packages-types/quiz';
import { ForbiddenError, NotFoundError } from '@repo/packages-utils/errors';

import type { LoggerService } from '@/common/logger.service';
import type { PrismaClient } from '@/generated/client/client.js';

export class SubmissionService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('SubmissionService');
  }

  async getSubmissionById(id: string): Promise<LessonSubmission> {
    const submission = await this.prisma.lessonSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      this.logger.warn('Submission not found', { submissionId: id });
      throw new NotFoundError('Submission not found', { submissionId: id });
    }

    return submission as LessonSubmission;
  }

  async getSubmissionsByLesson(lessonId: string): Promise<LessonSubmission[]> {
    const submissions = await this.prisma.lessonSubmission.findMany({
      where: { lessonId },
      orderBy: { submittedAt: 'desc' },
    });

    return submissions as LessonSubmission[];
  }

  async submitActivity(
    userId: string,
    lessonId: string,
    createSubmission: CreateLessonSubmission
  ): Promise<LessonSubmission> {
    this.logger.info('Submitting activity', { userId, lessonId });

    const existing = await this.prisma.lessonSubmission.findUnique({
      where: { lessonId_userId: { lessonId, userId } },
    });

    if (existing) {
      this.logger.info('Replacing existing submission', { userId, lessonId });
      return this.prisma.lessonSubmission.update({
        where: { lessonId_userId: { lessonId, userId } },
        data: {
          content: createSubmission.content,
          submittedAt: new Date(),
        },
      }) as Promise<LessonSubmission>;
    }

    const submission = await this.prisma.lessonSubmission.create({
      data: {
        lessonId,
        userId,
        content: createSubmission.content,
      },
    });

    this.logger.info('Activity submitted successfully', {
      submissionId: submission.id,
    });
    return submission as LessonSubmission;
  }

  async gradeSubmission(
    instructorId: string,
    submissionId: string,
    updateSubmission: UpdateLessonSubmission
  ): Promise<LessonSubmission> {
    const submission = await this.getSubmissionById(submissionId);

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: submission.lessonId },
    });

    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    const discipline = await this.prisma.discipline.findUnique({
      where: { id: lesson.disciplineId },
    });

    if (!discipline || discipline.instructorId !== instructorId) {
      this.logger.warn('Unauthorized grading attempt', {
        instructorId,
        submissionId,
      });
      throw new ForbiddenError(
        'You can only grade submissions in disciplines you teach'
      );
    }

    this.logger.info('Grading submission', { submissionId, instructorId });

    const updated = await this.prisma.lessonSubmission.update({
      where: { id: submissionId },
      data: updateSubmission,
    });

    return updated as LessonSubmission;
  }
}
