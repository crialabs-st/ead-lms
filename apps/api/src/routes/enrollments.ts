import {
  EnrollmentSchema,
  UpdateEnrollmentSchema,
} from '@repo/packages-types/enrollment';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '@/hooks/auth';
import { EnrollmentService } from '@/services/enrollment.service';

const enrollmentsRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  const enrollmentService = new EnrollmentService(app.prisma, app.logger);

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
};

export default enrollmentsRoutes;
