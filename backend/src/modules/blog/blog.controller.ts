import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post (admin)' })
  create(@Body() dto: CreateBlogDto, @Request() req) {
    return this.blogService.create(dto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List all blog posts (public/admin)' })
  findAll(@Query('all') all?: string) {
    return this.blogService.findAll(all !== 'true');
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured blog posts' })
  findFeatured() {
    return this.blogService.findFeatured();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all blog categories' })
  findAllCategories() {
    return this.blogService.findAllCategories();
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (admin)' })
  createCategory(@Body('name') name: string) {
    return this.blogService.createCategory(name);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a specific blog post by slug (public)' })
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOneBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}
