import fs from 'fs/promises'
import { createReadStream } from 'fs'
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

interface IS3File extends Express.Multer.File {
  s3Url?: string;
  width?: number;
  height?: number;
}

class FileManager {
  private s3: S3Client;
  private s3_region: string;
  private s3_bucket_name: string;
  private files: IS3File[] = [];

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

  public setMulterFiles(files: Express.Multer.File[]): FileManager {
    this.files = files;
    return this;
  }

  private async resizeImage(file: Express.Multer.File): Promise<IS3File> {
    try {
      const { data, info } = await sharp(file.path)
                                    .resize({ width: 600, fit: 'inside', withoutEnlargement: true })
                                    .withMetadata()
                                    .toBuffer({ resolveWithObject: true });

      await fs.writeFile(file.path, data);

      return {
        ...file,
        s3Url: '',
        width: info.width,
        height: info.height,
        size: info.size
      }

    } catch (error) {
      throw error;
    }
  }

  public async resizeImages(): Promise<FileManager> {
    try {
      const _files = this.files;
      this.files = await Promise.all(_files.map(item => this.resizeImage(item)));
      return this;

    } catch (error) {
      throw error;
    }
  }

  public async uploadFileToS3(): Promise<IS3File[]> {
    const _files = this.files;

    const promiseList = _files.map(async (file) => {
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

    for (let i = 0; i < _files.length; i++) {
      fs.unlink(_files[i].path);
    }

    return newFiles;
  }
}

const _inst = new FileManager();
export default _inst;