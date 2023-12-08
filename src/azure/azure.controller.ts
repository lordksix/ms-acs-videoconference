import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpStatus,
  ParseArrayPipe,
} from '@nestjs/common';
import { AzureService } from './azure.service';
import {
  CreateACSTokenDto,
  CreateChatThreadDto,
  AddUserChatThreadDto,
  UserConfigDto,
  AddParticipantsDto,
} from './dto/create-azure.dto';
import { BadRequestResponse } from '../utils/response/badrequest.response';
import { SuccessResponse } from '../utils/response/success.response';
import { BaseResponse } from '../utils/response/base.response';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotFoundResponse } from '../utils/response/notFound.response';

@ApiTags('Azure')
@Controller('azure')
export class AzureController {
  constructor(private readonly azureService: AzureService) {}

  //Endpoints related with VIDEO
  //Creates user and token and returns newly created user's token
  @Post('token')
  @ApiOperation({
    summary: 'Create and return token linked to the user using body',
  })
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

  // Retrieves a rooms id.
  @Get('roomId')
  @ApiOperation({
    summary: 'Create room and return the room id of the newly created room',
  })
  @ApiResponse({
    status: 201,
    description: 'Create Rooms Client',
    type: BaseResponse,
  })
  async getRoomId() {
    try {
      const roomId = await this.azureService.createRoomAndGetId();
      return new BaseResponse(HttpStatus.CREATED, 'success', roomId);
    } catch (error) {
      throw new BaseResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'error',
        'Failed to retrieve room ID',
      );
    }
  }

  //Creates user and token and returns newly created user's token
  @Get('token')
  @ApiOperation({
    summary:
      'Create and return token linked to the user using query parameters',
  })
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

  // Retrieves all the users that are in a room id.
  @Post('userInRoom/:roomId')
  @ApiParam({ name: 'roomId', example: '1790033' })
  @ApiOperation({
    summary:
      'Finds the room from the param ID and returns all user tokens that are participants',
  })
  @ApiResponse({
    status: 201,
    description: 'Create Rooms Client',
    type: BaseResponse,
  })
  async getUsersInRoom(@Param('roomId') id: string) {
    const users = await this.azureService.getUsersTokenFromRoomId(id);
    return new BaseResponse(HttpStatus.CREATED, 'success', users);
  }

  // Add a participant to a given room with it's communicationUserId
  @Post('addParticipant/:roomId')
  @ApiBody({ type: AddParticipantsDto })
  @ApiOperation({
    summary:
      'Finds the room from the param ID, add all users (gotten from the body of the request) and returns all added user tokens',
  })
  @ApiParam({ name: 'roomId', example: '1790033' })
  @ApiResponse({
    status: 201,
    description: 'Create Rooms Client',
    type: BaseResponse,
  })
  async addParticipant(
    @Body(new ParseArrayPipe({ items: AddParticipantsDto }))
    participants: AddParticipantsDto[],
    @Param('roomId') id: string,
  ) {
    return new BaseResponse(
      HttpStatus.CREATED,
      'success',
      await this.azureService.addParticipant(id, participants),
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

  @Get('userConfig/:userId')
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
