import Container from "typedi";
import { Connection, createConnection, useContainer } from "typeorm";

export const createTypeORMConnection = async () : Promise<Connection> => {
    useContainer(Container);

    const conn = await createConnection();

    return conn;
};
