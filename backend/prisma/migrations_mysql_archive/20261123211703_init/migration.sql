-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `status` ENUM('ACTIVE', 'SUSPENDED', 'INVITED') NOT NULL DEFAULT 'ACTIVE',
    `mustChangePassword` BOOLEAN NOT NULL DEFAULT false,
    `lastLoginAt` DATETIME(3) NULL,
    `createdById` VARCHAR(36) NULL,
    `updatedById` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_status_deletedAt_idx`(`status`, `deletedAt`),
    INDEX `User_createdById_idx`(`createdById`),
    INDEX `User_updatedById_idx`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `permissions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `roleId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserRole_roleId_idx`(`roleId`),
    UNIQUE INDEX `UserRole_userId_roleId_key`(`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `tokenHash` VARCHAR(64) NOT NULL,
    `csrfTokenHash` VARCHAR(64) NOT NULL,
    `userAgent` VARCHAR(500) NOT NULL,
    `ipAddress` VARCHAR(45) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_tokenHash_key`(`tokenHash`),
    INDEX `Session_userId_expiresAt_idx`(`userId`, `expiresAt`),
    INDEX `Session_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `tokenHash` VARCHAR(64) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordResetToken_tokenHash_key`(`tokenHash`),
    INDEX `PasswordResetToken_userId_expiresAt_idx`(`userId`, `expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(36) NOT NULL,
    `reference` VARCHAR(80) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `shortDescription` VARCHAR(600) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `category` VARCHAR(120) NOT NULL,
    `constructionSector` VARCHAR(120) NOT NULL,
    `client` VARCHAR(200) NULL,
    `contractor` VARCHAR(200) NULL,
    `consultant` VARCHAR(200) NULL,
    `location` VARCHAR(200) NOT NULL,
    `region` VARCHAR(120) NULL,
    `country` VARCHAR(100) NOT NULL DEFAULT 'Ethiopia',
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `contractValue` DECIMAL(18, 2) NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'ETB',
    `fundingSource` VARCHAR(200) NULL,
    `contractType` VARCHAR(120) NULL,
    `startDate` DATETIME(3) NULL,
    `plannedCompletionDate` DATETIME(3) NULL,
    `actualCompletionDate` DATETIME(3) NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `financialProgress` DOUBLE NULL,
    `projectManager` VARCHAR(160) NULL,
    `coverImageId` VARCHAR(36) NULL,
    `status` ENUM('PROPOSED', 'PLANNING', 'TENDERING', 'AWARDED', 'STARTED', 'ONGOING', 'ON_HOLD', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PROPOSED',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `createdById` VARCHAR(36) NULL,
    `updatedById` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Project_reference_key`(`reference`),
    UNIQUE INDEX `Project_slug_key`(`slug`),
    INDEX `Project_published_deletedAt_featured_idx`(`published`, `deletedAt`, `featured`),
    INDEX `Project_status_published_deletedAt_idx`(`status`, `published`, `deletedAt`),
    INDEX `Project_createdAt_published_idx`(`createdAt`, `published`),
    INDEX `Project_coverImageId_idx`(`coverImageId`),
    INDEX `Project_createdById_idx`(`createdById`),
    INDEX `Project_updatedById_idx`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectImage` (
    `id` VARCHAR(36) NOT NULL,
    `projectId` VARCHAR(36) NOT NULL,
    `mediaAssetId` VARCHAR(36) NOT NULL,
    `caption` VARCHAR(500) NULL,
    `altText` VARCHAR(300) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProjectImage_projectId_sortOrder_idx`(`projectId`, `sortOrder`),
    INDEX `ProjectImage_mediaAssetId_idx`(`mediaAssetId`),
    UNIQUE INDEX `ProjectImage_projectId_mediaAssetId_key`(`projectId`, `mediaAssetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectStatusHistory` (
    `id` VARCHAR(36) NOT NULL,
    `projectId` VARCHAR(36) NOT NULL,
    `previousStatus` ENUM('PROPOSED', 'PLANNING', 'TENDERING', 'AWARDED', 'STARTED', 'ONGOING', 'ON_HOLD', 'COMPLETED', 'CANCELLED') NULL,
    `newStatus` ENUM('PROPOSED', 'PLANNING', 'TENDERING', 'AWARDED', 'STARTED', 'ONGOING', 'ON_HOLD', 'COMPLETED', 'CANCELLED') NOT NULL,
    `changedById` VARCHAR(36) NULL,
    `note` VARCHAR(500) NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectStatusHistory_projectId_changedAt_idx`(`projectId`, `changedAt`),
    INDEX `ProjectStatusHistory_changedById_idx`(`changedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Announcement` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(220) NOT NULL,
    `slug` VARCHAR(240) NOT NULL,
    `category` ENUM('JOB_VACANCY', 'BID_TENDER', 'PROCUREMENT_NOTICE', 'EXPRESSION_OF_INTEREST', 'CONTRACT_AWARD', 'GENERAL_NOTICE', 'TRAINING', 'OTHER') NOT NULL,
    `reference` VARCHAR(100) NULL,
    `summary` VARCHAR(700) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `applicationInstructions` TEXT NULL,
    `externalApplicationUrl` VARCHAR(1000) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `scheduledFor` DATETIME(3) NULL,
    `deadline` DATETIME(3) NULL,
    `positionTitle` VARCHAR(200) NULL,
    `department` VARCHAR(150) NULL,
    `vacancyCount` INTEGER NULL,
    `requiredQualifications` TEXT NULL,
    `experienceRequirements` TEXT NULL,
    `employmentType` VARCHAR(100) NULL,
    `dutyStation` VARCHAR(200) NULL,
    `tenderReference` VARCHAR(100) NULL,
    `tenderTitle` VARCHAR(220) NULL,
    `procurementCategory` VARCHAR(150) NULL,
    `eligibilityRequirements` TEXT NULL,
    `scopeOfWork` TEXT NULL,
    `submissionDeadline` DATETIME(3) NULL,
    `bidOpeningInformation` VARCHAR(500) NULL,
    `submissionInstructions` TEXT NULL,
    `contactInformation` VARCHAR(500) NULL,
    `createdById` VARCHAR(36) NULL,
    `updatedById` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Announcement_slug_key`(`slug`),
    UNIQUE INDEX `Announcement_reference_key`(`reference`),
    INDEX `Announcement_published_category_deadline_deletedAt_idx`(`published`, `category`, `deadline`, `deletedAt`),
    INDEX `Announcement_published_featured_deletedAt_idx`(`published`, `featured`, `deletedAt`),
    INDEX `Announcement_category_published_idx`(`category`, `published`),
    INDEX `Announcement_deadline_published_idx`(`deadline`, `published`),
    INDEX `Announcement_createdById_idx`(`createdById`),
    INDEX `Announcement_updatedById_idx`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnouncementAttachment` (
    `id` VARCHAR(36) NOT NULL,
    `announcementId` VARCHAR(36) NOT NULL,
    `mediaAssetId` VARCHAR(36) NOT NULL,
    `caption` VARCHAR(500) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AnnouncementAttachment_announcementId_sortOrder_idx`(`announcementId`, `sortOrder`),
    INDEX `AnnouncementAttachment_mediaAssetId_idx`(`mediaAssetId`),
    UNIQUE INDEX `AnnouncementAttachment_announcementId_mediaAssetId_key`(`announcementId`, `mediaAssetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsArticle` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(220) NOT NULL,
    `slug` VARCHAR(240) NOT NULL,
    `summary` VARCHAR(700) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `category` VARCHAR(120) NOT NULL,
    `tags` JSON NOT NULL,
    `featuredImageId` VARCHAR(36) NULL,
    `socialImageId` VARCHAR(36) NULL,
    `seoTitle` VARCHAR(220) NULL,
    `seoDescription` VARCHAR(350) NULL,
    `authorName` VARCHAR(160) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `scheduledFor` DATETIME(3) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `createdById` VARCHAR(36) NULL,
    `updatedById` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `NewsArticle_slug_key`(`slug`),
    INDEX `NewsArticle_published_publishedAt_deletedAt_idx`(`published`, `publishedAt`, `deletedAt`),
    INDEX `NewsArticle_category_published_idx`(`category`, `published`),
    INDEX `NewsArticle_published_featured_deletedAt_idx`(`published`, `featured`, `deletedAt`),
    INDEX `NewsArticle_featuredImageId_idx`(`featuredImageId`),
    INDEX `NewsArticle_socialImageId_idx`(`socialImageId`),
    INDEX `NewsArticle_createdById_idx`(`createdById`),
    INDEX `NewsArticle_updatedById_idx`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(220) NOT NULL,
    `slug` VARCHAR(240) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `category` VARCHAR(120) NOT NULL,
    `eventImageId` VARCHAR(36) NULL,
    `startsAt` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NOT NULL,
    `location` VARCHAR(300) NULL,
    `onlineMeetingUrl` VARCHAR(1000) NULL,
    `registrationUrl` VARCHAR(1000) NULL,
    `organizer` VARCHAR(200) NULL,
    `contactInfo` VARCHAR(500) NULL,
    `status` ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'UPCOMING',
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `createdById` VARCHAR(36) NULL,
    `updatedById` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Event_slug_key`(`slug`),
    INDEX `Event_published_startsAt_deletedAt_idx`(`published`, `startsAt`, `deletedAt`),
    INDEX `Event_status_published_startsAt_idx`(`status`, `published`, `startsAt`),
    INDEX `Event_eventImageId_idx`(`eventImageId`),
    INDEX `Event_createdById_idx`(`createdById`),
    INDEX `Event_updatedById_idx`(`updatedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaAsset` (
    `id` VARCHAR(36) NOT NULL,
    `originalName` VARCHAR(255) NOT NULL,
    `storedName` VARCHAR(255) NOT NULL,
    `filePath` VARCHAR(500) NOT NULL,
    `mimeType` VARCHAR(150) NOT NULL,
    `extension` VARCHAR(20) NOT NULL,
    `size` INTEGER NOT NULL,
    `kind` ENUM('IMAGE', 'DOCUMENT') NOT NULL,
    `visibility` ENUM('PUBLIC', 'PRIVATE') NOT NULL DEFAULT 'PUBLIC',
    `altText` VARCHAR(300) NULL,
    `description` VARCHAR(1000) NULL,
    `createdById` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `MediaAsset_kind_visibility_deletedAt_idx`(`kind`, `visibility`, `deletedAt`),
    INDEX `MediaAsset_createdAt_deletedAt_idx`(`createdAt`, `deletedAt`),
    INDEX `MediaAsset_createdById_idx`(`createdById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSubmission` (
    `id` VARCHAR(36) NOT NULL,
    `firstName` VARCHAR(80) NOT NULL,
    `lastName` VARCHAR(80) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `phone` VARCHAR(40) NULL,
    `subject` VARCHAR(160) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(500) NULL,
    `reviewedById` VARCHAR(36) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContactSubmission_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `ContactSubmission_email_createdAt_idx`(`email`, `createdAt`),
    INDEX `ContactSubmission_reviewedById_idx`(`reviewedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveySubmission` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NULL,
    `email` VARCHAR(190) NULL,
    `area` VARCHAR(100) NOT NULL,
    `rating` VARCHAR(40) NOT NULL,
    `feedback` TEXT NOT NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SurveySubmission_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `SurveySubmission_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartnershipSubmission` (
    `id` VARCHAR(36) NOT NULL,
    `firstName` VARCHAR(80) NOT NULL,
    `lastName` VARCHAR(80) NOT NULL,
    `organization` VARCHAR(180) NOT NULL,
    `email` VARCHAR(190) NOT NULL,
    `phone` VARCHAR(40) NULL,
    `country` VARCHAR(100) NULL,
    `partnerType` VARCHAR(120) NOT NULL,
    `organizationWebsite` VARCHAR(500) NULL,
    `notes` TEXT NOT NULL,
    `attachmentId` VARCHAR(36) NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(500) NULL,
    `reviewedById` VARCHAR(36) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PartnershipSubmission_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `PartnershipSubmission_email_createdAt_idx`(`email`, `createdAt`),
    INDEX `PartnershipSubmission_attachmentId_idx`(`attachmentId`),
    INDEX `PartnershipSubmission_reviewedById_idx`(`reviewedById`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `userEmail` VARCHAR(190) NULL,
    `action` VARCHAR(120) NOT NULL,
    `entityType` VARCHAR(80) NOT NULL,
    `entityId` VARCHAR(100) NULL,
    `metadata` JSON NOT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_createdAt_idx`(`createdAt`),
    INDEX `AuditLog_userId_createdAt_idx`(`userId`, `createdAt`),
    INDEX `AuditLog_entityType_entityId_idx`(`entityType`, `entityId`),
    INDEX `AuditLog_action_createdAt_idx`(`action`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSetting` (
    `key` VARCHAR(100) NOT NULL,
    `value` JSON NOT NULL,
    `updatedById` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SiteSetting_updatedById_idx`(`updatedById`),
    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_coverImageId_fkey` FOREIGN KEY (`coverImageId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectImage` ADD CONSTRAINT `ProjectImage_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectImage` ADD CONSTRAINT `ProjectImage_mediaAssetId_fkey` FOREIGN KEY (`mediaAssetId`) REFERENCES `MediaAsset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectStatusHistory` ADD CONSTRAINT `ProjectStatusHistory_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectStatusHistory` ADD CONSTRAINT `ProjectStatusHistory_changedById_fkey` FOREIGN KEY (`changedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnouncementAttachment` ADD CONSTRAINT `AnnouncementAttachment_announcementId_fkey` FOREIGN KEY (`announcementId`) REFERENCES `Announcement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnouncementAttachment` ADD CONSTRAINT `AnnouncementAttachment_mediaAssetId_fkey` FOREIGN KEY (`mediaAssetId`) REFERENCES `MediaAsset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticle` ADD CONSTRAINT `NewsArticle_featuredImageId_fkey` FOREIGN KEY (`featuredImageId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticle` ADD CONSTRAINT `NewsArticle_socialImageId_fkey` FOREIGN KEY (`socialImageId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticle` ADD CONSTRAINT `NewsArticle_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsArticle` ADD CONSTRAINT `NewsArticle_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_eventImageId_fkey` FOREIGN KEY (`eventImageId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MediaAsset` ADD CONSTRAINT `MediaAsset_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactSubmission` ADD CONSTRAINT `ContactSubmission_reviewedById_fkey` FOREIGN KEY (`reviewedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartnershipSubmission` ADD CONSTRAINT `PartnershipSubmission_attachmentId_fkey` FOREIGN KEY (`attachmentId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartnershipSubmission` ADD CONSTRAINT `PartnershipSubmission_reviewedById_fkey` FOREIGN KEY (`reviewedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SiteSetting` ADD CONSTRAINT `SiteSetting_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
