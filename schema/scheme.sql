-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: scheme
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `CID` int NOT NULL AUTO_INCREMENT,
  `UID` int NOT NULL,
  `Status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`CID`),
  KEY `UID_idx` (`UID`),
  CONSTRAINT `UID_CART` FOREIGN KEY (`UID`) REFERENCES `user` (`UID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (9,1,'inactive'),(11,1,'active'),(12,2,'inactive'),(13,2,'inactive'),(14,4,'active'),(15,5,'active'),(16,7,'inactive'),(17,7,'active'),(18,2,'inactive'),(19,2,'inactive'),(20,2,'inactive'),(21,2,'inactive'),(22,2,'inactive'),(23,2,'inactive'),(24,2,'active');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `CIID` int NOT NULL AUTO_INCREMENT,
  `CID` int NOT NULL,
  `PID` int NOT NULL,
  `Quantity` int NOT NULL,
  PRIMARY KEY (`CIID`),
  KEY `CI_CID_idx` (`CID`),
  KEY `CI_PID_idx` (`PID`),
  CONSTRAINT `CI_CID` FOREIGN KEY (`CID`) REFERENCES `cart` (`CID`),
  CONSTRAINT `CI_PID` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (7,9,1,8),(10,11,2,7),(11,12,2,6),(12,12,1,5),(14,13,1,200),(15,14,1,10),(16,15,1,5),(17,13,2,15),(20,16,2,5),(21,17,1,975),(22,18,2,2),(23,19,2,4),(24,20,1,2),(27,21,2,3),(28,22,2,3),(36,23,2,2),(44,24,1,332);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `CID` int NOT NULL,
  ` Name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`CID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `OID` int NOT NULL,
  `Amount` decimal(65,5) DEFAULT NULL,
  `DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`OID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `PID` int NOT NULL,
  `OID` int DEFAULT NULL,
  `Amount` decimal(65,5) DEFAULT NULL,
  PRIMARY KEY (`PID`),
  KEY `OID_Payment_idx` (`OID`),
  CONSTRAINT `OID_Payment` FOREIGN KEY (`OID`) REFERENCES `order` (`OID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `PID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Price` decimal(45,5) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Cover_Image` varchar(255) DEFAULT NULL,
  `Stock` int DEFAULT NULL,
  PRIMARY KEY (`PID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Fallout: A Post Nuclear Role Playing Game',199.99000,'It is worth it','cover.jpg',773),(2,'Cigarette CD',200.00000,'It is not worth it','cover2.jpg',460);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `RID` int NOT NULL AUTO_INCREMENT,
  `UID` int NOT NULL,
  `PID` int NOT NULL,
  `Rating` tinyint NOT NULL,
  `Comment` text,
  `Creation_Time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RID`),
  KEY `UID_idx` (`UID`),
  KEY `PID_REVIEW_idx` (`PID`),
  CONSTRAINT `PID_REVIEW` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`),
  CONSTRAINT `UID_REVIEW` FOREIGN KEY (`UID`) REFERENCES `user` (`UID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,2,1,5,'Wow this sucks','2026-03-03 18:53:17'),(2,2,1,5,'This shit is the worst thing ever ngl','2026-03-03 18:55:13'),(3,1,1,1,'It\'s OK I guess.','2026-03-03 18:55:44'),(4,2,2,5,'Wow I like it so bad','2026-03-03 19:07:21');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) DEFAULT NULL,
  `Is_Admin` int DEFAULT '0',
  `Email` varchar(45) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`UID`),
  UNIQUE KEY `Password_UNIQUE` (`Password`),
  UNIQUE KEY `Email_UNIQUE` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'swag',0,'swag@swag','$2b$10$fEeZC8VA7.DkT3HubQEqPeU.8F8z2RxilzRChMILUyCLwKpnBQ3l2'),(2,'Beans',0,'bing@soy','$2b$10$k.hFgXco3S8JDid8xHHCp.Z942AmiIPUcvPvy4RhMJeQB0/YmYHBq'),(3,'beans',0,'beans@swag','$2b$10$nrSFt0EEIa83ObFTjgIrLeS9j4q7UjgeedlcTsRQiAcY8qgh.Y6hu'),(4,'user1',0,'user1@user1','$2b$10$Gfo7Y8ATw85LAungNMVeP.Evf3KVWKNpXs9ExnkHtbVH6kJfOPDoK'),(5,'user2',0,'user2@user2','$2b$10$uqFgv8R2SN3v7guSANnYx.cg/XfdqbCKOJQozc0OLrIrhKnEUEbCe'),(6,'user3',0,'user3@user3','$2b$10$hUiU.hGGRw8YFQ//8Eb.O.1AHF7deFLgZXAPwgFrQoPXyWOY2UCzK'),(7,'test50',0,'test50@test50','$2b$10$MNKAmo/ettQqtHpAb4YCEuXLZmjXU/nIg0tMLJnPajXM.3JZuNJ46'),(11,'ba',0,'Swag@2019','$2b$10$c7OrxZWBbCjhEkgfzv0Ax.zNfGr5w9q7I4tW2ymF6wpuozb7gvxQi');
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

-- Dump completed on 2026-03-04 19:08:26
