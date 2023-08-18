-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: test_schema
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `brand`
--
use test_schema;
LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES ('01H4618V8XGS613BS5BSPZP180','2023-06-30 11:33:32.580809','2023-06-30 11:33:32.580809','Pharma Tecnologies', 'IN_PROGRESS', 'logoUrl','01H4616SGMFZ1GX71ZG5DCZMFD','PharmaceuticalsAndBiotechnology',NULL,NULL);
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `business_account`
--

LOCK TABLES `business_account` WRITE;
/*!40000 ALTER TABLE `business_account` DISABLE KEYS */;
INSERT INTO `business_account` VALUES ('01H4616SGMFZ1GX71ZG5DCZMFD','2023-06-30 11:32:25.247091','2023-06-30 11:32:25.247091','Local Account',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `business_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `invitation`
--

LOCK TABLES `invitation` WRITE;
/*!40000 ALTER TABLE `invitation` DISABLE KEYS */;
/*!40000 ALTER TABLE `invitation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('1','2023-06-29 13:43:38.000000','2023-06-30 11:32:25.000000',NULL,'localuser@memorable.io','$2a$10$JewjgyJu3HEzQq2uaheBiudjyn4PkePvpioJ8onFmYvKYQvXLm58u','localUser','2023-06-29 13:43:38',NULL,1,1,'2023-06-30 13:29:09',1,'01H4616SGMFZ1GX71ZG5DCZMFD');
INSERT INTO `user` VALUES ('2','2023-06-29 13:43:38.000000','2023-06-30 11:32:25.000000',NULL,'localnoadmin@memorable.io','$2a$10$JewjgyJu3HEzQq2uaheBiudjyn4PkePvpioJ8onFmYvKYQvXLm58u','localUserNoAdmin','2023-06-29 13:43:38',NULL,1,1,'2023-06-30 13:29:09',0,'01H4616SGMFZ1GX71ZG5DCZMFD');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-03 11:06:41
