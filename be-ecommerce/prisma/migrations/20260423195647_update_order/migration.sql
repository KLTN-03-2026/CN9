-- AlterTable
ALTER TABLE `Order` ADD COLUMN `expires_at` DATETIME(3) NULL,
    MODIFY `receiver_name` VARCHAR(191) NULL,
    MODIFY `receiver_email` VARCHAR(191) NULL,
    MODIFY `receiver_phone` VARCHAR(191) NULL,
    MODIFY `receiver_address` VARCHAR(191) NULL,
    MODIFY `total_price` DECIMAL(12, 2) NULL,
    MODIFY `shipping_fee` DECIMAL(12, 2) NULL DEFAULT 0,
    MODIFY `point_discount_amount` DECIMAL(12, 2) NULL DEFAULT 0;
