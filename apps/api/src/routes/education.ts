import {
  ClassSchema,
  CreateClassSchema,
  UpdateClassSchema,
} from '@repo/packages-types/class';
import {
  CourseSchema,
  CreateCourseSchema,
  UpdateCourseSchema,
} from '@repo/packages-types/course';
import {
  CreateDisciplineSchema,
  DisciplineSchema,
  UpdateDisciplineSchema,
} from '@repo/packages-types/discipline';
import {
  EnrollmentSchema,
  UpdateEnrollmentSchema,
} from '@repo/packages-types/enrollment';
import {
  CreateLessonSchema,
  LessonSchema,
  UpdateLessonSchema,
} from '@repo/packages-types/lesson';
import { QueryOptionsSchema } from '@repo/packages-types/pagination';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '@/hooks/auth';
import { ClassService } from '@/services/class.service';
import { CourseService } from '@/services/course.service';
import { DisciplineService } from '@/services/discipline.service';
import { EnrollmentService } from '@/services/enrollment.service';
import { LessonService } from '@/services/lesson.service';
import { SubmissionService } from '@/services/submission.service';

const educationRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  const courseService = new CourseService(app.prisma, app.logger);
  const classService = new ClassService(app.prisma, app.logger);
  const disciplineService = new DisciplineService(app.prisma, app.logger);
  const lessonService = new LessonService(app.prisma, app.logger);
  const enrollmentService = new EnrollmentService(app.prisma, app.logger);
  const submissionService = new SubmissionService(app.prisma, app.logger);

  try {
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

    server.put(
      '/enrollments/:enrollmentId',
      {
        preHandler: [requireAuth],
        schema: {
          params: z.object({ enrollmentId: z.string().cuid() }),
          body: UpdateEnrollmentSchema,
          response: { 200: EnrollmentSchema },
        },
      },
      async (request, reply) => {
        const updated = await enrollmentService.updateEnrollment(
          request.user!.id,
          request.params.enrollmentId,
          request.body as any
        );
        return reply.send(updated);
      }
    );

    server.delete(
      '/enrollments/:enrollmentId',
      {
        preHandler: [requireAuth],
        schema: {
          params: z.object({ enrollmentId: z.string().cuid() }),
        },
      },
      async (request, reply) => {
        await enrollmentService.unenrollStudent(
          request.user!.id,
          request.params.enrollmentId
        );
        return reply.send({ success: true });
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

    server.put(
      '/submissions/:submissionId/grade',
      {
        preHandler: [requireAuth],
        schema: {
          params: z.object({ submissionId: z.string().cuid() }),
          body: z.object({
            grade: z.number().nonnegative().optional(),
            feedback: z.string().optional(),
          }),
          response: { 200: z.unknown() },
        },
      },
      async (request, reply) => {
        const graded = await submissionService.gradeSubmission(
          request.user!.id,
          request.params.submissionId,
          request.body as any
        );
        return reply.send(graded);
      }
    );
  } catch (error) {
    app.logger.error('Error registering education routes', error as Error);
    throw error;
  }
};

export default educationRoutes;
