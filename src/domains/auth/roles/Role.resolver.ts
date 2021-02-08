import { Authorized, Query, registerEnumType, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';
import { Role, RoleLevel } from './Role.model';
import { RoleRepository, RoleRepositoryTypeORM } from './Role.repository';
import { RoleType } from './Role.type';

@Service()
@Resolver()
export class RoleResolver {
  @Inject(() => RoleRepositoryTypeORM)
  roleRepository: RoleRepository;

  constructor() {
    registerEnumType(RoleLevel, {
      name: 'RoleLevel'
    })
  }

  @Query(() => [RoleType])
  @Authorized(['ADMIN'])
  async roles(): Promise<Role[]> {
    const roles = await this.roleRepository.findAll();
    return roles;
  }
  
}
