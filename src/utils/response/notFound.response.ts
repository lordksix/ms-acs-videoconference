import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';

export class NotFoundResponse<T = any> extends BaseResponse<T> {
  constructor(message: string, data?: T) {
    super(HttpStatus.NOT_FOUND, message, data);
  }

  static response<T = any>(message: string, data?: T): NotFoundResponse<T> {
    return new NotFoundResponse<T>(message, data);
  }
}
