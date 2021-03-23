import { EntitySchema } from "typeorm";
import User from './User'
import Pocket from './Pocket'
import Product from './Product'

export default interface Placement {
    id: number;
    x: Number;
    y: Number;
    user: User;
    pocket: Pocket;
    product: Product;
    createdAt: any;
    updatedAt: any;
}

export default class Placement { }

export const PlacementSchema = new EntitySchema<Placement>({
    name: 'Placement',
    target: Placement,
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        x: {
            type: 'float',
            nullable: false
        },
        y: {
            type: 'float',
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
            inverseSide: 'placements',
        },
        pocket: {
            type: 'many-to-one',
            target: 'Pocket',
            inverseSide: 'placements',
        },
        product: {
            type: 'many-to-one',
            target: 'Product',
            eager: true,
            cascade: true,
            inverseSide: 'placements'
        }
    }
});