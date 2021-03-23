import Models from '../../../models'
import { ensureConnection } from '../../../common/database'
import { initMiddleware, validateMiddleware, requireAuthentication } from '../../../middleware'
import { check, validationResult } from 'express-validator'

const validate = initMiddleware(
    validateMiddleware([
        check('name').optional().isLength({ min: 2, max: 20 }),
        check('name').optional().isAlphanumeric(),
        check('profession').optional().isLength({ min: 2, max: 20 }),
        check('profession').optional().isAlphanumeric(),
    ], validationResult)
)

const authenticate = initMiddleware(
    requireAuthentication()
)

export default async (req, res) => {
    await authenticate(req, res);

    const put = async () => {
        await validate(req, res)
        const connection = await ensureConnection();
        const repository = connection.getRepository(Models.User.schema);
        const user = await repository.findOne(session.user.id);
        user.name = name;
        user.profession = profession;
        await repository.save(user);

        return res.status(200).json({ data: 'Success' });
    }

    const {
        body: { name, profession },
        method,
        session
    } = req

    switch (method) {
        case 'PUT':
            return await put()
        default:
            res.setHeader('Allow', ['PUT'])
            res.status(405).json({ error: `Method ${method} not allowed` })
            return;
    }
};
