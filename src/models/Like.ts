import { EntitySchema } from "typeorm";
import User from './User'
import Pocket from './Pocket'

export default interface Like {
    id: number;
    user: User;
    pocket: Pocket;
    createdAt: any;
    updatedAt: any;
}

export default class Like { }

export const LikeSchema = new EntitySchema<Like>({
    name: 'Like',
    target: Like,
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        createdAt: {
            type: 'timestamp',
            createDate: true
        },
        updatedAt: {
            type: 'timestamp',
            updateDate: true
        }
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            inverseSide: 'likes'
        },
        pocket: {
            type: 'many-to-one',
            target: 'Pocket',
            inverseSide: 'likes'
        }
    }
});