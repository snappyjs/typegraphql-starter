import express from 'express';
import { createApolloServer } from './createApolloServer';
import { createTypeORMConnection } from './server/createTypeORMConnection';

const app = express();
const main = async () => {

  const conn = await createTypeORMConnection();
  const server = await createApolloServer();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log('Server is running.');
  });
};
main();
