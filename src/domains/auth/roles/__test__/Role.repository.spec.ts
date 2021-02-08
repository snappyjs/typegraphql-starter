import 'reflect-metadata';
import Container from 'typedi';

import { RoleRepository, RoleRepositoryTypeORM } from '~/domains/auth/roles/Role.repository';
import {
  createTestTypeORMContext,
  TestTypeORMContext,
} from '~/__test__/createTestTypeORMConnection';
import { RoleLevel } from '../Role.model';

describe('Role : Entity', () => {

  let ctx: TestTypeORMContext;
  let roleRepo: RoleRepository;
  beforeEach(async () => {
    ctx = await createTestTypeORMContext();
    roleRepo = Container.get<RoleRepositoryTypeORM>(RoleRepositoryTypeORM);
  });

  afterEach(async () => {
    await ctx.close();
  });

  it('should always have CLIENT and ADMIN roles.', async () => {
    const roles = await roleRepo.findAll();
    expect(roles).toHaveLength(2);
  });

  it('should find a specific role.', async () => {
    const role = await roleRepo.findByLevel(RoleLevel.ADMIN);
    expect(role).toBeDefined();
    expect(role?.name).toEqual(RoleLevel.ADMIN);
  });
});
