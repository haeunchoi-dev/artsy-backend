import fs from 'fs/promises'
import { createReadStream } from 'fs'
import sharp from 'sharp';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import { IS3ImageFile } from '@/types/image';

class FileManager {
  private s3: S3Client;
  private s3_region: string;
  private s3_bucket_name: string;

  constructor() {
    const s3_region = process.env.S3_REGION;
    const s3_access_key = process.env.S3_ACCESS_KEY;
    const s3_secret_key = process.env.S3_SECRET_KEY;
    const s3_bucket_name = process.env.S3_BUCKET_NAME;

    if (s3_region === undefined || s3_access_key === undefined || s3_secret_key === undefined || s3_bucket_name === undefined) {
      throw new Error('s3 info undefined');
    }

    this.s3_region = s3_region;
    this.s3_bucket_name = s3_bucket_name;

    this.s3 = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: s3_access_key,
        secretAccessKey: s3_secret_key
      }
    });
  }

  public async convertTempImageToS3Image(imageFiles: Express.Multer.File[]): Promise<IS3ImageFile[]> {
    const resizedImages = await this.resizeImages(imageFiles);
    const uploadedImages = await this.uploadImageFileToS3(resizedImages);
    return uploadedImages;
  }

  private async resizeImages(imageFiles: Express.Multer.File[]): Promise<IS3ImageFile[]> {
    
    
    
    
    try {
      const resizedImages = await Promise.all(imageFiles.map(item => this.resizeImage(item)));
      return resizedImages;

    } catch (error) {
      throw error;
    }
    
    
    
  }

  private async resizeImage(imageFile: Express.Multer.File): Promise<IS3ImageFile> {
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
        size: info.size
      }

    } catch (error) {
      throw error;
    }
  }

  private async uploadImageFileToS3(s3ImageFiles: IS3ImageFile[]): Promise<IS3ImageFile[]> {
    const promiseList = s3ImageFiles.map(async (file) => {
      const fileStream = createReadStream(file.path);
      const encodeFileName = encodeURIComponent(file.filename);

      const command = new PutObjectCommand({
        Bucket: this.s3_bucket_name,
        Key: encodeFileName,
        Body: fileStream,
        ACL: 'public-read',
        CacheControl: 'public, max-age=31536000',
      });

      await this.s3.send(command);

      const fileUrl = `https://${this.s3_bucket_name}.s3.${this.s3_region}.amazonaws.com/${encodeFileName}`;
      return {
        ...file,
        s3Url: fileUrl
      };
    });

    const newFiles = await Promise.all(promiseList);

    for (let i = 0; i < s3ImageFiles.length; i++) {
      fs.unlink(s3ImageFiles[i].path);
    }

    return newFiles;
  }

  public async deleteS3Files(fileKeys: string[]) {
    for (const key of fileKeys) {
      const bucketParams = {
        Bucket: this.s3_bucket_name,
        Key: key
      };

      try {
        const data = await this.s3.send(new DeleteObjectCommand(bucketParams));
        //console.log("Success. Object deleted.", data);
        //Success. Object deleted. {
        //  '$metadata': {
        //    httpStatusCode: 204,
        //    requestId: 'G4KYYBVHWQFRTC0S',
        //    extendedRequestId: 'gE9KTltIZ6m1nlMaJEPNzHnZAiaOD37EdFZGbS9xpvrzBDtHzggBMuq7n5jsIbaO/0IjFVqoCq8=',
        //    cfId: undefined,
        //    attempts: 1,
        //    totalRetryDelay: 0
        //  }
        //}
        
        // 없는 키 전송했는데
        //Success. Object deleted. {
        //  '$metadata': {
        //    httpStatusCode: 204,
        //    requestId: '6FPR5J4PMVT5NYZE',
        //    extendedRequestId: 'Y2U7PTF9rR+SvubkEo7trvlYXwFR5KbM6YoLKSroi+qWugv6PA344paGAqdC6zxGBi5XkLSOApo=',
        //    cfId: undefined,
        //    attempts: 1,
        //    totalRetryDelay: 0
        //  }
        //}

      } catch (error) {
        // TODO S3에서 파일 삭제 실패 핸들링인데 성공으로 왜 뜰까?
        console.log('삭제 에러 발생', error);
      }
    }
  }
}

const _inst = new FileManager();
export default _inst;