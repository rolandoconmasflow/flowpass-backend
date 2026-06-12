export declare class CreateLocationDto {
    merchantId: string;
    name: string;
    address?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    openingHours?: string;
}
export declare class UpdateLocationDto {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    openingHours?: string;
}
