import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'portfolio'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `portfolio/${folder}` },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'resumes'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `portfolio/${folder}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadImageFromUrl(url: string, folder: string = 'portfolio'): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(url, {
        folder: `portfolio/${folder}`,
      });
      return result.secure_url;
    } catch (error) {
      throw error;
    }
  }
}
