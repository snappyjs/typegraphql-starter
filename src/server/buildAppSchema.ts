import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { UserResolver } from '~/domains/auth/users';
import { authChecker } from '~/server/authChecker';
import { RoleResolver } from '../domains/auth/roles';

export const buildAppSchema = (): Promise<GraphQLSchema> => buildSchema({
  container: Container,
  resolvers: [RoleResolver, UserResolver],
  authChecker: authChecker
});
