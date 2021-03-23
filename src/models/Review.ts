import { EntitySchema } from "typeorm";
import User from './User'
import Product from './Product'

export default interface Review {
    id: number;
    user: User;
    product: Product;
    createdAt: any;
    updatedAt: any;
}

export default class Review { }

export const ReviewSchema = new EntitySchema<Review>({
    name: 'Review',
    target: Review,
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
            inverseSide: 'reviews',
        },
        product: {
            type: 'many-to-one',
            target: 'Product',
            inverseSide: 'reviews',
        }
    }
});