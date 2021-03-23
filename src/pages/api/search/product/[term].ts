import Models from '../../../../models'
import { ensureConnection } from '../../../../common/database'
import { initMiddleware, validateMiddleware, requireAuthentication } from '../../../../middleware'
import { check, validationResult } from 'express-validator'

const validate = initMiddleware(
    validateMiddleware([
        check('term').isAscii(),
        check('term').isLength({ min: 2, max: 20 }),
    ], validationResult)
)

export default async (req, res) => {
    await validate(req, res)

    const get = async () => {

        const connection = await ensureConnection();
        const repository = connection.getRepository(Models.Product.schema);
        const results = await repository.findAndCount({ name: term, public: true });

        if (results) {
            return res.status(200).json({ data: results });
        }

        return res.status(404).json({ error: 'Product not found' });
    }

    const {
        query: { term },
        method,
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
