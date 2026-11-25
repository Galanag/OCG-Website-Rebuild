import type { Prisma, UserStatus } from "../generated/prisma/client.js";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/errors.js";
import { hashPassword, revokeUserSessions } from "./auth.service.js";
import type { z } from "zod";
import type { userCreateSchema, userUpdateSchema, roleCreateSchema } from "../validators/auth.js";

const userInclude = {
  roles: { select: { role: { select: { id: true, name: true, description: true, permissions: true } } } },
} as const;

export async function listUsers(params: { page: number; limit: number; skip: number; take: number; q?: string }) {
  const where: Prisma.UserWhereInput = { deletedAt: null };
  if (params.q) {
    where.OR = [
      { name: { contains: params.q } },
      { email: { contains: params.q } },
    ];
  }
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, status: true, mustChangePassword: true, lastLoginAt: true, createdAt: true, roles: userInclude.roles },
      orderBy: { createdAt: "desc" }, skip: params.skip, take: params.take,
    }),
    prisma.user.count({ where }),
  ]);
  return { items, total };
}

export async function getUser(id: string) {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, name: true, email: true, status: true, mustChangePassword: true, lastLoginAt: true, createdAt: true, roles: userInclude.roles },
  });
  if (!user) throw new ApiError(404, "User not found.", undefined, "USER_NOT_FOUND");
  return user;
}

export async function createUser(data: z.infer<typeof userCreateSchema>, currentUserId: string) {
  const roles = data.roleIds?.length
    ? await prisma.role.findMany({ where: { id: { in: data.roleIds } }, select: { id: true } })
    : await prisma.role.findMany({ where: { name: "ADMINISTRATOR" }, select: { id: true } });
  if (roles.length !== (data.roleIds?.length || 1)) throw new ApiError(400, "One or more roles do not exist.");
  const passwordHash = await hashPassword(data.password);
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: data.name, email: data.email.toLowerCase(), passwordHash, mustChangePassword: true,
        createdById: currentUserId, updatedById: currentUserId,
        roles: { create: roles.map((role) => ({ roleId: role.id })) },
      },
      select: { id: true, name: true, email: true, status: true, mustChangePassword: true, roles: { select: { role: { select: { id: true, name: true } } } } },
    });
    return user;
  });
}

export async function updateUser(id: string, data: z.infer<typeof userUpdateSchema>, currentUserId: string) {
  const existing = await prisma.user.findFirst({ where: { id, deletedAt: null }, select: { id: true, status: true } });
  if (!existing) throw new ApiError(404, "User not found.", undefined, "USER_NOT_FOUND");
  return prisma.$transaction(async (tx) => {
    if (data.roleIds) {
      await tx.userRole.deleteMany({ where: { userId: id } });
      const roles = await tx.role.findMany({ where: { id: { in: data.roleIds } }, select: { id: true } });
      if (roles.length !== data.roleIds.length) throw new ApiError(400, "One or more roles do not exist.");
      await tx.userRole.createMany({ data: roles.map((role) => ({ userId: id, roleId: role.id })), skipDuplicates: true });
    }
    const user = await tx.user.update({
      where: { id },
      data: {
        name: data.name,
        status: data.status as UserStatus | undefined,
        mustChangePassword: data.mustChangePassword,
        updatedById: currentUserId,
      },
      select: { id: true, name: true, email: true, status: true, mustChangePassword: true, roles: { select: { role: { select: { id: true, name: true } } } } },
    });
    if (data.status === "SUSPENDED") await tx.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    return user;
  });
}

export async function deleteUser(id: string, currentUserId: string) {
  const user = await prisma.user.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!user) throw new ApiError(404, "User not found.", undefined, "USER_NOT_FOUND");
  if (id === currentUserId) throw new ApiError(400, "You cannot delete your own account.");
  await prisma.$transaction([
    prisma.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } }),
    prisma.user.update({ where: { id }, data: { deletedAt: new Date(), status: "SUSPENDED", updatedById: currentUserId } }),
  ]);
  return { id };
}

