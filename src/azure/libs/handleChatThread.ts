import { CreateChatThreadDto } from '../dto/create-azure.dto';
import { getToken, createAdminUser, getAdminUser } from './identityClient';
import {
  AzureCommunicationTokenCredential,
  CommunicationTokenCredential,
} from '@azure/communication-common';
import { getEndpoint } from './envHelper';
import {
  ChatClient,
  CreateChatThreadOptions,
  CreateChatThreadRequest,
  CreateChatThreadResult,
} from '@azure/communication-chat';

export const createChatThread = async (
  createChatDetails: CreateChatThreadDto,
) => {
  // TODO add the possibility to create the user using the identity client function createUserAndToken on helper function
  const userAdmin = createAdminUser();

  const { topicName, displayName } = createChatDetails;

  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () =>
      (await getToken(userAdmin, ['chat', 'voip'])).token,
    refreshProactively: true,
  });

  const chatClient = new ChatClient(getEndpoint(), credential);

  const request: CreateChatThreadRequest = {
    topic: topicName ?? 'Your Personal Conversation',
  };
  const options: CreateChatThreadOptions = {
    participants: [
      {
        id: {
          communicationUserId: userAdmin.communicationUserId,
        },
        displayName,
      },
    ],
  };
  const result: CreateChatThreadResult = await chatClient.createChatThread(
    request,
    options,
  );

  const threadID = result.chatThread?.id;
  if (!threadID) {
    throw new Error(
      `Invalid or missing ID for newly created thread ${result.chatThread}`,
    );
  }
  console.log(result);
  return threadID;
};

export const addUserToChatThread = (threadId: string) => {
  // TODO add the possibility to create the user using the identity client function createUserAndToken on helper function

  const credential = new AzureCommunicationTokenCredential({
    tokenRefresher: async () =>
      (await getToken(getAdminUser(), ['chat', 'voip'])).token,
    refreshProactively: true,
  });

  const chatClient = new ChatClient(getEndpoint(), credential);
  const chatThreadClient = chatClient.getChatThreadClient(threadId);
  return chatThreadClient;
};

export const threadIdToModeratorCredentialMap = new Map<
  string,
  CommunicationTokenCredential
>();

// For the purpose of this sample, we opted to use an in-memory data store.
// This means that if the web application is restarted any information maintained would be wiped.
// For longer term storage solutions we suggest referring to this document -> https://docs.microsoft.com/en-us/azure/architecture/guide/technology-choices/data-store-decision-tree
export const userIdToUserConfigMap = new Map<string, UserConfig>();
