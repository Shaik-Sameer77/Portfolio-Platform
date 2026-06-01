import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
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

  // ─── Comment Services ────────────────────────────────────────────────────────

  async getCommentsForBlog(blogId: number) {
    const comments = await this.prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });

    const map = new Map<number, any>();
    const roots: any[] = [];

    for (const c of comments) {
      map.set(c.id, { ...c, replies: [] });
    }

    for (const c of comments) {
      const mapped = map.get(c.id);
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) {
          parent.replies.push(mapped);
        } else {
          roots.push(mapped);
        }
      } else {
        roots.push(mapped);
      }
    }

    return roots;
  }

  async createComment(blogId: number, userId: number, dto: any) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new NotFoundException(`Blog #${blogId} not found`);

    if (dto.parentId) {
      const parent = await this.prisma.comment.findUnique({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException(`Parent comment #${dto.parentId} not found`);
    }

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        blogId,
        userId,
        parentId: dto.parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async updateComment(commentId: number, userId: number, userRole: string, content: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException(`Comment #${commentId} not found`);

    if (comment.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You can only edit your own comments.');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async deleteComment(commentId: number, userId: number, userRole: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException(`Comment #${commentId} not found`);

    if (comment.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own comments.');
    }

    return this.prisma.comment.delete({ where: { id: commentId } });
  }

  async adminGetComments() {
    return this.prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
        blog: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });
  }
}