export async function resetUserPassword(id: string, password: string, currentUserId: string) {
  const user = await prisma.user.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
  if (!user) throw new ApiError(404, "User not found.", undefined, "USER_NOT_FOUND");
  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id }, data: { passwordHash, mustChangePassword: true, updatedById: currentUserId } }),
    prisma.session.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } }),
  ]);
  return { id };
}

export async function listRoles() {
  return prisma.role.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { users: true } } } });
}

export async function createRole(data: z.infer<typeof roleCreateSchema>) {
  return prisma.role.create({ data: { name: data.name, description: data.description, permissions: data.permissions } });
}

export async function updateSettings(key: string, value: unknown, userId: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value: value as Prisma.InputJsonValue, updatedById: userId },
    create: { key, value: value as Prisma.InputJsonValue, updatedById: userId },
  });
}

export async function listSettings() {
  return prisma.siteSetting.findMany({ orderBy: { key: "asc" }, include: { updatedBy: { select: { id: true, name: true } } } });
}

export async function publicSettings() {
  const settings = await prisma.siteSetting.findMany({ where: { key: { in: ["site.name", "site.contactEmail", "site.address", "site.tagline", "site.social"] } } });
  return Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
}

export async function listAuditLogs(params: { page: number; limit: number; skip: number; take: number; q?: string; action?: string }) {
  const where: Prisma.AuditLogWhereInput = {};
  if (params.action) where.action = { contains: params.action };
  if (params.q) {
    where.OR = [
      { action: { contains: params.q } },
      { entityType: { contains: params.q } },
      { userEmail: { contains: params.q } },
    ];
  }
  const [items, total] = await prisma.$transaction([
    prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: params.skip, take: params.take }),
    prisma.auditLog.count({ where }),
  ]);
  return { items, total };
}

export async function publicStats() {
  const now = new Date();
  const expiring = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const activeAnnouncementWhere: Prisma.AnnouncementWhereInput = {
    published: true,
    deletedAt: null,
    OR: [
      { deadline: null, submissionDeadline: null },
      { deadline: { gte: now } },
      { submissionDeadline: { gte: now } },
    ],
  };
  const expiringAnnouncementWhere: Prisma.AnnouncementWhereInput = {
    published: true,
    deletedAt: null,
    AND: [{
      OR: [
        { deadline: { gte: now, lte: expiring } },
        { submissionDeadline: { gte: now, lte: expiring } },
      ],
    }],
  };
  const [
    projects, projectStatuses, announcements, announcementCategories, news, events,
    activeVacancies, openTenders, expiringAnnouncements,
  ] = await Promise.all([
    prisma.project.count({ where: { published: true, deletedAt: null } }),
    prisma.project.groupBy({ by: ["status"], where: { published: true, deletedAt: null }, _count: { _all: true } }),
    prisma.announcement.count({ where: { published: true, deletedAt: null } }),
    prisma.announcement.groupBy({ by: ["category"], where: { published: true, deletedAt: null }, _count: { _all: true } }),
    prisma.newsArticle.count({ where: { published: true, deletedAt: null } }),
    prisma.event.count({ where: { published: true, deletedAt: null, startsAt: { gte: new Date() } } }),
    prisma.announcement.count({ where: { ...activeAnnouncementWhere, category: "JOB_VACANCY" } }),
    prisma.announcement.count({ where: { ...activeAnnouncementWhere, category: "BID_TENDER" } }),
    prisma.announcement.count({ where: expiringAnnouncementWhere }),
  ]);
  const projectCounts = Object.fromEntries(projectStatuses.map((item) => [item.status, item._count._all]));
  const announcementCounts = Object.fromEntries(announcementCategories.map((item) => [item.category, item._count._all]));
  return {
    projects: {
      total: projects,
      proposed: projectCounts.PROPOSED || 0,
      planning: projectCounts.PLANNING || 0,
      tendering: projectCounts.TENDERING || 0,
      awarded: projectCounts.AWARDED || 0,
      started: projectCounts.STARTED || 0,
      ongoing: projectCounts.ONGOING || 0,
      completed: projectCounts.COMPLETED || 0,
      onHold: projectCounts.ON_HOLD || 0,
      cancelled: projectCounts.CANCELLED || 0,
    },
    announcements: {
      published: announcements,
      vacancies: announcementCounts.JOB_VACANCY || 0,
      tenders: announcementCounts.BID_TENDER || 0,
      activeVacancies,
      openTenders,
      expiring: expiringAnnouncements,
    },
    news: { published: news },
    events: { upcoming: events },
  };
}

