import { NextApiRequest, NextApiResponse } from 'next';
import { ensureConnection } from '../../../common/database'
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Models from '../../../models'

const options = {
    providers: [
        Providers.Email({
            server: process.env.NEXTAUTH_EMAIL_SERVER,
            from: process.env.NEXTAUTH_EMAIL_FROM,
        })
    ],
    database: {
        type: process.env.TYPEORM_CONNECTION,
        host: process.env.TYPEORM_HOST,
        port: process.env.TYPEORM_PORT,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        synchronize: process.env.TYPEORM_SYNCHRONIZE,
        logging: process.env.TYPEORM_LOGGING
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        session: async (session: any, user: any): Promise<object> => {
            const connection = await ensureConnection();
            const repository = connection.getRepository(Models.User.schema);
            const exists = await repository.findOne(user.id);
            if (exists) {
                session.user.id = exists.id;
                session.user.name = exists.name;
                session.user.role = exists.role;
                session.user.image = exists.image;
                session.user.profession = exists.profession;
                return Promise.resolve(session);
            } else {
                delete user.name;
                delete user.image;
                await repository.save(user);
                return Promise.resolve(session);
            }
        }
    }
};

const Auth = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);

export default Auth;
