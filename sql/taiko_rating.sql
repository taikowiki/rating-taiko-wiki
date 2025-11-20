/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.0.2-MariaDB, for osx10.20 (arm64)
--
-- Host: 15.165.132.219    Database: taiko_rating
-- ------------------------------------------------------
-- Server version	10.3.39-MariaDB-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `log` (
  `order` int(11) NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UUID` varchar(100) DEFAULT NULL,
  `url` text NOT NULL,
  `status` int(11) NOT NULL,
  `error` text DEFAULT NULL,
  PRIMARY KEY (`order`)
) ENGINE=InnoDB AUTO_INCREMENT=3134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user/profile`
--

DROP TABLE IF EXISTS `user/profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user/profile` (
  `order` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `bio` mediumtext NOT NULL,
  PRIMARY KEY (`order`),
  UNIQUE KEY `UUID` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user/rating_data`
--

DROP TABLE IF EXISTS `user/rating_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user/rating_data` (
  `UUID` varchar(100) NOT NULL,
  `currentRatingScore` int(11) NOT NULL,
  `currentExp` int(11) NOT NULL,
  `ratingScoreHistory` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`ratingScoreHistory`)),
  `lastUpload` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ranking` int(11) NOT NULL,
  UNIQUE KEY `UUID` (`UUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user/score_data`
--

DROP TABLE IF EXISTS `user/score_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user/score_data` (
  `UUID` varchar(100) NOT NULL,
  `songNo` varchar(100) NOT NULL,
  `diff` varchar(6) NOT NULL,
  `title` text NOT NULL,
  `crown` varchar(50) DEFAULT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `ranking` smallint(6) DEFAULT NULL,
  `good` int(11) NOT NULL,
  `ok` int(11) NOT NULL,
  `bad` int(11) NOT NULL,
  `maxCombo` int(11) NOT NULL,
  `roll` int(11) NOT NULL,
  `dfcCount` int(11) NOT NULL,
  `fcCount` int(11) NOT NULL,
  `clearCount` int(11) NOT NULL,
  `playCount` int(11) NOT NULL,
  UNIQUE KEY `scoreData` (`UUID`,`songNo`,`diff`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user/song_rating_data`
--

DROP TABLE IF EXISTS `user/song_rating_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user/song_rating_data` (
  `UUID` varchar(100) NOT NULL,
  `title` text NOT NULL,
  `songNo` varchar(100) NOT NULL,
  `difficulty` tinyint(4) NOT NULL,
  `measureValue` float NOT NULL,
  `accuracy` float NOT NULL,
  `crown` varchar(50) DEFAULT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `ratingScore` int(11) NOT NULL,
  UNIQUE KEY `songRatingData` (`UUID`,`songNo`,`difficulty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user/taiko_profile`
--

DROP TABLE IF EXISTS `user/taiko_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user/taiko_profile` (
  `order` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(100) NOT NULL,
  `taikoNumber` varchar(20) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `dan` tinyint(4) DEFAULT NULL,
  `danType` tinyint(4) DEFAULT NULL,
  `danFrame` tinyint(4) DEFAULT NULL,
  `dfc` int(11) DEFAULT NULL,
  `fc` int(11) DEFAULT NULL,
  `clear` int(11) DEFAULT NULL,
  `rainbow` int(11) DEFAULT NULL,
  `purple` int(11) DEFAULT NULL,
  `pink` int(11) DEFAULT NULL,
  `gold` int(11) DEFAULT NULL,
  `silver` int(11) DEFAULT NULL,
  `bronze` int(11) DEFAULT NULL,
  `white` int(11) DEFAULT NULL,
  PRIMARY KEY (`order`),
  UNIQUE KEY `UUID` (`UUID`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'taiko_rating'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-11-20 23:58:11
