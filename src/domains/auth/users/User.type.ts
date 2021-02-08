import { Authorized, Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../roles/Role.model";
import { RoleType } from "../roles/Role.type";
import { User } from "./User.model";

@ObjectType()
@Entity({name: 'users'})
export class UserType implements User {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ unique: true })
    email: string;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Column()
    password: string;

    @Field(() => [RoleType])
    @ManyToMany(() => RoleType, role => role.users)
    roles: Role[];
}