import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, PaymentResult } from './schemas/order.schema';
import { Model } from 'mongoose';
import { OrderIsPaidDto } from './dto/order-is-paid.dto';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = createOrderDto;
    const order = {
      orderItems,
      user: userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };
    return await this.orderModel.create(order);
  }

  async findAllOrders() {
    return await this.orderModel
      .find()
      .sort({ _id: -1 })
      .populate('user', 'id  name email');
  }

  async findAllUserOrder(userId: string) {
    return await this.orderModel.find({ user: userId }).sort({ _id: -1 });
  }

  async findSingleOrder(field, key) {
    return await this.orderModel
      .findOne({ [field]: key })
      .populate('user', 'name email');
  }

  async orderIsPaid(orderId, orderIsPaidDto) {
    const { id, status, update_time, email_address } = orderIsPaidDto;
    return await this.orderModel.findOneAndUpdate(
      { _id: orderId },
      {
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: {
          id,
          status,
          update_time,
          email_address,
        },
      },
      { runValidators: true, new: true },
    );
  }

  async orderIsDelivered(orderId) {
    return await this.orderModel.findOneAndUpdate(
      { _id: orderId },
      {
        isDelivered: true,
        deliveredAt: Date.now(),
      },
      { runValidators: true, new: true },
    );
  }
}
