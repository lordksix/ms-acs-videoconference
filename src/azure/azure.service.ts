import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateACSTokenDto,
  CreateChatThreadDto,
  AddUserChatThreadDto,
  UserConfigDto,
  AddParticipantsDto,
} from './dto/create-azure.dto';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { handleUserTokenRequest } from './libs/issueToken';
import { CommunicationUserToken } from '@azure/communication-identity';
import { getToken } from './libs/identityClient';
import { getEndpoint } from './libs/envHelper';
import { BaseResponse } from '../utils/response/base.response';
import { NotFoundResponse } from '../utils/response/notFound.response';
import {
  addUserToChatThread,
  createChatThread,
  threadIdToModeratorCredentialMap,
  userIdToUserConfigMap,
} from './libs/handleChatThread';
import { SuccessResponse } from '../utils/response/success.response';
import {
  addParticipants,
  createRoom,
  getUsersInRoom,
} from './libs/roomsClient';

@Injectable()
export class AzureService {
  //Services related with VIDEO
  async createToken(CreateACSTokenDto: CreateACSTokenDto) {
    const userToken = await handleUserTokenRequest(
      CreateACSTokenDto.scope ?? '',
    );
    return userToken;
  }

  async refreshToken(id: string) {
    const user: CommunicationUserIdentifier = {
      communicationUserId: id,
    };
    const token = await getToken(user, ['chat', 'voip']);
    const userToken: CommunicationUserToken = {
      user,
      ...token,
    };
    console.log(userToken);
    return userToken;
  }

  async createRoomAndGetId() {
    try {
      const room = await createRoom();
      return room;
    } catch (error) {
      throw NotFoundResponse.response(error.message);
    }
  }

  //Get all the users there are in a Room
  async getUsersTokenFromRoomId(id: any) {
    try {
      const participantsArray = await getUsersInRoom(id);
      return participantsArray;
    } catch (error) {
      throw NotFoundResponse.response(error.message);
    }
  }

  // Add participant to a Room
  async addParticipant(id: any, participants: AddParticipantsDto[]) {
    try {
      return new BaseResponse(
        HttpStatus.CREATED,
        'Participant added to the room',
        await addParticipants(id, participants),
      );
    } catch (error) {
      throw NotFoundResponse.response(error.message);
    }
  }

  //Services related with CHAT
  async createChatThreadPost(CreateChatThreadDto: CreateChatThreadDto) {
    try {
      return new BaseResponse(
        HttpStatus.CREATED,
        'Chat thread created',
        await createChatThread(CreateChatThreadDto),
      );
    } catch (err) {
      throw NotFoundResponse.response(err.message);
    }
  }

  async addUserToChatThreadPost(
    AddUserChatThreadDto: AddUserChatThreadDto,
    threadId: string,
  ) {
    // TODO add the possibility to create the user using the identity client function createUserAndToken on helper function

    const { userId, displayName } = AddUserChatThreadDto;

    const chatThreadClient = addUserToChatThread(threadId);

    try {
      await chatThreadClient.addParticipants({
        participants: [
          {
            id: { communicationUserId: userId },
            displayName,
          },
        ],
      });
      return new BaseResponse(HttpStatus.CREATED, 'User added to chat thread');
    } catch (err) {
      // we will return a 404 if the thread to join is not accessible by the server user.
      // The server user needs to be in the thread in order to add someone.
      // So we are returning back that we can't find the thread to add the client user to.
      throw NotFoundResponse.response('Chat thread not found');
    }
  }

  setUserConfig = async (userId: string, userConfigDto: UserConfigDto) => {
    const { emoji, threadId, displayName } = userConfigDto;
    userIdToUserConfigMap.set(userId, {
      emoji,
      threadId,
      displayName,
    });

    return SuccessResponse.response('success');
  };

  getUserConfig = (userId: string) => {
    const userConfig = userIdToUserConfigMap.get(userId);

    return userConfig;
  };

  getIsValidThreadId = (threadId: string) => {
    return threadIdToModeratorCredentialMap.has(threadId);
  };

  getEndpointUrl() {
    return getEndpoint();
  }
}
