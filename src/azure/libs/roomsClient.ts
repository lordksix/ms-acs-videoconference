import { RoomsClient } from '@azure/communication-rooms';
import { getResourceConnectionString } from './envHelper';

// Create Rooms Client with Resource String
export const createCommunicationRoomsClient = (): RoomsClient => {
  const resourceConnectionString = getResourceConnectionString();
  const communicationRoomsClient = new RoomsClient(resourceConnectionString);
  return communicationRoomsClient;
};
