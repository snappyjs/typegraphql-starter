import { gql } from 'apollo-server-express';
import Container from 'typedi';
import { createTestServerContext, TestServerContext } from '~/__test__/createTestServerContext';
import { RoleRepositoryTypeORM } from '../Role.repository';

const GET_ROLES = gql`
  query GetRoles {
    roles {
      name
    }
  }
`;
describe('Role : Resolver', () => {
  let roleRepo: RoleRepositoryTypeORM;
  let ctx: TestServerContext;

  beforeEach(async () => {
    ctx = await createTestServerContext();
    roleRepo = Container.get<RoleRepositoryTypeORM>(RoleRepositoryTypeORM);
  });

  afterEach(async () => {
    await ctx.close();
  });

  it('should successfully get a list of all roles (ADMIN and CLIENT).', async () => {
    ctx.setRoles(['ADMIN']);
    const res = await ctx.gql.query({
      query: GET_ROLES,
    });
    expect(res.errors).not.toBeDefined();
    expect(res.data.roles).toHaveLength(2);
  });


 it('should only allow ADMIN to get a list of all roles.', async () => {
    const res = await ctx.gql.query({
      query: GET_ROLES
    }); 

    expect(res.errors).toBeDefined();
    expect(res.errors![0].message).toEqual('Access denied! You don\'t have permission for this action!');
  });

});