import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';
import { User } from 'src/user/schemas/user.schema';

//ORDER ITEMS SCHEMA
@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  })
  product: Product;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

//SHIPPING ADDRESS SCHEMA
@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;
}

const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

@Schema({ _id: false })
export class PaymentResult {
  @Prop()
  id: string;

  @Prop()
  status: string;

  @Prop()
  update_time: string;

  @Prop()
  email_address: string;
}

const PaymentResultSchema = SchemaFactory.createForClass(PaymentResult);

//ORDER SCHEMA
@Schema({
  timestamps: true,
})
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user: User;

  @Prop({ type: [{ type: OrderItemSchema, ref: 'OrderItem' }] })
  orderItems: OrderItem[];

  @Prop({ type: ShippingAddressSchema, ref: 'ShippingAddress' })
  shippingAddress: ShippingAddress;

  //TODO: SET A DEFAULT TYPE TO YOUR DEFAULT PAYMENT TYPE
  @Prop({ required: true })
  paymentMethod: string;

  @Prop({ type: PaymentResultSchema, ref: 'PaymentResult' })
  paymentResult: PaymentResult;

  @Prop({ required: true, default: 0.0 })
  taxPrice: number;

  @Prop({ required: true, default: 0.0 })
  shippingPrice: number;

  @Prop({ required: true, default: 0.0 })
  totalPrice: number;

  @Prop({ required: true, default: false })
  isPaid: boolean;

  @Prop()
  paidAt: Date;

  @Prop({ required: true, default: false })
  isDelivered: boolean;

  @Prop()
  deliveredAt: Date;
}

const OrderSchema = SchemaFactory.createForClass(Order);

export { OrderSchema };
