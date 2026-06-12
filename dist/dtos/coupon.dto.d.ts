export interface ClaimCouponDto {
    customerId: string;
    promotionId: string;
}
export interface RedeemCouponDto {
    code: string;
    merchantId: string;
}
