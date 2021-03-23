import Models from '../../../models'
import { ensureConnection } from '../../../common/database'
import { initMiddleware, validateMiddleware, requireAuthentication } from '../../../middleware'
import { check, validationResult } from 'express-validator'

const validate = initMiddleware(
    validateMiddleware([
        // is array
        // validate each product title ascii 2-20
        // validate each product brand optionally ascii 2-20
        // validate each product productId int optionally 0-999999
        // validate each x coord float 0-100
        // validate each y coord float 0-100
    ], validationResult)
)

const authenticate = initMiddleware(
    requireAuthentication()
)

export default async (req, res) => {
    const post = async () => {
        try {
            await authenticate(req, res);

            const {
                body: { pocket },
                session
            } = req

            // await validate(req, res)

            const connection = await ensureConnection();
            const repository = connection.getRepository(Models.User.schema);

            const user = await repository.findOne(session.user.id, { relations: ['pockets', 'placements'] });

            // @ts-ignore
            user['pockets'].push(pocket);
            user['placements'] = user['placements'].concat(pocket.placements);

            const { pockets } = await repository.save(user);

            if (pockets) {
                return res.status(200).json({ data: pockets.pop() });
            }

            return res.status(404).json({ error: 'Pockets not found' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Unable to process request' });
        }
    }


    const get = async () => {
        try {
            const connection = await ensureConnection();
            const repository = connection.getRepository(Models.Pocket.schema);
            const pockets = await repository.find();

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
        method
    } = req

    switch (method) {
        case 'POST':
            return await post()
        case 'GET':
            return await get();
        default:
            res.setHeader('Allow', ['POST', 'GET'])
            res.status(405).json({ error: `Method ${method} not allowed` })
            return;
    }
};
