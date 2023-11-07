import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';

export class ConflictResponse<T = any> extends BaseResponse<T> {
  constructor(message: string, data?: T) {
    super(HttpStatus.CONFLICT, message, data);
  }

  static response<T = any>(message: string, data?: T): ConflictResponse<T> {
    return new ConflictResponse<T>(message, data);
  }
}
