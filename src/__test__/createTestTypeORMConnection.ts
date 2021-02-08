import Container from 'typedi';
import {
  Connection, createConnection, getConnectionManager, useContainer,
} from 'typeorm';
import { TransactionalTestContext } from 'typeorm-transactional-tests';

export interface TestTypeORMContext {
  conn: Connection;
  close: () => Promise<void>;
}

export const createTestTypeORMContext = async (
  drop: boolean = false,
): Promise<TestTypeORMContext> => {
  useContainer(Container);

  const conMan = getConnectionManager();
  if (conMan.has('default')) {
    const prevCon = conMan.get('default');
    if (prevCon.isConnected) await prevCon.close();
  }

  const conn = await createConnection({
    type: 'postgres',
    username: 'postgres',
    password: 'password',
    port: 5432,
    database: 'barq_test',
    entities: ['src/**/*.type.ts', 'src/**/*.type.js'],
    synchronize: drop,
    dropSchema: drop,
    logging: false,
    migrationsRun: drop,
  });
  const transaction = new TransactionalTestContext(conn);

  await transaction.start();

  return {
    conn,
    close: async () => {
      await transaction.finish();
      await conn.close();
    },
  };
};
