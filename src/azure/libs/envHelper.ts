export const getResourceConnectionString = (): string => {
  const resourceConnectionString = process.env['ResourceConnectionString'];

  if (!resourceConnectionString) {
    throw new Error('No ACS connection string provided');
  }

  return resourceConnectionString;
};

export const getEndpoint = (): string => {
  const uri = new URL(process.env['EndpointUrl']);
  return `${uri.protocol}//${uri.host}`;
};

export const createAdminUserId = (): string => {
  // TODO add the possibility to create the user using the identity client function createUserAndToken
  // information should be saved on a database
  const adminUserId = process.env['AdminUserId'];

  if (!adminUserId) {
    throw new Error('No ACS Admin UserId provided');
  }

  return adminUserId;
};

export const getAdminUserId = (): string => {
  // TODO add the possibility to create the user using the identity client function createUserAndToken
  // information should be saved on a database
  const adminUserId = process.env['AdminUserId'];

  if (!adminUserId) {
    throw new Error('No ACS Admin UserId provided');
  }

  return adminUserId;
};
