import { EntitySchema } from "typeorm";
import Placement from './Placement'
import Review from './Review';

export default interface Product {
    id: number;
    name: string;
    brand: string;
    image: string;
    description: string;
    category: string;
    owners: number;
    public: boolean;
    reviews: Review[];
    placements: Placement[];
    likeCount: number;
    createdAt: any;
    updatedAt: any;
}

export default class Product { }

export const ProductSchema = new EntitySchema<Product>({
    name: 'Product',
    target: Product,
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        name: {
            type: 'varchar',
            length: 64,
            nullable: false
        },
        brand: {
            type: 'varchar',
            length: 64,
            nullable: true
        },
        description: {
            type: 'varchar',
            length: 256,
            nullable: true
        },
        category: {
            type: 'varchar',
            length: 256,
            nullable: true
        },
        owners: {
            type: 'int',
            default: 0,
            nullable: false
        },
        likeCount: {
            type: 'int',
            default: 0,
            nullable: false
        },
        image: {
            type: 'varchar',
            nullable: true,
            default: '/profile.jpg'
        },
        public: {
            type: 'boolean',
            default: false,
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
        reviews: {
            type: 'one-to-many',
            target: 'Review',
            cascade: true,
            inverseSide: 'product'
        },
        placements: {
            type: 'one-to-many',
            target: 'Placement',
            inverseSide: 'products',
        }
    }
});