-- CMS-managed corporate page content.
CREATE TABLE `PageSection` (
  `id` VARCHAR(36) NOT NULL,
  `pageKey` VARCHAR(80) NOT NULL,
  `sectionKey` VARCHAR(100) NOT NULL,
  `title` VARCHAR(220) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `metadata` JSON NOT NULL,
  `imageId` VARCHAR(36) NULL,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `published` BOOLEAN NOT NULL DEFAULT true,
  `createdById` VARCHAR(36) NULL,
  `updatedById` VARCHAR(36) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `deletedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `PageSection_pageKey_sectionKey_key` (`pageKey`, `sectionKey`),
  INDEX `PageSection_pageKey_published_sortOrder_deletedAt_idx` (`pageKey`, `published`, `sortOrder`, `deletedAt`),
  INDEX `PageSection_imageId_idx` (`imageId`),
  INDEX `PageSection_createdById_idx` (`createdById`),
  INDEX `PageSection_updatedById_idx` (`updatedById`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `PageSection`
  ADD CONSTRAINT `PageSection_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `PageSection_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `PageSection_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;