import { DevicePlatform } from '@prisma/client';
export declare class RegisterDeviceDto {
    platform: DevicePlatform;
    pushToken: string;
}
