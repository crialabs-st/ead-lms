import {
  ClassSchema,
  UpdateClassSchema,
} from '@repo/packages-types/class';
import {
  CreateDisciplineSchema,
  DisciplineSchema,
} from '@repo/packages-types/discipline';
import {
  EnrollmentSchema,
} from '@repo/packages-types/enrollment';
import { QueryOptionsSchema } from '@repo/packages-types/pagination';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '@/hooks/auth';
import { ClassService } from '@/services/class.service';
import { DisciplineService } from '@/services/discipline.service';
import { EnrollmentService } from '@/services/enrollment.service';

const classesRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  const classService = new ClassService(app.prisma, app.logger);
  const disciplineService = new DisciplineService(app.prisma, app.logger);
  const enrollmentService = new EnrollmentService(app.prisma, app.logger);

  server.get(
    '/classes/:classId',
    {
      schema: {
        params: z.object({ classId: z.string().cuid() }),
        response: { 200: ClassSchema },
      },
    },
    async (request, reply) => {
      const classData = await classService.getClassById(
        request.params.classId
      );
      return reply.send(classData);
    }
  );

  server.put(
    '/classes/:classId',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ classId: z.string().cuid() }),
        body: UpdateClassSchema,
        response: { 200: ClassSchema },
      },
    },
    async (request, reply) => {
      const updated = await classService.updateClass(
        request.user!.id,
        request.params.classId,
        request.body as any
      );
      return reply.send(updated);
    }
  );

  server.delete(
    '/classes/:classId',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ classId: z.string().cuid() }),
      },
    },
    async (request, reply) => {
      await classService.deleteClass(
        request.user!.id,
        request.params.classId
      );
      return reply.send({ success: true });
    }
  );

  server.get(
    '/classes/:classId/disciplines',
    {
      schema: {
        params: z.object({ classId: z.string().cuid() }),
        querystring: QueryOptionsSchema,
        response: {
          200: z.object({
            data: z.array(DisciplineSchema),
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
      const disciplines = await disciplineService.getDisciplinesByClass(
        request.params.classId,
        request.query as any
      );
      return reply.send(disciplines);
    }
  );

  server.post(
    '/classes/:classId/disciplines',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ classId: z.string().cuid() }),
        body: CreateDisciplineSchema,
        response: { 201: DisciplineSchema },
      },
    },
    async (request, reply) => {
      const discipline = await disciplineService.createDiscipline(
        request.params.classId,
        request.user!.id,
        request.body as any
      );
      return reply.status(201).send(discipline);
    }
  );

  server.get(
    '/classes/:classId/enrollments',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ classId: z.string().cuid() }),
        querystring: QueryOptionsSchema,
        response: {
          200: z.object({
            data: z.array(EnrollmentSchema),
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
      const enrollments = await enrollmentService.getEnrollmentsByClass(
        request.params.classId,
        request.query as any
      );
      return reply.send(enrollments);
    }
  );

  server.post(
    '/classes/:classId/enroll',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ classId: z.string().cuid() }),
        response: { 201: EnrollmentSchema },
      },
    },
    async (request, reply) => {
      const enrollment = await enrollmentService.enrollStudent(
        request.params.classId,
        request.user!.id
      );
      return reply.status(201).send(enrollment);
    }
  );
};

export default classesRoutes;
