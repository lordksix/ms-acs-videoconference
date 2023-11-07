import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { AzureService } from './azure.service';
import {
  CreateACSTokenDto,
  CreateChatThreadDto,
  AddUserChatThreadDto,
  UserConfigDto,
} from './dto/create-azure.dto';
import { BadRequestResponse } from '../utils/response/badrequest.response';
import { SuccessResponse } from '../utils/response/success.response';
import { BaseResponse } from '../utils/response/base.response';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundResponse } from '../utils/response/notFound.response';

@ApiTags('Azure')
@Controller('azure')
export class AzureController {
  constructor(private readonly azureService: AzureService) {}

  //Endpoints related with VIDEO
  //Creates user and token and returns newly created user's token
  @Post('token')
  @ApiBody({ type: CreateACSTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Create token',
    type: BaseResponse,
  })
  async createTokenPost(@Body() createAzureDto: CreateACSTokenDto) {
    return new BaseResponse(
      HttpStatus.CREATED,
      'success',
      await this.azureService.createToken(createAzureDto),
    );
  }

  //Refreshed user's token
  @Post('token/:userId')
  @ApiParam({ name: 'userId', example: 'yourUserId' })
  @ApiResponse({
    status: 201,
    description: 'Refresh token',
    type: BaseResponse,
  })
  async refreshToken(@Param('userId') id: string) {
    if (!id) return BadRequestResponse.response('User ID param is NECESSARY');
    return new BaseResponse(
      HttpStatus.CREATED,
      'success',
      await this.azureService.refreshToken(id),
    );
  }

  //Creates user and token and returns newly created user's token
  @Get('token')
  @ApiBody({ type: CreateACSTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Create token',
    type: BaseResponse,
  })
  async createTokenGet(@Query() query: CreateACSTokenDto) {
    return new BaseResponse(
      HttpStatus.CREATED,
      'success',
      await this.azureService.createToken(query),
    );
  }

  //Endpoints related with CHAT
  //Creates chat thread and returns the newly created thread's id
  @Post('createChatThread')
  @ApiBody({ type: CreateChatThreadDto })
  @ApiResponse({
    status: 201,
    description: 'Create chat thread',
    type: BaseResponse,
  })
  async createChatThread(@Body() CreateChatThreadDto: CreateChatThreadDto) {
    return new BaseResponse(
      HttpStatus.CREATED,
      'success',
      await this.azureService.createChatThreadPost(CreateChatThreadDto),
    );
  }

  //Creates chat thread and returns the newly created thread's id
  @Post('addUserChatThread/:threadId')
  @ApiParam({ name: 'threadId', example: 'yourThreadId' })
  @ApiBody({ type: AddUserChatThreadDto })
  @ApiResponse({
    status: 201,
    description: 'User added to the chat thread',
    type: BaseResponse,
  })
  async addUserToChatThread(
    @Body() AddUserChatThreadDto: AddUserChatThreadDto,
    @Param('threadId') threadId: string,
  ) {
    return await this.azureService.addUserToChatThreadPost(
      AddUserChatThreadDto,
      threadId,
    );
  }

  @Get('userconfig/:userId')
  @ApiParam({ name: 'userId', example: 'yourUserId' })
  @ApiBody({ type: UserConfigDto })
  @ApiResponse({
    status: 201,
    description: 'Set user with emoji to the thread',
    type: BaseResponse,
  })
  async setUserConfigEP(
    @Body() userConfigDto: UserConfigDto,
    @Param('threadId') threadId: string,
  ) {
    return await this.azureService.setUserConfig(threadId, userConfigDto);
  }

  @Get('userconfig/:userId')
  @ApiParam({ name: 'userId', example: 'yourUserId' })
  @ApiResponse({
    status: 200,
    description: 'User Configuration',
    type: SuccessResponse,
  })
  getUserConfigEP(@Param('userId') userId: string) {
    const userConfig = this.azureService.getUserConfig(userId);
    if (userConfig) {
      return SuccessResponse.response('Success', userConfig);
    }
    return NotFoundResponse.response('Not Found');
  }

  @Get('isvalidthread/:threadId')
  @ApiParam({ name: 'threadId', example: 'yourThreadId' })
  @ApiResponse({
    status: 200,
    description: 'Valid Thread Id',
    type: SuccessResponse,
  })
  isValidThread(@Param('threadId') threadId: string) {
    if (this.azureService.getIsValidThreadId(threadId)) {
      return SuccessResponse.response('It is a valid thread');
    }
    return NotFoundResponse.response('Not Found');
  }

  @Get('endpointurl')
  @ApiResponse({
    status: 200,
    description: 'Endpoint URL',
    type: SuccessResponse,
  })
  getEndpointUrl() {
    return SuccessResponse.response(
      'success',
      this.azureService.getEndpointUrl(),
    );
  }
}