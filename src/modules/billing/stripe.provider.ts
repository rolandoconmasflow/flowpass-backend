import { Provider, Logger } from '@nestjs/common';
import Stripe from 'stripe';

export const STRIPE_CLIENT = 'STRIPE_CLIENT';

export type StripeClient = InstanceType<typeof Stripe>;

export const StripeProvider: Provider = {
  provide: STRIPE_CLIENT,
  useFactory: (): StripeClient | null => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      new Logger('StripeProvider').warn(
        'STRIPE_SECRET_KEY no configurado: las operaciones de pago estarán deshabilitadas.',
      );
      return null;
    }
    return new Stripe(key);
  },
};
