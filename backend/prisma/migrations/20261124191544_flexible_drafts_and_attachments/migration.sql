-- AlterTable
ALTER TABLE `Announcement` ADD COLUMN `contactPerson` VARCHAR(160) NULL,
    ADD COLUMN `currency` VARCHAR(3) NULL,
    ADD COLUMN `openingDate` DATETIME(3) NULL,
    ADD COLUMN `responsibilities` TEXT NULL,
    ADD COLUMN `salaryRange` VARCHAR(200) NULL,
    ADD COLUMN `submissionLocation` VARCHAR(300) NULL,
    ADD COLUMN `tenderValue` DECIMAL(18, 2) NULL;

-- AlterTable
ALTER TABLE `Event` MODIFY `startsAt` DATETIME(3) NULL,
    MODIFY `endsAt` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `ProjectAttachment` (
    `id` VARCHAR(36) NOT NULL,
    `projectId` VARCHAR(36) NOT NULL,
    `mediaAssetId` VARCHAR(36) NOT NULL,
    `caption` VARCHAR(500) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProjectAttachment_projectId_sortOrder_idx`(`projectId`, `sortOrder`),
    INDEX `ProjectAttachment_mediaAssetId_idx`(`mediaAssetId`),
    UNIQUE INDEX `ProjectAttachment_projectId_mediaAssetId_key`(`projectId`, `mediaAssetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProjectAttachment` ADD CONSTRAINT `ProjectAttachment_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectAttachment` ADD CONSTRAINT `ProjectAttachment_mediaAssetId_fkey` FOREIGN KEY (`mediaAssetId`) REFERENCES `MediaAsset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
