import { Request } from 'express';
import { BillingService } from './billing.service';
import { CreateCheckoutDto } from './dto/billing.dto';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    getPlans(): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        name: string;
        description: string | null;
        interval: string;
        intervalCount: number;
        price: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        stripePriceId: string | null;
        isActive: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {})[]>;
    getMySubscription(req: any): Promise<({
        plan: import("@prisma/client/runtime/library").GetResult<{
            id: string;
            name: string;
            description: string | null;
            interval: string;
            intervalCount: number;
            price: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            stripePriceId: string | null;
            isActive: boolean;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
        }, unknown> & {};
    } & import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        planId: string;
        status: import("@prisma/client").SubscriptionStatus;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        trialEndsAt: Date | null;
        cancelledAt: Date | null;
        stripeSubscriptionId: string | null;
        stripeCustomerId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}) | null>;
    createCheckout(req: any, dto: CreateCheckoutDto): Promise<{
        url: string | null;
    }>;
    webhook(req: Request, signature: string): Promise<{
        received: boolean;
    }>;
    cancel(req: any): Promise<import("@prisma/client/runtime/library").GetResult<{
        id: string;
        merchantId: string;
        planId: string;
        status: import("@prisma/client").SubscriptionStatus;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        trialEndsAt: Date | null;
        cancelledAt: Date | null;
        stripeSubscriptionId: string | null;
        stripeCustomerId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, unknown> & {}>;
    getInvoices(req: any): Promise<(import("@prisma/client/runtime/library").GetResult<{
        id: string;
        subscriptionId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        status: import("@prisma/client").PaymentStatus;
        stripePaymentIntentId: string | null;
        stripeInvoiceId: string | null;
        invoiceUrl: string | null;
        periodStart: Date;
        periodEnd: Date;
        paidAt: Date | null;
        createdAt: Date;
    }, unknown> & {})[]>;
    getPortal(req: any): Promise<{
        url: string;
    }>;
}
