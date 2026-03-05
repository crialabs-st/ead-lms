import { MercadoPagoConfig, Payment,Preference } from 'mercadopago';
import Stripe from 'stripe';

import type { LoggerService } from '@/common/logger.service';
import type { Env } from '@/config/env';

export class PaymentService {
  private stripe: Stripe;
  private mpClient: MercadoPagoConfig;

  constructor(
    private readonly env: Env,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('PaymentService');

    if (!this.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }

    if (!this.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
    }

    if (!this.env.MERCADO_PAGO_ACCESS_TOKEN) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN environment variable is required');
    }

    // 1. Inicializar o SDK do Stripe
    this.stripe = new Stripe(this.env.STRIPE_SECRET_KEY);

    // 2. Inicializar o SDK do Mercado Pago
    this.mpClient = new MercadoPagoConfig({
      accessToken: this.env.MERCADO_PAGO_ACCESS_TOKEN
    });
  }

  // ==========================================
  // MÉTODOS DE CRIAÇÃO (CHECKOUT)
  // ==========================================

  async createStripeSession(amount: number, metadata?: Record<string, string>) {
    this.logger.info('A criar sessão de checkout no Stripe', { amount });

    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: 'Inscrição no Curso' },
          unit_amount: Math.round(amount * 100), // Stripe exige o valor em cêntimos/centavos
        },
        quantity: 1,
      }],
      mode: 'payment',
      // Enviar metadados ajuda a identificar o pagamento no webhook depois
      metadata: metadata || {},
      success_url: `${this.env.FRONTEND_URL}/success`,
      cancel_url: `${this.env.FRONTEND_URL}/cancel`,
    });
  }

  async createMercadoPagoPreference(title: string, price: number, externalReference?: string) {
    this.logger.info('A criar preferência no Mercado Pago', { title, price });

    const preference = new Preference(this.mpClient);

    return preference.create({
      body: {
        items: [{
          id: 'curso-padrao',
          title,
          quantity: 1,
          unit_price: price,
          currency_id: 'BRL'
        }],
        // O external_reference é útil para reconciliação no webhook
        external_reference: externalReference,
        back_urls: {
          success: `${this.env.FRONTEND_URL}/success`,
          failure: `${this.env.FRONTEND_URL}/failure`,
          pending: `${this.env.FRONTEND_URL}/pending`
        },
        auto_return: 'approved',
      }
    });
  }

  // ==========================================
  // MÉTODOS PARA WEBHOOKS
  // ==========================================

  /**
   * Valida a assinatura do Stripe e retorna o evento formatado.
   * Lança um erro se a assinatura for inválida ou o rawBody estiver corrompido.
   */
  async constructStripeEvent(payload: string | Buffer, signature: string) {
    this.logger.info('A validar evento do webhook do Stripe');

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.env.STRIPE_WEBHOOK_SECRET!
    );
  }

  /**
   * Procura os detalhes completos de um pagamento no Mercado Pago.
   * O webhook do MP envia apenas o ID, precisamos procurar os detalhes (status, valor, etc).
   */
  async getMercadoPagoPayment(paymentId: string | number) {
    this.logger.info('A procurar detalhes do pagamento no Mercado Pago', { paymentId });

    const payment = new Payment(this.mpClient);
    return payment.get({ id: paymentId });
  }
}