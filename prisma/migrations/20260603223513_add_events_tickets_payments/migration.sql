-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('MUSIC', 'NIGHTLIFE', 'FOOD_DRINK', 'ARTS_CULTURE', 'SPORTS_FITNESS', 'BUSINESS', 'COMMUNITY', 'EDUCATION', 'FASHION', 'HEALTH_WELLNESS', 'TECHNOLOGY', 'TRAVEL_OUTDOOR', 'KIDS_FAMILY', 'CHARITY_CAUSES', 'OTHER');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PURCHASED', 'USED', 'CANCELLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "availableSeats" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "category" "EventCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "saleEndsAt" TIMESTAMP(3),
ADD COLUMN     "saleStartsAt" TIMESTAMP(3),
ADD COLUMN     "ticketPrice" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "commissionRate" DOUBLE PRECISION DEFAULT 5.0,
ADD COLUMN     "stripeAccountId" TEXT;

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'PURCHASED',
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),
    "usedBy" TEXT,
    "paymentRef" TEXT,
    "paymentAmount" DECIMAL(65,30),
    "commissionAmount" DECIMAL(65,30),
    "customerEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_code_key" ON "Ticket"("code");

-- CreateIndex
CREATE INDEX "Ticket_eventId_status_idx" ON "Ticket"("eventId", "status");

-- CreateIndex
CREATE INDEX "Ticket_code_idx" ON "Ticket"("code");

-- CreateIndex
CREATE INDEX "Event_merchantId_isActive_idx" ON "Event"("merchantId", "isActive");

-- CreateIndex
CREATE INDEX "Event_startsAt_idx" ON "Event"("startsAt");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
