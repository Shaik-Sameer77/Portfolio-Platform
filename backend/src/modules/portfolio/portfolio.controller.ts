import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { Role } from '@prisma/client';

import { PortfolioService } from './portfolio.service.js';
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


@ApiTags('Portfolio')
@Controller('portfolio')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // ─── Profile ──────────────────────────────────────────────────────────────

  @Get('profile')


  @Public()
  @ApiOperation({ summary: 'Get profile data (public)' })
  getProfile() {
    return this.portfolioService.getProfile();
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update profile data (admin)' })
  updateProfile(@Body() dto: UpdateProfileDto) {
    return this.portfolioService.updateProfile(dto);
  }

  // ─── Social Links ─────────────────────────────────────────────────────────

  @Get('social-links')


  @Public()
  @ApiOperation({ summary: 'Get social links (public)' })
  getSocialLinks() {
    return this.portfolioService.getSocialLinks();
  }

  @Patch('social-links')
  @ApiOperation({ summary: 'Update social links (admin)' })
  updateSocialLinks(@Body() dto: UpdateSocialLinksDto) {
    return this.portfolioService.updateSocialLinks(dto);
  }

  // ─── Stats ───────────────────────────────────────────────────────────────

  @Get('stats')


  @Public()
  @ApiOperation({ summary: 'List all stats (public)' })
  getStats() {
    return this.portfolioService.getStats();
  }

  @Post('stats')
  @ApiOperation({ summary: 'Add a stat (admin)' })
  createStat(@Body() dto: CreateStatDto) {
    return this.portfolioService.createStat(dto);
  }

  @Patch('stats/:id')
  @ApiOperation({ summary: 'Update a stat (admin)' })
  updateStat(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatDto,
  ) {
    return this.portfolioService.updateStat(id, dto);
  }

  @Delete('stats/:id')
  @ApiOperation({ summary: 'Remove a stat (admin)' })
  deleteStat(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.deleteStat(id);
  }



  // ─── Projects ─────────────────────────────────────────────────────────────

  @Get('projects')


  @Public()
  @ApiOperation({ summary: 'List all projects (public)' })
  getProjects() {
    return this.portfolioService.getProjects();
  }

  @Post('projects')
  @ApiOperation({ summary: 'Add a project (admin)' })
  createProject(@Body() dto: CreateProjectDto) {
    return this.portfolioService.createProject(dto);
  }

  @Patch('projects/:id')
  @ApiOperation({ summary: 'Update a project (admin)' })
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.portfolioService.updateProject(id, dto);
  }

  @Delete('projects/:id')
  @ApiOperation({ summary: 'Delete a project (admin)' })
  deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.deleteProject(id);
  }

  // ─── Experience ───────────────────────────────────────────────────────────

  @Get('experience')


  @Public()
  @ApiOperation({ summary: 'List all experience (public)' })
  getExperience() {
    return this.portfolioService.getExperience();
  }

  @Post('experience')
  @ApiOperation({ summary: 'Add an experience entry (admin)' })
  createExperience(@Body() dto: CreateExperienceDto) {
    return this.portfolioService.createExperience(dto);
  }

  @Patch('experience/:id')
  @ApiOperation({ summary: 'Update an experience entry (admin)' })
  updateExperience(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.portfolioService.updateExperience(id, dto);
  }

  @Delete('experience/:id')
  @ApiOperation({ summary: 'Delete an experience entry (admin)' })
  deleteExperience(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.deleteExperience(id);
  }

  // ─── Education ────────────────────────────────────────────────────────────

  @Get('education')


  @Public()
  @ApiOperation({ summary: 'List all education (public)' })
  getEducation() {
    return this.portfolioService.getEducation();
  }

  @Post('education')
  @ApiOperation({ summary: 'Add an education entry (admin)' })
  createEducation(@Body() dto: CreateEducationDto) {
    return this.portfolioService.createEducation(dto);
  }

  @Patch('education/:id')
  @ApiOperation({ summary: 'Update an education entry (admin)' })
  updateEducation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.portfolioService.updateEducation(id, dto);
  }

  @Delete('education/:id')
  @ApiOperation({ summary: 'Delete an education entry (admin)' })
  deleteEducation(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.deleteEducation(id);
  }

  // ─── Certifications ───────────────────────────────────────────────────────

  @Get('certifications')


  @Public()
  @ApiOperation({ summary: 'List all certifications (public)' })
  getCertifications() {
    return this.portfolioService.getCertifications();
  }

  @Post('certifications')
  @ApiOperation({ summary: 'Add a certification (admin)' })
  createCertification(@Body() dto: CreateCertificationDto) {
    return this.portfolioService.createCertification(dto);
  }

  @Patch('certifications/:id')
  @ApiOperation({ summary: 'Update a certification (admin)' })
  updateCertification(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCertificationDto,
  ) {
    return this.portfolioService.updateCertification(id, dto);
  }

  @Delete('certifications/:id')
  @ApiOperation({ summary: 'Delete a certification (admin)' })
  deleteCertification(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.deleteCertification(id);
  }

  // ─── Services ─────────────────────────────────────────────────────────────

  @Get('services')


  @Public()
  @ApiOperation({ summary: 'List all services (public)' })
  getServices() {
    return this.portfolioService.getServices();
  }

  @Post('services')
  @ApiOperation({ summary: 'Add a service (admin)' })
  createService(@Body() dto: CreateServiceDto) {
    return this.portfolioService.createService(dto);
  }

  @Patch('services/:id')
  @ApiOperation({ summary: 'Update a service (admin)' })
  updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.portfolioService.updateService(id, dto);
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Delete a service (admin)' })
  deleteService(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.deleteService(id);
  }

  // ─── Developer Tools ──────────────────────────────────────────────────────

  @Get('developer-tools')


  @Public()
  @ApiOperation({ summary: 'List all developer tools (public)' })
  getDeveloperTools() {
    return this.portfolioService.getDeveloperTools();
  }

  @Post('developer-tools')
  @ApiOperation({ summary: 'Add a developer tool (admin)' })
  createDeveloperTool(@Body() dto: CreateDeveloperToolDto) {
    return this.portfolioService.createDeveloperTool(dto);
  }

  @Patch('developer-tools/:id')
  @ApiOperation({ summary: 'Update a developer tool (admin)' })
  updateDeveloperTool(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeveloperToolDto,
  ) {
    return this.portfolioService.updateDeveloperTool(id, dto);
  }

  @Delete('developer-tools/:id')
  @ApiOperation({ summary: 'Delete a developer tool (admin)' })
  deleteDeveloperTool(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.deleteDeveloperTool(id);
  }

  // ─── Uses Items ───────────────────────────────────────────────────────────

  @Get('uses-items')


  @Public()
  @ApiOperation({ summary: 'List all uses items (public)' })
  getUsesItems() {
    return this.portfolioService.getUsesItems();
  }

  @Post('uses-items')
  @ApiOperation({ summary: 'Add a uses item (admin)' })
  createUsesItem(@Body() dto: CreateUsesItemDto) {
    return this.portfolioService.createUsesItem(dto);
  }

  @Patch('uses-items/:id')
  @ApiOperation({ summary: 'Update a uses item (admin)' })
  updateUsesItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsesItemDto,
  ) {
    return this.portfolioService.updateUsesItem(id, dto);
  }

  @Delete('uses-items/:id')
  @ApiOperation({ summary: 'Delete a uses item (admin)' })
  deleteUsesItem(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.deleteUsesItem(id);
  }

  // ─── Gallery Photos ───────────────────────────────────────────────────────

  @Get('gallery-photos')


  @Public()
  @ApiOperation({ summary: 'List all gallery photos (public)' })
  getGalleryPhotos() {
    return this.portfolioService.getGalleryPhotos();
  }

  @Post('gallery-photos')
  @ApiOperation({ summary: 'Add a gallery photo (admin)' })
  createGalleryPhoto(@Body() dto: CreateGalleryPhotoDto) {
    return this.portfolioService.createGalleryPhoto(dto);
  }

  @Patch('gallery-photos/:id')
  @ApiOperation({ summary: 'Update a gallery photo (admin)' })
  updateGalleryPhoto(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGalleryPhotoDto,
  ) {
    return this.portfolioService.updateGalleryPhoto(id, dto);
  }

  @Delete('gallery-photos/:id')
  @ApiOperation({ summary: 'Delete a gallery photo (admin)' })
  deleteGalleryPhoto(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.deleteGalleryPhoto(id);
  }

  // ─── Tech Stack ───────────────────────────────────────────────────────────

  @Get('tech-stack')


  @Public()
  @ApiOperation({ summary: 'List all tech stack items (public)' })
  getTechStack() {
    return this.portfolioService.getTechStack();
  }

  @Post('tech-stack')
  @ApiOperation({ summary: 'Add a tech stack item (admin)' })
  createTechStack(@Body() dto: CreateTechStackDto) {
    return this.portfolioService.createTechStack(dto);
  }

  @Patch('tech-stack/:id')
  @ApiOperation({ summary: 'Update a tech stack item (admin)' })
  updateTechStack(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTechStackDto,
  ) {
    return this.portfolioService.updateTechStack(id, dto);
  }

  @Delete('tech-stack/:id')
  @ApiOperation({ summary: 'Delete a tech stack item (admin)' })
  deleteTechStack(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.deleteTechStack(id);
  }

  // ─── About Section ────────────────────────────────────────────────────────

  @Get('about-section')


  @Public()
  @ApiOperation({ summary: 'Get about section data (public)' })
  getAboutSection() {
    return this.portfolioService.getAboutSection();
  }

  @Patch('about-section')
  @ApiOperation({ summary: 'Update about section data (admin)' })
  updateAboutSection(@Body() dto: UpdateAboutSectionDto) {
    return this.portfolioService.updateAboutSection(dto);
  }
}

