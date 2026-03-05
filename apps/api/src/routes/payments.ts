import { AppError } from '@repo/packages-utils/errors';
import type { FastifyInstance } from 'fastify';
import type Stripe from 'stripe';

export default async function paymentRoutes(app: FastifyInstance) {

  // Endpoint unificado para webhooks com parâmetro dinâmico :id
  app.post('/payments/webhooks/:id', {
    // A configuração rawBody é frequentemente necessária para validar
    // assinaturas de webhooks (como as do Stripe)
    config: { rawBody: true },
    handler: async (request, reply) => {
      // Capturamos o parâmetro ID da URL
      const { id } = request.params as { id: string };

      app.log.info({ webhookId: id }, 'Notificação de webhook recebida');

      try {
        // CENÁRIO 1: Se o ID for o nome do provedor ('stripe')
        if (id === 'stripe') {
          const sig = request.headers['stripe-signature'] as string;

          // Nota: O request.rawBody ou request.body (se em string) deve ser passado
          // dependendo do plugin de raw-body que estiver a utilizar no Fastify
          const rawBody = (request as any).rawBody || request.body;

          const event = await app.paymentService.constructStripeEvent(
            rawBody,
            sig
          );

          if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            app.log.info({ sessionId: session.id }, 'Pagamento Stripe concluído');
            // Lógica para atualizar a base de dados (ex: app.prisma.enrollment.update)
          }

          return reply.status(200).send({ received: true });
        }

        // CENÁRIO 2: Se o ID for o nome do provedor ('mercadopago')
        if (id === 'mercadopago') {
          const { body } = request as any;

          if (body.type === 'payment') {
            const paymentId = body.data.id;
            const payment = await app.paymentService.getMercadoPagoPayment(paymentId);

            if (payment.status === 'approved') {
              app.log.info({ paymentId }, 'Pagamento Mercado Pago aprovado');
              // Lógica para atualizar a base de dados
            }
          }

          return reply.status(200).send({ received: true });
        }

        // CENÁRIO 3: Se o ID for um ID da sua base de dados (ex: Enrollment ID)
        // Neste caso, você precisaria identificar o provedor através dos headers ou do corpo da requisição
        const isStripe = !!request.headers['stripe-signature'];

        if (isStripe) {
          // Lógica do Stripe associada ao ID da matrícula
          app.log.info({ enrollmentId: id }, 'Processando webhook Stripe para matrícula específica');
          return reply.status(200).send({ received: true });
        }

        // Se o ID não corresponder a nada esperado
        throw new AppError(
          'Provedor de webhook não reconhecido ou ID inválido',
          400,
          'WEBHOOK_INVALID_PROVIDER'
        );

      } catch (err) {
        app.log.error({ err, webhookId: id }, 'Erro ao processar webhook');
        throw new AppError('Erro na validação do webhook', 400, 'WEBHOOK_VALIDATION_ERROR');
      }
    }
  });
}