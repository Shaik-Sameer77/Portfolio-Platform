import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogService } from '../blog/blog.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto.js';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { CreateExperienceDto } from './dto/create-experience.dto.js';
import { CreateEducationDto } from './dto/create-education.dto.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { CreateDeveloperToolDto } from './dto/create-developer-tool.dto.js';
import { UpdateDeveloperToolDto } from './dto/update-developer-tool.dto.js';
import { CreateUsesItemDto } from './dto/create-uses-item.dto.js';
import { UpdateUsesItemDto } from './dto/update-uses-item.dto.js';
import { CreateGalleryPhotoDto } from './dto/create-gallery-photo.dto.js';
import { UpdateGalleryPhotoDto } from './dto/update-gallery-photo.dto.js';
import { CreateStatDto } from './dto/create-stat.dto.js';
import { UpdateStatDto } from './dto/update-stat.dto.js';
import { CreateTechStackDto } from './dto/create-tech-stack.dto.js';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto.js';


@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blogService: BlogService,
  ) {}

  // ─── Profile (single-row upsert) ──────────────────────────────────────────

  async getProfile() {
    const profile = await this.prisma.profile.findFirst();
    const featuredBlogs = await this.blogService.findFeatured();
    
    return {
      ...profile,
      featuredBlogs,
    };
  }

  async updateProfile(dto: UpdateProfileDto) {
    const existing = await this.prisma.profile.findFirst();

    if (existing) {
      return this.prisma.profile.update({
        where: { id: existing.id },
        data: dto,
      });
    }

    return this.prisma.profile.create({ data: dto as any });
  }

  // ─── Social Links (single-row upsert) ─────────────────────────────────────

  async getSocialLinks() {
    return this.prisma.socialLinks.findFirst();
  }

  async updateSocialLinks(dto: UpdateSocialLinksDto) {
    const existing = await this.prisma.socialLinks.findFirst();

    if (existing) {
      return this.prisma.socialLinks.update({
        where: { id: existing.id },
        data: dto,
      });
    }

    return this.prisma.socialLinks.create({ data: dto });
  }

  // ─── Stats ───────────────────────────────────────────────────────────────

  async getStats() {
    return this.prisma.stat.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async createStat(dto: CreateStatDto) {
    return this.prisma.stat.create({ data: dto });
  }

  async updateStat(id: number, dto: UpdateStatDto) {
    const existing = await this.prisma.stat.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Stat #${id} not found`);
    return this.prisma.stat.update({ where: { id }, data: dto });
  }

  async deleteStat(id: number) {
    const existing = await this.prisma.stat.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Stat #${id} not found`);
    return this.prisma.stat.delete({ where: { id } });
  }



  // ─── Projects ─────────────────────────────────────────────────────────────

  async getProjects() {
    return this.prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    });
  }

  async createProject(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto });
  }

  async updateProject(id: number, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Project #${id} not found`);
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async deleteProject(id: number) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Project #${id} not found`);
    return this.prisma.project.delete({ where: { id } });
  }

  // ─── Experience ───────────────────────────────────────────────────────────

  async getExperience() {
    return this.prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  async createExperience(dto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  // ─── Education ────────────────────────────────────────────────────────────

  async getEducation() {
    return this.prisma.education.findMany({
      orderBy: { startYear: 'desc' },
    });
  }

  async createEducation(dto: CreateEducationDto) {
    return this.prisma.education.create({ data: dto });
  }

  // ─── Services ─────────────────────────────────────────────────────────────

  async getServices() {
    return this.prisma.service.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    });
  }

  async createService(dto: CreateServiceDto) {
    return this.prisma.service.create({ data: dto });
  }

  async updateService(id: number, dto: UpdateServiceDto) {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Service #${id} not found`);
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  async deleteService(id: number) {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Service #${id} not found`);
    return this.prisma.service.delete({ where: { id } });
  }

  // ─── Developer Tools ──────────────────────────────────────────────────────

  async getDeveloperTools() {
    return this.prisma.developerTool.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
  }

  async createDeveloperTool(dto: CreateDeveloperToolDto) {
    return this.prisma.developerTool.create({ data: dto });
  }

  async updateDeveloperTool(id: number, dto: UpdateDeveloperToolDto) {
    const existing = await this.prisma.developerTool.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`DeveloperTool #${id} not found`);
    return this.prisma.developerTool.update({ where: { id }, data: dto });
  }

  async deleteDeveloperTool(id: number) {
    const existing = await this.prisma.developerTool.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`DeveloperTool #${id} not found`);
    return this.prisma.developerTool.delete({ where: { id } });
  }

  // ─── Uses Items ───────────────────────────────────────────────────────────

  async getUsesItems() {
    return this.prisma.usesItem.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
  }

  async createUsesItem(dto: CreateUsesItemDto) {
    return this.prisma.usesItem.create({ data: dto });
  }

  async updateUsesItem(id: number, dto: UpdateUsesItemDto) {
    const existing = await this.prisma.usesItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`UsesItem #${id} not found`);
    return this.prisma.usesItem.update({ where: { id }, data: dto });
  }

  async deleteUsesItem(id: number) {
    const existing = await this.prisma.usesItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`UsesItem #${id} not found`);
    return this.prisma.usesItem.delete({ where: { id } });
  }

  // ─── Gallery Photos ───────────────────────────────────────────────────────

  async getGalleryPhotos() {
    return this.prisma.galleryPhoto.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    });
  }

  async createGalleryPhoto(dto: CreateGalleryPhotoDto) {
    return this.prisma.galleryPhoto.create({
      data: {
        ...dto,
        takenAt: dto.takenAt ? new Date(dto.takenAt) : null,
      },
    });
  }

  async updateGalleryPhoto(id: number, dto: UpdateGalleryPhotoDto) {
    const existing = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`GalleryPhoto #${id} not found`);
    return this.prisma.galleryPhoto.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.takenAt !== undefined ? { takenAt: dto.takenAt ? new Date(dto.takenAt) : null } : {}),
      },
    });
  }

  async deleteGalleryPhoto(id: number) {
    const existing = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`GalleryPhoto #${id} not found`);
    return this.prisma.galleryPhoto.delete({ where: { id } });
  }

  // ─── Tech Stack ───────────────────────────────────────────────────────────

  async getTechStack() {
    return this.prisma.techStack.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async createTechStack(dto: CreateTechStackDto) {
    return this.prisma.techStack.create({ data: dto });
  }

  async updateTechStack(id: number, dto: UpdateTechStackDto) {
    const existing = await this.prisma.techStack.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`TechStack #${id} not found`);
    return this.prisma.techStack.update({ where: { id }, data: dto });
  }

  async deleteTechStack(id: number) {
    const existing = await this.prisma.techStack.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`TechStack #${id} not found`);
    return this.prisma.techStack.delete({ where: { id } });
  }
}

