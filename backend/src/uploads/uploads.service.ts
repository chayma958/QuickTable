import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { UploadApiResponse, v2 as CloudinaryClient } from 'cloudinary';
import { CLOUDINARY } from './cloudinary.provider';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

@Injectable()
export class UploadsService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof CloudinaryClient,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ url: string }> {
    if (!file) throw new BadRequestException('No file provided');
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Only JPEG, PNG, and WEBP images are allowed',
      );
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException('Image must be smaller than 5MB');
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: `quicktable/${folder}`, resource_type: 'image' },
        (error, uploadResult) => {
          if (error || !uploadResult)
            return reject(
              error ? new Error(error.message) : new Error('Upload failed'),
            );
          resolve(uploadResult);
        },
      );
      stream.end(file.buffer);
    });

    return { url: result.secure_url };
  }
}
