import { UploadsService } from './uploads.service';
interface UploadFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(file: UploadFile): Promise<{
        url: string;
    }>;
}
export {};
