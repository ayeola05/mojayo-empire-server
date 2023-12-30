import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OrderItem } from './schemas/order.schema';
import { ProductService } from 'src/product/product.service';
import mongoose from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { OrderIsPaidDto } from './dto/order-is-paid.dto';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
  //   const productIds = createOrderDto.orderItems.map(
  //     (item) => new mongoose.Types.ObjectId(item.product),
  //   );
  //   const availableProducts = productIds.forEach(async (productId) => {
  //     const product = await this.productService.findOneProduct(
  //       '_id',
  //       productId,
  //     );

  //     createOrderDto.orderItems.forEach(async (item) => {
  //       if (item.quantity > product.countInStock) {
  //         return;
  //       } else {
  //         if (createOrderDto.orderItems) {
  //           return await this.orderService.createOrder(
  //             req.user._id,
  //             createOrderDto,
  //           );
  //         }
  //       }

  //       throw new BadRequestException('No order items');
  //     });
  //   });
  // }

  //CREATE ORDER
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    if (createOrderDto.orderItems) {
      return await this.orderService.createOrder(req.user._id, createOrderDto);
    }
    throw new BadRequestException('No order items');
  }

  //ADMIN GET ALL ORDERS
  //TODO PROTECT WITH ADMIN ROLE
  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll(@Request() req) {
    return this.orderService.findAllOrders();
  }

  //USER GETTING HIS/HER ORDERS
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllUserOrder(@Request() req) {
    return await this.orderService.findAllUserOrder(req.user._id);
  }

  //GET ORDER BY ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findSingleOrder(@Param('id') _id: string) {
    return await this.orderService.findSingleOrder('_id', _id);
  }

  //ORDER IS PAID
  //TODO RECHECK ROUTE MIGHT HaVE TO PROTECT WITH ADMIN ROLE
  @UseGuards(JwtAuthGuard)
  @Patch(':id/pay')
  async orderIsPaid(
    @Param('id') _id: string,
    @Body() orderIsPaidDto: OrderIsPaidDto,
  ) {
    const order = await this.orderService.findSingleOrder('_id', _id);
    if (order) {
      return this.orderService.orderIsPaid(order._id, orderIsPaidDto);
    }
    throw new BadRequestException('Order not found');
  }

  //ORDER IS PAID AND DELIVERED
  @UseGuards(JwtAuthGuard)
  @Patch(':id/delivered')
  async orderIsDelivered(@Param('id') _id: string) {
    const order = await this.orderService.findSingleOrder('_id', _id);

    if (order) {
      return await this.orderService.orderIsDelivered(order._id);
    }
    throw new BadRequestException('Order not found');
  }
}
