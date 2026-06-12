"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const fs_1 = require("fs");
const sharp_1 = require("sharp");
let UploadsService = class UploadsService {
    uploadsDir = (0, path_1.join)(__dirname, '..', '..', '..', 'uploads');
    constructor() {
        if (!(0, fs_1.existsSync)(this.uploadsDir)) {
            (0, fs_1.mkdirSync)(this.uploadsDir, { recursive: true });
        }
    }
    async saveFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Only image files (JPEG, PNG, GIF, WebP) are allowed');
        }
        const ext = (0, path_1.extname)(file.originalname).toLowerCase();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filepath = (0, path_1.join)(this.uploadsDir, filename);
        if (!file.buffer) {
            throw new common_1.BadRequestException('File buffer is empty');
        }
        const processed = await (0, sharp_1.default)(file.buffer).resize({ width: 1200, withoutEnlargement: true }).toBuffer();
        (0, fs_1.writeFileSync)(filepath, processed);
        return `/uploads/${filename}`;
    }
    async deleteFile(filename) {
        const filepath = (0, path_1.join)(this.uploadsDir, filename);
        if ((0, fs_1.existsSync)(filepath)) {
            (0, fs_1.unlinkSync)(filepath);
        }
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map