import { ApolloServer } from 'apollo-server-express';
import { Connection } from 'typeorm';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import { buildAppSchema } from '~/server/buildAppSchema';
import { createTestTypeORMContext } from './createTestTypeORMConnection';
import { Role } from '~/domains/auth/roles/Role.model';

export interface TestServerContext {
  gql: ApolloServerTestClient;
  conn: Connection;
  server: ApolloServer;
  close: () => Promise<void>;
  setRoles: (roles: string[]) => void;
}

export const createTestServerContext = async (): Promise<TestServerContext> => {
  const [dbCtx, schema] = await Promise.all([createTestTypeORMContext(), buildAppSchema()]);

  let user : {id : number, roles: string[]} = {
    id: 1,
    roles: []
  };

  const server = new ApolloServer({
    schema,
    introspection: false,
    subscriptions: false,
    playground: false,
    debug: false,
    context: () => {
      return {
        user
      }
    }
  });
  const gql = createTestClient(server);

  return {
    gql,
    conn: dbCtx.conn,
    server,
    setRoles: (roles: string[]) => {
      user.roles = roles;
    },
    close: async () => {
      await server.stop();
      await dbCtx.close();
    },
  };
};
