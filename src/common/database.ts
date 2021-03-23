import { Connection, EntitySchema, getConnectionManager } from 'typeorm';
import Models from '../models'

export const connectionOptions = {
    default: {
        type: process.env.TYPEORM_CONNECTION,
        host: process.env.TYPEORM_HOST,
        port: process.env.TYPEORM_PORT,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        synchronize: process.env.TYPEORM_SYNCHRONIZE,
        logging: process.env.TYPEORM_LOGGING,
        entities: [Models.User.schema, Models.Product.schema, Models.Placement.schema, Models.Pocket.schema, Models.Like.schema, Models.Comment.schema, Models.Review.schema]
    }
};


function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
    if (prevEntities.length !== newEntities.length) return true;

    for (let i = 0; i < prevEntities.length; i++) {
        if (prevEntities[i] !== newEntities[i]) return true;
    }

    return false;
}

async function updateConnectionEntities(connection: Connection, entities: any[]) {
    if (!entitiesChanged(connection.options.entities, entities)) return;

    // @ts-ignore
    connection.options.entities = entities;

    // @ts-ignore
    connection.buildMetadatas();

    if (connection.options.synchronize) {
        await connection.synchronize();
    }
}

export async function ensureConnection(name: string = 'default') {
    const connectionManager = getConnectionManager();

    if (connectionManager.has(name)) {
        const connection = connectionManager.get(name);

        if (!connection.isConnected) {
            await connection.connect();
        }

        if (process.env.NODE_ENV !== 'production') {
            await updateConnectionEntities(connection, connectionOptions[name].entities);
        }

        return connection;
    }

    return await connectionManager.create({ name, ...connectionOptions[name] }).connect();
}
