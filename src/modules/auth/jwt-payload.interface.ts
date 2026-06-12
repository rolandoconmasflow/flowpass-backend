export interface JwtPayload {
  email: string | null;
  sub: string;
  role: string;
  activeMerchantId?: string | null;
}
