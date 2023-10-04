CREATE DATABASE IF NOT EXISTS test_memorable_db
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_bin;
    
use test_memorable_db;


DROP TABLE IF EXISTS `invitation`;

ALTER TABLE `brand_status` DROP FOREIGN KEY `brand_status_ibfk_1`;

DROP TABLE IF EXISTS `brand`;
DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `business_account`;
DROP TABLE IF EXISTS `brand_status`;

--
-- Table structure for table `business_account`
--
CREATE TABLE `business_account` (
  `id` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `businessName` varchar(255) NOT NULL,
  `businessLogoUrl` varchar(255) DEFAULT NULL,
  `businessPhone` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `brand_status`
--
CREATE TABLE `brand_status` (
  `id` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `brandId` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `brand`
--
CREATE TABLE `brand` (
  `id` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) NOT NULL,
  `logoUrl` varchar(255) DEFAULT NULL,
  `businessAccountId` varchar(255) DEFAULT NULL,
  `sector` text,
  `adAccounts` text,
  `socialAccounts` text,
  `brandStatusId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ce8346e2deaf4543dd3f83304a3` (`businessAccountId`),
  CONSTRAINT `FK_ce8346e2deaf4543dd3f83304a3` FOREIGN KEY (`businessAccountId`) REFERENCES `business_account` (`id`),
  KEY `FK_Brand_brandStatus` (`brandStatusId`),
  CONSTRAINT `FK_Brand_brandStatus` FOREIGN KEY (`brandStatusId`) REFERENCES `brand_status` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Brand Status modification to add foreign key
--
ALTER TABLE `brand_status` ADD FOREIGN KEY `FK_BrandStatus_Brand` (`brandId`) REFERENCES `brand`(`id`);

--
-- Table structure for table `user`
--
CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `termsAndConditionsAccepted` datetime DEFAULT NULL,
  `emailCode` varchar(255) DEFAULT NULL,
  `emailVerified` tinyint NOT NULL DEFAULT '0',
  `isContractValid` tinyint NOT NULL DEFAULT '1',
  `lastLogin` datetime DEFAULT NULL,
  `isAdmin` tinyint NOT NULL DEFAULT '0',
  `businessAccountId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  KEY `FK_077f495e15f6c189c728fc5d2f3` (`businessAccountId`),
  CONSTRAINT `FK_077f495e15f6c189c728fc5d2f3` FOREIGN KEY (`businessAccountId`) REFERENCES `business_account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `invitation`
--
CREATE TABLE `invitation` (
  `id` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'referral',
  `isAdmin` tinyint NOT NULL DEFAULT '0',
  `expirationDate` timestamp NULL DEFAULT NULL,
  `businessAccountId` varchar(255) DEFAULT NULL,
  `userId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_05191060fae5b5485327709be7` (`userId`),
  KEY `IDX_d23721ee8274af12ae92599425` (`code`),
  KEY `FK_828861efb2f56ab91cc2f7f633f` (`businessAccountId`),
  CONSTRAINT `FK_05191060fae5b5485327709be7f` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_828861efb2f56ab91cc2f7f633f` FOREIGN KEY (`businessAccountId`) REFERENCES `business_account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

