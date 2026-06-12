export interface UploadFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export declare class UploadsService {
    private readonly uploadsDir;
    constructor();
    saveFile(file: UploadFile): Promise<string>;
    deleteFile(filename: string): Promise<void>;
}
