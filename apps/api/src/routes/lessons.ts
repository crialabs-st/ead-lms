import {
  LessonSchema,
  UpdateLessonSchema,
} from '@repo/packages-types/lesson';
import { QueryOptionsSchema } from '@repo/packages-types/pagination';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '@/hooks/auth';
import { LessonService } from '@/services/lesson.service';
import { SubmissionService } from '@/services/submission.service';

const lessonsRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  const lessonService = new LessonService(app.prisma, app.logger);
  const submissionService = new SubmissionService(app.prisma, app.logger);

  server.get(
    '/lessons/:lessonId',
    {
      schema: {
        params: z.object({ lessonId: z.string().cuid() }),
        response: { 200: LessonSchema },
      },
    },
    async (request, reply) => {
      const lesson = await lessonService.getLessonById(
        request.params.lessonId
      );
      return reply.send(lesson);
    }
  );

  server.put(
    '/lessons/:lessonId',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ lessonId: z.string().cuid() }),
        body: UpdateLessonSchema,
        response: { 200: LessonSchema },
      },
    },
    async (request, reply) => {
      const updated = await lessonService.updateLesson(
        request.user!.id,
        request.params.lessonId,
        request.body as any
      );
      return reply.send(updated);
    }
  );

  server.delete(
    '/lessons/:lessonId',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ lessonId: z.string().cuid() }),
      },
    },
    async (request, reply) => {
      await lessonService.deleteLesson(
        request.user!.id,
        request.params.lessonId
      );
      return reply.send({ success: true });
    }
  );

  server.post(
    '/lessons/:lessonId/publish',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ lessonId: z.string().cuid() }),
        response: { 200: LessonSchema },
      },
    },
    async (request, reply) => {
      const published = await lessonService.publishLesson(
        request.user!.id,
        request.params.lessonId
      );
      return reply.send(published);
    }
  );

  server.get(
    '/lessons/:lessonId/submissions',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ lessonId: z.string().cuid() }),
        querystring: QueryOptionsSchema,
        response: {
          200: z.object({
            data: z.array(z.unknown()),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const submissions = await submissionService.getSubmissionsByLesson(
        request.params.lessonId
      );
      const { page = 1, limit = 10 } = request.query as any;
      const pageNum = Math.max(1, Number(page));
      const pageSize = Math.min(100, Math.max(1, Number(limit)));
      const total = submissions.length;
      const startIndex = (pageNum - 1) * pageSize;
      const paginatedSubmissions = submissions.slice(
        startIndex,
        startIndex + pageSize
      );
      return reply.send({
        data: paginatedSubmissions,
        pagination: {
          page: pageNum,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    }
  );

  server.post(
    '/lessons/:lessonId/submit',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ lessonId: z.string().cuid() }),
        body: z.object({ content: z.string() }),
        response: { 201: z.unknown() },
      },
    },
    async (request, reply) => {
      const submission = await submissionService.submitActivity(
        request.user!.id,
        request.params.lessonId,
        request.body as any
      );
      return reply.status(201).send(submission);
    }
  );
};

export default lessonsRoutes;
