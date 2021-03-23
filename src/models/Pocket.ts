import { EntitySchema } from "typeorm";
import User from './User'
import Placement from './Placement'
import Like from './Like'
import Comment from './Comment';

export default interface Pocket {
    id: number;
    title: string;
    description: string;
    image: string;
    user: User;
    likes: Like[];
    comments: Comment[];
    placements: Placement[];
    likeCount: number;
    createdAt: any;
    updatedAt: any;
}

export default class Pocket { }

export const PocketSchema = new EntitySchema<Pocket>({
    name: 'Pocket',
    target: Pocket,
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        title: {
            type: 'varchar',
            length: 64,
            nullable: true
        },
        description: {
            type: 'varchar',
            length: 256,
            nullable: true
        },
        likeCount: {
            type: 'int',
            default: 0,
            nullable: false
        },
        image: {
            type: 'varchar',
            nullable: false
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
            eager: true,
            inverseSide: 'pocket',
        },
        likes: {
            type: 'one-to-many',
            target: 'Like',
            cascade: true,
            inverseSide: 'pocket'
        },
        comments: {
            type: 'one-to-many',
            target: 'Comment',
            cascade: true,
            inverseSide: 'pocket'
        },
        placements: {
            type: 'one-to-many',
            target: 'Placement',
            cascade: true,
            eager: true,
            inverseSide: 'pocket'
        }
    }
});