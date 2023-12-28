import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return await this.productModel.create(createProductDto);
  }

  async findAllProducts() {
    return await this.productModel.find();
  }

  async findOneProduct(field, key) {
    return await this.productModel.findOne({ [field]: key });
  }

  async createProductReview(
    productId: string,
    updateReviewDto: UpdateReviewDto,
  ) {
    console.log(updateReviewDto);
    return await this.productModel.findOneAndUpdate(
      { _id: productId },
      {
        $push: {
          reviews: updateReviewDto,
        },
        $inc: { numOfReviews: 1 },
      },
      { runValidators: true, new: true },
    );
  }

  async updateProductRating(productId: string, rating: number) {
    return await this.productModel.findOneAndUpdate(
      { _id: productId },
      { $set: { rating: rating } },
      { runValidators: true, new: true },
    );
  }

  async deleteProduct(_id: string) {
    return await this.productModel.findByIdAndDelete(_id);
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto) {
    return await this.productModel.findOneAndUpdate(
      { _id: productId },
      {
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        image: updateProductDto.image,
        countInStock: updateProductDto.countInStock,
      },
      { new: true },
    );
  }
}
