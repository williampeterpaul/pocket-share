import { EntitySchema } from "typeorm";
import Pocket from './Pocket'
import Placement from './Placement'
import Like from './Like'
import Comment from './Comment';
import Review from './Review';

export default interface User {
    id: number;
    name: string;
    email: string;
    image: string;
    role: string;
    likes: Like[];
    reviews: Review[];
    comments: Comment[];
    profession: string;
    emailVerified: any;
    createdAt: any;
    updatedAt: any;
    pockets: Pocket[];
    placements: Placement[];
}

export default class User { }

export const UserSchema = new EntitySchema<User>({
    name: 'User',
    target: User,
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        name: {
            type: 'varchar',
            nullable: true,
            default: 'Anonymous'
        },
        email: {
            type: 'varchar',
            unique: true,
            nullable: true,
            select: false
        },
        emailVerified: {
            type: 'timestamp',
            nullable: true,
            select: false
        },
        image: {
            type: 'varchar',
            nullable: true,
            default: '/profile.jpg'
        },
        role: {
            type: 'varchar',
            nullable: true,
            default: 'user'
        },
        profession: {
            type: 'varchar',
            nullable: true
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
        pockets: {
            type: 'one-to-many',
            target: 'Pocket',
            cascade: true,
            inverseSide: 'user'
        },
        likes: {
            type: 'one-to-many',
            target: 'Like',
            cascade: true,
            inverseSide: 'user'
        },
        comments: {
            type: 'one-to-many',
            target: 'Comment',
            cascade: true,
            inverseSide: 'user'
        },
        reviews: {
            type: 'one-to-many',
            target: 'Review',
            cascade: true,
            inverseSide: 'user'
        },
        placements: {
            type: 'one-to-many',
            target: 'Placement',
            cascade: true,
            inverseSide: 'user'
        }
    }
});