export async function stats() {
  const now = new Date();
  const expiring = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const activeAnnouncementWhere: Prisma.AnnouncementWhereInput = {
    published: true,
    deletedAt: null,
    OR: [
      { deadline: null, submissionDeadline: null },
      { deadline: { gte: now } },
      { submissionDeadline: { gte: now } },
    ],
  };
  const expiringAnnouncementWhere: Prisma.AnnouncementWhereInput = {
    published: true,
    deletedAt: null,
    AND: [{
      OR: [
        { deadline: { gte: now, lte: expiring } },
        { submissionDeadline: { gte: now, lte: expiring } },
      ],
    }],
  };
  const [
    totalProjects, projectStatuses, announcementCategories, publishedAnnouncements,
    publishedNews, draftNews, upcomingEvents, recentMedia, contactSubmissions,
    partnershipSubmissions, surveySubmissions, pendingSubmissions, recentAudit,
    activeVacancies, openTenders, expiringAnnouncements,
  ] = await Promise.all([
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.project.groupBy({ by: ["status"], where: { deletedAt: null }, _count: { _all: true } }),
    prisma.announcement.groupBy({ by: ["category"], where: { deletedAt: null }, _count: { _all: true } }),
    prisma.announcement.count({ where: { published: true, deletedAt: null } }),
    prisma.newsArticle.count({ where: { published: true, deletedAt: null } }),
    prisma.newsArticle.count({ where: { published: false, deletedAt: null } }),
    prisma.event.count({ where: { published: true, deletedAt: null, startsAt: { gte: new Date() } } }),
    prisma.mediaAsset.count({ where: { deletedAt: null } }),
    prisma.contactSubmission.count(),
    prisma.partnershipSubmission.count(),
    prisma.surveySubmission.count(),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.announcement.count({ where: { ...activeAnnouncementWhere, category: "JOB_VACANCY" } }),
    prisma.announcement.count({ where: { ...activeAnnouncementWhere, category: "BID_TENDER" } }),
    prisma.announcement.count({ where: expiringAnnouncementWhere }),
  ]);
  const projects = Object.fromEntries(projectStatuses.map((item) => [item.status, item._count._all]));
  const announcements = Object.fromEntries(announcementCategories.map((item) => [item.category, item._count._all]));
  return {
    projects: {
      total: totalProjects,
      proposed: projects.PROPOSED || 0,
      planning: projects.PLANNING || 0,
      tendering: projects.TENDERING || 0,
      awarded: projects.AWARDED || 0,
      started: projects.STARTED || 0,
      ongoing: projects.ONGOING || 0,
      completed: projects.COMPLETED || 0,
      onHold: projects.ON_HOLD || 0,
      cancelled: projects.CANCELLED || 0,
    },
    announcements: {
      published: publishedAnnouncements,
      vacancies: announcements.JOB_VACANCY || 0,
      tenders: announcements.BID_TENDER || 0,
      procurement: announcements.PROCUREMENT_NOTICE || 0,
      general: announcements.GENERAL_NOTICE || 0,
      training: announcements.TRAINING || 0,
      activeVacancies,
      openTenders,
      expiring: expiringAnnouncements,
    },
    content: {
      publishedNews,
      draftNews,
      upcomingEvents,
      recentMedia,
      contactSubmissions,
      partnershipSubmissions,
      surveySubmissions,
      pendingSubmissions,
    },
    recentAudit,
  };
}