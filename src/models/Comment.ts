import { EntitySchema } from "typeorm";
import User from './User'
import Pocket from './Pocket'

export default interface Comment {
    id: number;
    user: User;
    pocket: Pocket;
    createdAt: any;
    updatedAt: any;
}

export default class Comment { }

export const CommentSchema = new EntitySchema<Comment>({
    name: 'Comment',
    target: Comment,
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
            inverseSide: 'comments',
        },
        pocket: {
            type: 'many-to-one',
            target: 'Pocket',
            inverseSide: 'comments',
        }
    }
});