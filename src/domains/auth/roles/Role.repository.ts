import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../users/User.model';
import { UserType } from '../users/User.type';
import { Role, RoleLevel } from './Role.model';
import { RoleType } from './Role.type';

export interface RoleRepository {
  findAll(): Promise<Role[]>;
  save(role: Partial<Role>): Promise<Role>;
  findByLevel(roleLevel: RoleLevel): Promise<Role | undefined>;
  findUsersByLevel(roleLevel: RoleLevel): Promise<User[] | undefined>;
}

@Service()
export class RoleRepositoryTypeORM implements RoleRepository {
  @InjectRepository(RoleType)
  private roleRepo: Repository<RoleType>;

  @InjectRepository(UserType)
  private userRepo: Repository<UserType>;

  findAll(): Promise<Role[]> {
    return this.roleRepo.find();
  }

  findByLevel(roleLevel: RoleLevel) {
    return this.roleRepo.findOne({
      name:roleLevel
    })
  }

  async findUsersByLevel(roleLevel: RoleLevel) {
    const role = await this.roleRepo.findOne({
      relations: ['users'],
      where: {
        name: roleLevel
      }
    });

    return role && role.users;
  }

  save(role: Partial<Role>) {
    return this.roleRepo.save(role);
  }
}
