import {
  ClassSchema,
  CreateClassSchema,
} from '@repo/packages-types/class';
import {
  CourseSchema,
  CreateCourseSchema,
  UpdateCourseSchema,
} from '@repo/packages-types/course';
import { QueryOptionsSchema } from '@repo/packages-types/pagination';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '@/hooks/auth';
import { ClassService } from '@/services/class.service';
import { CourseService } from '@/services/course.service';

const coursesRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  const courseService = new CourseService(app.prisma, app.logger);
  const classService = new ClassService(app.prisma, app.logger);

  server.get(
    '/courses',
    {
      schema: {
        querystring: QueryOptionsSchema,
        response: {
          200: z.object({
            data: z.array(CourseSchema),
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
      const courses = await courseService.getCourses(request.query as any);
      return reply.send(courses);
    }
  );

  server.post(
    '/courses',
    {
      preHandler: [requireAuth],
      schema: {
        body: CreateCourseSchema,
        response: { 201: CourseSchema },
      },
    },
    async (request, reply) => {
      const course = await courseService.createCourse(
        request.user!.id,
        request.body as any
      );
      return reply.status(201).send(course);
    }
  );

  server.get(
    '/courses/:courseId',
    {
      schema: {
        params: z.object({ courseId: z.string().cuid() }),
        response: { 200: CourseSchema },
      },
    },
    async (request, reply) => {
      const course = await courseService.getCourseById(
        request.params.courseId
      );
      return reply.send(course);
    }
  );

  server.put(
    '/courses/:courseId',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ courseId: z.string().cuid() }),
        body: UpdateCourseSchema,
        response: { 200: CourseSchema },
      },
    },
    async (request, reply) => {
      const course = await courseService.updateCourse(
        request.user!.id,
        request.params.courseId,
        request.body as any
      );
      return reply.send(course);
    }
  );

  server.delete(
    '/courses/:courseId',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ courseId: z.string().cuid() }),
      },
    },
    async (request, reply) => {
      await courseService.deleteCourse(
        request.user!.id,
        request.params.courseId
      );
      return reply.send({ success: true });
    }
  );

  server.get(
    '/courses/:courseId/classes',
    {
      schema: {
        params: z.object({ courseId: z.string().cuid() }),
        querystring: QueryOptionsSchema,
        response: {
          200: z.object({
            data: z.array(ClassSchema),
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
      const classes = await classService.getClassesByCourse(
        request.params.courseId,
        request.query as any
      );
      return reply.send(classes);
    }
  );

  server.post(
    '/courses/:courseId/classes',
    {
      preHandler: [requireAuth],
      schema: {
        params: z.object({ courseId: z.string().cuid() }),
        body: CreateClassSchema,
        response: { 201: ClassSchema },
      },
    },
    async (request, reply) => {
      const newClass = await classService.createClass(
        request.params.courseId,
        request.user!.id,
        request.body as any
      );
      return reply.status(201).send(newClass);
    }
  );
};

export default coursesRoutes;
