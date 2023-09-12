import fs from 'fs/promises';
import sharp from 'sharp';

import { IS3ImageFile } from '@/types/image';

class FileManager {
  constructor() {}

  public async convertTempImageToS3Image(
    imageFiles: Express.Multer.File[],
  ): Promise<IS3ImageFile[]> {
    const resizedImages = await this.resizeImages(imageFiles);
    //const uploadedImages = await this.uploadImageFileToS3(resizedImages);
    return resizedImages;
  }

  private async resizeImages(
    imageFiles: Express.Multer.File[],
  ): Promise<IS3ImageFile[]> {
    try {
      const resizedImages = await Promise.all(
        imageFiles.map((item) => this.resizeImage(item)),
      );
      return resizedImages;
    } catch (error) {
      throw error;
    }
  }

  private async resizeImage(
    imageFile: Express.Multer.File,
  ): Promise<IS3ImageFile> {
    try {
      const { data, info } = await sharp(imageFile.path)
        .resize({ width: 600, fit: 'inside', withoutEnlargement: true })
        .withMetadata()
        .toBuffer({ resolveWithObject: true });

      await fs.writeFile(imageFile.path, data);

      return {
        ...imageFile,
        s3Url: '',
        width: info.width,
        height: info.height,
        size: info.size,
      };
    } catch (error) {
      throw error;
    }
  }
}

const _inst = new FileManager();
export default _inst;
