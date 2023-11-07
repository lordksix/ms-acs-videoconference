import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';

export class SuccessResponse<T = any> extends BaseResponse<T> {
  constructor(message: string, data?: T) {
    super(HttpStatus.OK, message, data);
  }

  static response<T = any>(message: string, data?: T): SuccessResponse<T> {
    return new SuccessResponse<T>(message, data);
  }
}
