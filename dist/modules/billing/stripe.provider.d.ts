import { Provider } from '@nestjs/common';
import Stripe from 'stripe';
export declare const STRIPE_CLIENT = "STRIPE_CLIENT";
export type StripeClient = InstanceType<typeof Stripe>;
export declare const StripeProvider: Provider;
