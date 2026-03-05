import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { requireAuth } from '@/hooks/auth';
import { SubmissionService } from '@/services/submission.service';

const submissionsRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  const submissionService = new SubmissionService(app.prisma, app.logger);

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
};

export default submissionsRoutes;
