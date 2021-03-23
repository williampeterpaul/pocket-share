import User, { UserSchema } from './User';
import Pocket, { PocketSchema } from './Pocket';
import Product, { ProductSchema } from './Product';
import Placement, { PlacementSchema } from './Placement';
import Like, { LikeSchema } from './Like';
import Review, { ReviewSchema } from './Review';
import Comment, { CommentSchema } from './Comment';

export default {
    Placement: {
        model: Placement,
        schema: PlacementSchema
    },
    Product: {
        model: Product,
        schema: ProductSchema
    },
    Pocket: {
        model: Pocket,
        schema: PocketSchema
    },
    User: {
        model: User,
        schema: UserSchema
    },
    Like: {
        model: Like,
        schema: LikeSchema
    },
    Comment: {
        model: Comment,
        schema: CommentSchema
    },
    Review: {
        model: Review,
        schema: ReviewSchema
    },
}
