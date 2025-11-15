-- Active: 1759666465308@@127.0.0.1@3306@taiko_rating
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- 생성 시간: 25-11-15 11:18
-- 서버 버전: 10.4.32-MariaDB
-- PHP 버전: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+09:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `taiko_rating`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `user/profile`
--

CREATE TABLE `user/profile` (
  `order` int(11) NOT NULL,
  `UUID` varchar(100) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `bio` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `user/ratingdata`
--

CREATE TABLE `user/ratingdata` (
  `UUID` varchar(100) NOT NULL,
  `currentRatingScore` int(11) NOT NULL,
  `currentExp` int(11) NOT NULL,
  `ratingScoreHistory` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' CHECK (json_valid(`ratingScoreHistory`)),
  `lastUpload` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ranking` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `user/scoredata`
--

CREATE TABLE `user/scoredata` (
  `UUID` varchar(100) NOT NULL,
  `songNo` varchar(100) NOT NULL,
  `diff` varchar(5) NOT NULL,
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
  `playCount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `user/songratingdata`
--

CREATE TABLE `user/songratingdata` (
  `UUID` varchar(100) NOT NULL,
  `title` text NOT NULL,
  `songNo` varchar(100) NOT NULL,
  `difficulty` tinyint(4) NOT NULL,
  `measureValue` float NOT NULL,
  `accuracy` float NOT NULL,
  `crown` varchar(50) DEFAULT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `ratingScore` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 테이블 구조 `user/taikoprofile`
--

CREATE TABLE `user/taikoprofile` (
  `order` int(11) NOT NULL,
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
  `white` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `user/profile`
--
ALTER TABLE `user/profile`
  ADD PRIMARY KEY (`order`),
  ADD UNIQUE KEY `UUID` (`UUID`);

--
-- 테이블의 인덱스 `user/ratingdata`
--
ALTER TABLE `user/ratingdata`
  ADD UNIQUE KEY `UUID` (`UUID`);

--
-- 테이블의 인덱스 `user/scoredata`
--
ALTER TABLE `user/scoredata`
  ADD UNIQUE KEY `scoreData` (`UUID`,`songNo`,`diff`);

--
-- 테이블의 인덱스 `user/songratingdata`
--
ALTER TABLE `user/songratingdata`
  ADD UNIQUE KEY `songRatingData` (`UUID`,`songNo`,`difficulty`);

--
-- 테이블의 인덱스 `user/taikoprofile`
--
ALTER TABLE `user/taikoprofile`
  ADD PRIMARY KEY (`order`),
  ADD UNIQUE KEY `UUID` (`UUID`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `user/profile`
--
ALTER TABLE `user/profile`
  MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;

--
-- 테이블의 AUTO_INCREMENT `user/taikoprofile`
--
ALTER TABLE `user/taikoprofile`
  MODIFY `order` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
