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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (9,1,'inactive'),(11,1,'active'),(12,2,'inactive'),(13,2,'inactive'),(14,4,'active'),(15,5,'active'),(16,7,'inactive'),(17,7,'active'),(18,2,'inactive'),(19,2,'inactive'),(20,2,'inactive'),(21,2,'inactive'),(22,2,'inactive'),(23,2,'inactive'),(24,2,'active'),(25,12,'inactive'),(26,12,'inactive'),(27,12,'inactive'),(28,12,'inactive'),(29,12,'inactive'),(30,12,'inactive');
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
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (7,9,1,8),(10,11,2,7),(11,12,2,6),(12,12,1,5),(14,13,1,200),(15,14,1,10),(16,15,1,5),(17,13,2,15),(20,16,2,5),(21,17,1,975),(22,18,2,2),(23,19,2,4),(24,20,1,2),(27,21,2,3),(28,22,2,3),(36,23,2,2),(44,24,1,333),(45,24,2,1),(47,25,1,3),(48,25,2,3),(50,26,1,14),(57,27,2,5),(58,28,2,10),(59,29,1,5),(60,29,2,6),(61,30,1,5);
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
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `OOID` int NOT NULL AUTO_INCREMENT,
  `OID` int NOT NULL,
  `PID` int NOT NULL,
  `Product_Name` varchar(255) NOT NULL,
  `Price` decimal(45,2) NOT NULL,
  `Amount` int NOT NULL,
  PRIMARY KEY (`OOID`),
  UNIQUE KEY `OID_UNIQUE` (`OOID`),
  KEY `OIOID_idx` (`OID`),
  KEY `OIPID_idx` (`PID`),
  CONSTRAINT `OIOID` FOREIGN KEY (`OID`) REFERENCES `orders` (`OID`),
  CONSTRAINT `OIPID` FOREIGN KEY (`PID`) REFERENCES `product` (`PID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,'Fallout: A Post Nuclear Role Playing Game',199.99,2),(2,6,1,'Fallout: A Post Nuclear Role Playing Game',199.99,5),(3,7,1,'Fallout: A Post Nuclear Role Playing Game',199.99,1),(4,8,2,'Cigarette CD',200.00,5),(5,9,2,'Cigarette CD',200.00,5),(6,10,2,'Cigarette CD',200.00,10),(7,11,1,'Fallout: A Post Nuclear Role Playing Game',199.99,5),(8,11,2,'Cigarette CD',200.00,6),(9,12,1,'Fallout: A Post Nuclear Role Playing Game',199.99,5);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `OID` int NOT NULL AUTO_INCREMENT,
  `UID` int NOT NULL,
  `Price` decimal(45,2) DEFAULT NULL,
  `Status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `Creation_Time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`OID`),
  UNIQUE KEY `OID_UNIQUE` (`OID`),
  KEY `OrderUID_idx` (`UID`),
  CONSTRAINT `OrderUID` FOREIGN KEY (`UID`) REFERENCES `user` (`UID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,50.00,'pending','2026-03-05 17:41:01'),(2,1,50.00,'pending','2026-03-05 17:41:40'),(3,12,999.95,'pending','2026-03-05 20:29:32'),(4,12,999.95,'pending','2026-03-05 20:33:13'),(5,12,999.95,'pending','2026-03-05 20:34:46'),(6,12,999.95,'pending','2026-03-05 20:35:42'),(7,12,199.99,'pending','2026-03-05 20:37:00'),(8,12,1000.00,'pending','2026-03-05 20:38:43'),(9,12,1000.00,'pending','2026-03-05 20:42:32'),(10,12,2000.00,'pending','2026-03-05 20:42:51'),(11,12,2199.95,'pending','2026-03-05 20:43:07'),(12,12,999.95,'pending','2026-03-05 20:45:11');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
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
  PRIMARY KEY (`PID`)
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
INSERT INTO `product` VALUES (1,'Fallout: A Post Nuclear Role Playing Game',199.99000,'It is worth it','cover.jpg',746),(2,'Cigarette CD',200.00000,'It is not worth it','cover2.jpg',436);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,2,1,5,'Wow this sucks','2026-03-03 18:53:17'),(2,2,1,5,'This shit is the worst thing ever ngl','2026-03-03 18:55:13'),(3,1,1,1,'It\'s OK I guess.','2026-03-03 18:55:44'),(4,2,2,5,'Wow I like it so bad','2026-03-03 19:07:21'),(5,1,2,5,NULL,'2026-03-05 20:19:06'),(6,1,2,5,NULL,'2026-03-05 20:19:10'),(7,1,2,5,NULL,'2026-03-05 20:19:10'),(8,1,2,5,'s','2026-03-05 20:19:15'),(9,1,2,5,'s','2026-03-05 20:29:11'),(10,1,2,5,NULL,'2026-03-05 20:29:11');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'swag',0,'swag@swag','$2b$10$fEeZC8VA7.DkT3HubQEqPeU.8F8z2RxilzRChMILUyCLwKpnBQ3l2'),(2,'Beans',0,'bing@soy','$2b$10$k.hFgXco3S8JDid8xHHCp.Z942AmiIPUcvPvy4RhMJeQB0/YmYHBq'),(3,'beans',0,'beans@swag','$2b$10$nrSFt0EEIa83ObFTjgIrLeS9j4q7UjgeedlcTsRQiAcY8qgh.Y6hu'),(4,'user1',0,'user1@user1','$2b$10$Gfo7Y8ATw85LAungNMVeP.Evf3KVWKNpXs9ExnkHtbVH6kJfOPDoK'),(5,'user2',0,'user2@user2','$2b$10$uqFgv8R2SN3v7guSANnYx.cg/XfdqbCKOJQozc0OLrIrhKnEUEbCe'),(6,'user3',0,'user3@user3','$2b$10$hUiU.hGGRw8YFQ//8Eb.O.1AHF7deFLgZXAPwgFrQoPXyWOY2UCzK'),(7,'test50',0,'test50@test50','$2b$10$MNKAmo/ettQqtHpAb4YCEuXLZmjXU/nIg0tMLJnPajXM.3JZuNJ46'),(11,'ba',0,'Swag@2019','$2b$10$c7OrxZWBbCjhEkgfzv0Ax.zNfGr5w9q7I4tW2ymF6wpuozb7gvxQi'),(12,'sa',0,'swag@soy','$2b$10$MHKPFnrkoU85SrCPdggCU.YSnkCa8cyf/0LXZFVJZfFTZ4KvOuwTa'),(13,'soy',0,'soy@soy','$2b$10$S4kkd0ILV382Jvo2QY3EEuEKWwXDPr.ZPFQL9TCOy3FEu/hYu05iW');
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

-- Dump completed on 2026-03-05 22:07:24
