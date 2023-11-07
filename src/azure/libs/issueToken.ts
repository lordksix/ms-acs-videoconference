import {
  CommunicationUserToken,
  TokenScope,
} from '@azure/communication-identity';
import { createUserAndToken } from './identityClient';

/**
 * handleUserTokenRequest will return a default scoped token if no scopes are provided.
 * @param requestedScope [optional] string from the request, this should be a comma seperated list of scopes.
 */
export const handleUserTokenRequest = async (
  requestedScope?: string,
): Promise<CommunicationUserToken> => {
  const scopes: TokenScope[] = requestedScope
    ? (requestedScope.split(',') as TokenScope[])
    : ['chat', 'voip'];
  return await createUserAndToken(scopes);
};
