import UserDto from '@/dto/user-dto';

declare module 'express' {
  export interface Request {
    user?: UserDto;
  }
}
