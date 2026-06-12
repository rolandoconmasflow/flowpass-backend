export declare class CreateRaffleDto {
    merchantId: string;
    title: string;
    description?: string;
    prize: string;
    prizeImage?: string;
    entryCost?: number;
    maxEntries?: number;
    startsAt?: string;
    endsAt?: string;
    isActive?: boolean;
}
export declare class UpdateRaffleDto {
    title?: string;
    description?: string;
    prize?: string;
    prizeImage?: string;
    entryCost?: number;
    maxEntries?: number;
    startsAt?: string;
    endsAt?: string;
    isActive?: boolean;
}
