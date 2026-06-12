import { PrismaService } from '../database/prisma.service';
import { StripeClient } from './stripe.provider';
export declare class BillingService {
    private readonly prisma;
    private readonly stripe;
    private readonly logger;
    constructor(prisma: PrismaService, stripe: StripeClient | null);
    private get webUrl();
    private requireStripe;
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
    getMySubscription(userId: string): Promise<({
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
    createCheckoutSession(userId: string, planId: string): Promise<{
        url: string | null;
    }>;
    handleWebhook(signature: string, rawBody: Buffer): Promise<{
        received: boolean;
    }>;
    cancelSubscription(userId: string): Promise<import("@prisma/client/runtime/library").GetResult<{
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
    getInvoices(userId: string): Promise<(import("@prisma/client/runtime/library").GetResult<{
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
    getPortalUrl(userId: string): Promise<{
        url: string;
    }>;
    private onCheckoutCompleted;
    private onInvoicePaid;
    private onInvoiceFailed;
    private onSubscriptionDeleted;
    private findMerchantByOwner;
    private computePeriodEnd;
}
