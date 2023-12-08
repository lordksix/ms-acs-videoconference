import {
  RoomsClient,
  CreateRoomOptions,
  RoomParticipantPatch,
  RoomParticipant,
  ParticipantRole,
} from '@azure/communication-rooms';
import { getResourceConnectionString } from './envHelper';
import { createUserAndToken } from './identityClient';
import { AddParticipantsDto } from '../dto/create-azure.dto';

// Create Rooms Client with Resource String
export const createCommunicationRoomsClient = (): RoomsClient => {
  const resourceConnectionString = getResourceConnectionString();
  const communicationRoomsClient = new RoomsClient(resourceConnectionString);
  return communicationRoomsClient;
};

// Create a Room with a user and options
export const createRoom = async () => {
  const communicationRoomsClient = createCommunicationRoomsClient();
  const user = await createUserAndToken(['voip']);
  const participants = [
    {
      id: user.user,
      role: 'Presenter',
    },
  ];

  const validFrom = new Date(Date.now());
  const validUntil = new Date(validFrom.getTime() + 60 * 60 * 1000);

  const createRoomOptions: CreateRoomOptions = {
    validFrom,
    validUntil,
    participants: participants as RoomParticipantPatch[],
  };
  const room = await communicationRoomsClient.createRoom(createRoomOptions);
  return room;
};

//Get all the users there are in a Room
export const getUsersInRoom = async (
  id: string,
): Promise<RoomParticipant[]> => {
  const communicationRoomsClient = createCommunicationRoomsClient();
  const participantsList = communicationRoomsClient.listParticipants(id);
  const participantsArray: RoomParticipant[] = [];
  for await (const participant of participantsList) {
    participantsArray.push(participant);
  }
  return participantsArray;
};

// Add participant to a Room
export const addParticipants = async (
  id: string,
  participants: AddParticipantsDto[],
) => {
  const communicationRoomsClient = createCommunicationRoomsClient();
  const addParticipantsList = participants.map(({ idUser, role }) => {
    const roleParticipant: ParticipantRole =
      (role as ParticipantRole) || 'Attendee';
    return {
      id: { communicationUserId: idUser },
      role: roleParticipant,
    };
  });

  await communicationRoomsClient.addOrUpdateParticipants(
    id,
    addParticipantsList,
  );
};

// Other methods with  Rooms Client here
