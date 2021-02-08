import { createConnection } from "typeorm";
createConnection({
    type: 'postgres',
    username: 'postgres',
    password: 'password',
    port: 5432,
    database: 'barq_test',
    entities: ['src/**/*.type.ts', 'src/**/*.type.js'],
    //synchronize: true,
    dropSchema: true,
    logging: true,
    migrationsRun: true,
    migrations: ['migrations/*.ts']
  }).then(() => process.exit());