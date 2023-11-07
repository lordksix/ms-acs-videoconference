import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base.response';

export class BadRequestResponse extends BaseResponse {
  constructor(message: string, data?: any) {
    super(HttpStatus.BAD_REQUEST, message, data);
  }

  static response(message: string, data?: any): BadRequestResponse {
    return new BadRequestResponse(message, data);
  }
}
