import {MigrationInterface, QueryRunner} from "typeorm";

export class RoleFixtures1612708318770 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("INSERT INTO roles(name) VALUES('ADMIN'), ('CLIENT')");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("DELETE FROM roles WHERE name IN ('ADMIN', 'CLIENT')");
    }

}
