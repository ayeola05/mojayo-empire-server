import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //ADD PRODUCT ROUTE
  //TODO PROTECT WITH ADMIN ROLE
  @Post('addProduct')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const productExists = await this.productService.findOneProduct(
      'name',
      createProductDto.name,
    );
    if (productExists) {
      throw new BadRequestException('Product name already exists');
    }
    const product = this.productService.create(createProductDto);

    if (product) {
      return product;
    }

    throw new BadRequestException('Invalid product data');
  }

  //GET ALL PRODUCTS(USERS)
  //TODO {Paginate and FindByKeyword}
  @Get('getProducts')
  async findAllProducts() {
    return await this.productService.findAllProducts();
  }

  //GET ALL PRODUCTS(ADMIN)
  //TODO {Admin to get all products without search and pagination}
  @Get('adminGetAllProducts')
  async findAllAdminProducts() {
    return await this.productService.findAllProducts();
  }

  //PRODUCT REVIEW
  @UseGuards(JwtAuthGuard)
  @Post(':id/review')
  async productReview(
    @Body() createReviewDto: CreateReviewDto,
    @Param('id') _id: string,
    @Request() req,
  ) {
    //TODO a user cannot review a product unless he has purchased it

    const product = await this.productService.findOneProduct('_id', _id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString(),
      );
      if (alreadyReviewed) {
        throw new BadRequestException('Product already Reviewed');
      }

      const reviewedProduct = await this.productService.createProductReview(
        _id,
        {
          ...createReviewDto,
          name: req.user.name,
          user: req.user._id,
        },
      );

      if (reviewedProduct) {
        const rating =
          reviewedProduct.reviews.reduce((acc, item) => item.rating + acc, 0) /
          reviewedProduct.reviews.length;

        return await this.productService.updateProductRating(_id, rating);
      }
    }

    throw new BadRequestException('Product not found');
  }

  // GET SINGLE PRODUCT
  @Get(':id')
  async findOne(@Param('id') _id: string) {
    const product = await this.productService.findOneProduct('_id', _id);
    if (product) {
      return product;
    }
    throw new BadRequestException('Product not found');
  }

  //DELETE PRODUCT
  //TODO protect with admin role
  @Delete(':id')
  async remove(@Param('id') _id: string) {
    const product = await this.productService.findOneProduct('_id', _id);
    if (product) {
      return await this.productService.deleteProduct(_id);
    }
    throw new BadRequestException('Product not found');
  }

  //UPDATE PRODUCT
  //TODO PROTECT WITH ADMIN ROUTE
  @Patch(':id')
  async update(
    @Param('id') _id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.findOneProduct('_id', _id);
    if (product) {
      return await this.productService.updateProduct(_id, updateProductDto);
    }
    throw new BadRequestException('Product not found');
  }
}
