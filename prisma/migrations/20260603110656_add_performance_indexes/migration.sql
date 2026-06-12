-- CreateIndex
CREATE INDEX "Coupon_customerId_status_idx" ON "Coupon"("customerId", "status");

-- CreateIndex
CREATE INDEX "Coupon_status_idx" ON "Coupon"("status");

-- CreateIndex
CREATE INDEX "Membership_merchantId_points_idx" ON "Membership"("merchantId", "points");

-- CreateIndex
CREATE INDEX "Membership_merchantId_status_idx" ON "Membership"("merchantId", "status");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Visit_merchantId_createdAt_idx" ON "Visit"("merchantId", "createdAt");

-- CreateIndex
CREATE INDEX "Visit_customerId_createdAt_idx" ON "Visit"("customerId", "createdAt");
