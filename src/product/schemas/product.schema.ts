import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Review {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;

  //
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user: User;
}

const ReviewSchema = SchemaFactory.createForClass(Review);

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ required: true })
  name: string;

  //
  @Prop()
  image: string;

  @Prop({ required: true })
  description: string;

  //
  @Prop({ type: [{ type: ReviewSchema, ref: 'Review' }] })
  reviews: Review[];

  @Prop({ required: true, default: 0 })
  rating: number;

  @Prop({ required: true, default: 0 })
  numOfReviews: number;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ required: true, default: 0 })
  countInStock: number;
}

const ProductSchema = SchemaFactory.createForClass(Product);

export { ProductSchema, ReviewSchema };
