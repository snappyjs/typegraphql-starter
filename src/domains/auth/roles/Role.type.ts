import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/User.model';
import { UserType } from '../users/User.type';
import { Role, RoleLevel } from './Role.model';

@ObjectType()
@Entity({ name: 'roles' })
export class RoleType implements Role {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  name: RoleLevel;

  @Field(() => [UserType])
  @ManyToMany(() => UserType, user => user.roles)
  @JoinTable()
  users: User[];
}
