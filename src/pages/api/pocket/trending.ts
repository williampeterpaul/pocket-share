import Models from '../../../models'
import { ensureConnection } from '../../../common/database'
import { initMiddleware, validateMiddleware, requireAuthentication } from '../../../middleware'
import { check, validationResult } from 'express-validator'
import { NextApiRequest, NextApiResponse } from 'next'

const validate = initMiddleware(
    validateMiddleware([
        check('t').isIn(['week', 'month', 'all']),
    ], validationResult)
)

export default async (req: NextApiRequest, res: NextApiResponse) => {

    const get = async () => {
        try {
            await validate(req, res);

            const connection = await ensureConnection();
            const repository = connection.getRepository(Models.Pocket.schema);
            const pockets = await repository.find();

            // find pockets with most likes within last x

            if (pockets) {
                return res.status(200).json({ data: pockets });
            }

            return res.status(404).json({ error: 'Pockets not found' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Unable to process request' });
        }
    }

    const {
        method,
        query: { t }
    } = req

    switch (method) {
        case 'GET':
            return await get();
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).json({ error: `Method ${method} not allowed` })
            return;
    }
};
