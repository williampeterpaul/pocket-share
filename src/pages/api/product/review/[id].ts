import Models from '../../../../models'
import { ensureConnection } from '../../../../common/database'
import { initMiddleware, validateMiddleware, requireAuthentication } from '../../../../middleware'
import { check, validationResult } from 'express-validator'

const validate = initMiddleware(
    validateMiddleware([
        check('id').isInt({ min: 1, max: 999999 }),
    ], validationResult)
)

const authenticate = initMiddleware(
    requireAuthentication()
)

export default async (req, res) => {
    await authenticate(req, res);
    await validate(req, res)

    const get = async () => {
        try {
            const connection = await ensureConnection();
            const repository = connection.getRepository(Models.User.schema);
            const user = await repository.findOne(session.user.id, { relations: ['reviews'] });

            // @ts-ignore
            user.reviews.push({ pocket: { id } });

            await repository.save(user);

            return res.status(200).json({ data: 'Success' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Unable to process request' });
        }
    }

    const {
        query: { id },
        method,
        session
    } = req

    switch (method) {
        case 'GET':
            return await get()
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).json({ error: `Method ${method} not allowed` })
            return;
    }
};
