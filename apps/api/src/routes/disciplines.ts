import {
  DisciplineSchema,
  UpdateDisciplineSchema,
} from '@repo/packages-types/discipline';
import {
  CreateLessonSchema,
  LessonSchema,
} from '@repo/packages-types/lesson';
import { QueryOptionsSchema } from '@repo/packages-types/pagination';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '@/hooks/auth';
import { DisciplineService } from '@/services/discipline.service';
import { LessonService } from '@/services/lesson.service';

const disciplinesRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  const disciplineService = new DisciplineService(app.prisma, app.logger);
  const lessonService = new LessonService(app.prisma, app.logger);

  server.get(
    '/disciplines/:disciplineId',
    {
      schema: {
        params: z.object({ disciplineId: z.string().cuid() }),
        response: { 200: DisciplineSchema },
      },
    },
    async (request, reply) => {
      const discipline = await disciplineService.getDisciplineById(
        request.params.disciplineId
      );
      return reply.send(discipline);
    }
  );

  server.put(
    '/disciplines/:disciplineId',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ disciplineId: z.string().cuid() }),
        body: UpdateDisciplineSchema,
        response: { 200: DisciplineSchema },
      },
    },
    async (request, reply) => {
      const updated = await disciplineService.updateDiscipline(
        request.user!.id,
        request.params.disciplineId,
        request.body as any
      );
      return reply.send(updated);
    }
  );

  server.delete(
    '/disciplines/:disciplineId',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ disciplineId: z.string().cuid() }),
      },
    },
    async (request, reply) => {
      await disciplineService.deleteDiscipline(
        request.user!.id,
        request.params.disciplineId
      );
      return reply.send({ success: true });
    }
  );

  server.get(
    '/disciplines/:disciplineId/lessons',
    {
      schema: {
        params: z.object({ disciplineId: z.string().cuid() }),
        querystring: QueryOptionsSchema,
        response: {
          200: z.object({
            data: z.array(LessonSchema),
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
      const lessons = await lessonService.getLessonsByDiscipline(
        request.params.disciplineId,
        request.query as any
      );
      return reply.send(lessons);
    }
  );

  server.post(
    '/disciplines/:disciplineId/lessons',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ disciplineId: z.string().cuid() }),
        body: CreateLessonSchema,
        response: { 201: LessonSchema },
      },
    },
    async (request, reply) => {
      const lesson = await lessonService.createLesson(
        request.params.disciplineId,
        request.body as any
      );
      return reply.status(201).send(lesson);
    }
  );
};

export default disciplinesRoutes;
