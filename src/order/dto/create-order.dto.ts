import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  readonly orderItems: [
    {
      name: string;
      quantity: number;
      image: string;
      price: number;
      product: string;
    },
  ];

  @IsObject()
  @IsNotEmpty()
  readonly shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };

  @IsString()
  @IsNotEmpty()
  readonly paymentMethod: string;

  @IsNotEmpty()
  @IsNumber()
  readonly itemsPrice: number;

  @IsNotEmpty()
  @IsNumber()
  readonly taxPrice: number;

  @IsNotEmpty()
  @IsNumber()
  readonly shippingPrice: number;

  @IsNotEmpty()
  @IsNumber()
  readonly totalPrice: number;
}
