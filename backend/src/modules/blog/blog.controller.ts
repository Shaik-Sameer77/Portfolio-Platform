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
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (admin)' })
  createCategory(@Body('name') name: string) {
    return this.blogService.createCategory(name);
  }

  @Get('comments/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all comments for admin moderation' })
  adminGetComments(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Admin access only.');
    }
    return this.blogService.adminGetComments();
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments tree for a blog post (public)' })
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getCommentsForBlog(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a comment or reply to a blog post (auth)' })
  createComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCommentDto,
    @Request() req,
  ) {
    return this.blogService.createComment(id, req.user.userId, dto);
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment (auth)' })
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
    @Request() req,
  ) {
    return this.blogService.updateComment(id, req.user.userId, req.user.role, content);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment (auth/admin)' })
  deleteComment(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.blogService.deleteComment(id, req.user.userId, req.user.role);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a specific blog post by slug (public)' })
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOneBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post (admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}
