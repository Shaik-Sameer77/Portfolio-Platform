import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(dto: CreateBlogDto, authorId: number) {
    const slug = dto.slug || this.generateSlug(dto.title);
    
    // Check if slug exists
    const existing = await this.prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException('A blog with this slug already exists');
    }

    const { categoryIds, ...restDto } = dto;
    return this.prisma.blog.create({
      data: {
        ...restDto,
        slug,
        authorId,
        categories: categoryIds?.length ? {
          connect: categoryIds.map(id => ({ id }))
        } : undefined,
      },
    });
  }

  async findAll(publishedOnly: boolean = true) {
    return this.prisma.blog.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findFeatured() {
    const featured = await this.prisma.blog.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
      },
    });

    if (featured.length > 0) return featured;

    // Fallback: Latest 3 published blogs
    return this.prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        categories: true,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(name: string) {
    const slug = this.generateSlug(name);
    
    // Check if category with this slug already exists
    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existing) return existing;

    return this.prisma.category.create({
      data: { name, slug },
    });
  }

  async findOneBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
      include: {
        categories: true,
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!blog) throw new NotFoundException(`Blog with slug ${slug} not found`);
    return blog;
  }

  async update(id: number, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException(`Blog #${id} not found`);

    const { categoryIds, ...restDto } = dto as any;
    const updateData: any = { ...restDto };
    if (dto.title && !dto.slug) {
      updateData.slug = this.generateSlug(dto.title);
    }
    
    if (categoryIds !== undefined) {
      updateData.categories = {
        set: categoryIds.map((id: number) => ({ id }))
      };
    }

    return this.prisma.blog.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException(`Blog #${id} not found`);

    return this.prisma.blog.delete({ where: { id } });
  }
}
