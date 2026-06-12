import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { SubscriptionGuard } from './subscription.guard';
import { StripeProvider } from './stripe.provider';

@Module({
  controllers: [BillingController],
  providers: [BillingService, SubscriptionGuard, StripeProvider],
  exports: [BillingService, SubscriptionGuard],
})
export class BillingModule {}
