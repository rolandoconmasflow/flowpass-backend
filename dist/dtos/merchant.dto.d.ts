import { MerchantCategory } from '@prisma/client';
export declare class CreateMerchantDto {
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
}
export declare class RegisterMerchantDto {
    businessName: string;
    category: MerchantCategory;
    businessDescription?: string;
    ownerEmail: string;
    ownerPassword: string;
    ownerName?: string;
    address: string;
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
}
export declare class UpdateMerchantDto {
    name?: string;
    slug?: string;
    description?: string;
    logoUrl?: string;
}
