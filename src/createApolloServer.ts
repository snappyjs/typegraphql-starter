import { ApolloServer } from 'apollo-server-express';
import { decodeToken } from './domains/auth/utils/decodeToken';
import { buildAppSchema } from './server/buildAppSchema';

export const createApolloServer = async (): Promise<ApolloServer> => {
  const schema = await buildAppSchema();
  return new ApolloServer({
    schema,
    context: ({ req }) => {
      if(!req.headers.authorization) return { };
      return {
        user: decodeToken(req.headers.authorization)
      }
    }
  });
};
