import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service.js';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload an image to Cloudinary (returns URL)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          example: 'hero',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    const url = await this.uploadService.uploadImage(file, folder);
    return { url };
  }

  @Post('pdf')
  @ApiOperation({ summary: 'Upload a PDF/document to Cloudinary (returns URL)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          example: 'resumes',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: '.(pdf|doc|docx)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    const url = await this.uploadService.uploadFile(file, folder || 'resumes');
    return { url };
  }

  @Post('url')
  @ApiOperation({ summary: 'Upload an image via URL to Cloudinary' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        folder: { type: 'string', example: 'blogs' },
      },
    },
  })
  async uploadFromUrl(@Body() body: { url: string; folder?: string }) {
    const url = await this.uploadService.uploadImageFromUrl(body.url, body.folder);
    return { url };
  }
}
