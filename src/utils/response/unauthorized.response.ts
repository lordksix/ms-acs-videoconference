import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';

export class UnauthorizedResponse<T = any> extends BaseResponse<T> {
  constructor(message: string, data?: T) {
    super(HttpStatus.UNAUTHORIZED, message, data);
  }

  static response<T = any>(message: string, data?: T): UnauthorizedResponse<T> {
    return new UnauthorizedResponse<T>(message, data);
  }
}
