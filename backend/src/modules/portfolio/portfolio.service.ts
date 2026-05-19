import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogService } from '../blog/blog.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto.js';
import { UpdateAboutSectionDto } from './dto/update-about-section.dto.js';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { CreateExperienceDto } from './dto/create-experience.dto.js';
import { UpdateExperienceDto } from './dto/update-experience.dto.js';
import { CreateEducationDto } from './dto/create-education.dto.js';
import { UpdateEducationDto } from './dto/update-education.dto.js';
import { CreateCertificationDto } from './dto/create-certification.dto.js';
import { UpdateCertificationDto } from './dto/update-certification.dto.js';
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
      orderBy: { order: 'asc' },
    });
  }

  async createExperience(dto: CreateExperienceDto) {
    return this.prisma.experience.create({ data: dto });
  }

  async updateExperience(id: number, dto: UpdateExperienceDto) {
    const existing = await this.prisma.experience.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Experience #${id} not found`);
    return this.prisma.experience.update({ where: { id }, data: dto });
  }

  async deleteExperience(id: number) {
    const existing = await this.prisma.experience.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Experience #${id} not found`);
    return this.prisma.experience.delete({ where: { id } });
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

  async updateEducation(id: number, dto: UpdateEducationDto) {
    const existing = await this.prisma.education.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Education #${id} not found`);
    return this.prisma.education.update({ where: { id }, data: dto });
  }

  async deleteEducation(id: number) {
    const existing = await this.prisma.education.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Education #${id} not found`);
    return this.prisma.education.delete({ where: { id } });
  }

  // ─── Certifications ───────────────────────────────────────────────────────

  async getCertifications() {
    return this.prisma.certification.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async createCertification(dto: CreateCertificationDto) {
    return this.prisma.certification.create({ data: dto });
  }

  async updateCertification(id: number, dto: UpdateCertificationDto) {
    const existing = await this.prisma.certification.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Certification #${id} not found`);
    return this.prisma.certification.update({ where: { id }, data: dto });
  }

  async deleteCertification(id: number) {
    const existing = await this.prisma.certification.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Certification #${id} not found`);
    return this.prisma.certification.delete({ where: { id } });
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

  // ─── About Section (single-row upsert) ────────────────────────────────────

  async getAboutSection() {
    let about = await this.prisma.aboutSection.findFirst();
    // Seed default content if none exists
    if (!about) {
      about = await this.prisma.aboutSection.create({
        data: {
          title: "I'm Sameer, a full-stack engineer.",
          subtitle: "I build event-driven backends and the polished interfaces that sit on top of them.",
          storyTitle: "How I got here",
          storyText: "I started writing code because I wanted to make small, useful things. That hasn't really changed — the things just got bigger.\n\nToday I work across NestJS, Next.js, and the messy parts in between: contracts, queues, deploys, and the operational story behind a product.",
          beyondTitle: "A camera, mostly.",
          beyondText: "Outside of building software, I take photos — quiet streets, light through buildings, the road. It keeps me looking at things instead of through them."
        }
      });
    }
    return about;
  }

  async updateAboutSection(dto: UpdateAboutSectionDto) {
    const existing = await this.prisma.aboutSection.findFirst();
    if (existing) {
      return this.prisma.aboutSection.update({
        where: { id: existing.id },
        data: dto,
      });
    }
    return this.prisma.aboutSection.create({ data: dto });
  }
}

