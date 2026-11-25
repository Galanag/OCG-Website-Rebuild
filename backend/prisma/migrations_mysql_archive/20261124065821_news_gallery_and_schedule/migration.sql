-- CreateTable
CREATE TABLE `NewsImage` (
    `id` VARCHAR(36) NOT NULL,
    `newsArticleId` VARCHAR(36) NOT NULL,
    `mediaAssetId` VARCHAR(36) NOT NULL,
    `caption` VARCHAR(500) NULL,
    `altText` VARCHAR(300) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `NewsImage_newsArticleId_sortOrder_idx`(`newsArticleId`, `sortOrder`),
    INDEX `NewsImage_mediaAssetId_idx`(`mediaAssetId`),
    UNIQUE INDEX `NewsImage_newsArticleId_mediaAssetId_key`(`newsArticleId`, `mediaAssetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NewsImage` ADD CONSTRAINT `NewsImage_newsArticleId_fkey` FOREIGN KEY (`newsArticleId`) REFERENCES `NewsArticle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NewsImage` ADD CONSTRAINT `NewsImage_mediaAssetId_fkey` FOREIGN KEY (`mediaAssetId`) REFERENCES `MediaAsset`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
