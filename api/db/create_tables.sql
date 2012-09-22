-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Generation Time: Sep 22, 2012 at 02:57 PM
-- Server version: 5.1.44
-- PHP Version: 5.3.1

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `investr`
--

-- --------------------------------------------------------

--
-- Table structure for table `chance_event`
--

DROP TABLE IF EXISTS `chance_event`;
CREATE TABLE `chance_event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `die_one` int(11) NOT NULL,
  `die_two` int(11) NOT NULL,
  `market` int(11) NOT NULL,
  `card_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `initial_balance` int(11) NOT NULL DEFAULT '5000',
  `year` int(11) NOT NULL DEFAULT '0',
  `last_year` int(11) NOT NULL DEFAULT '10',
  `number_of_players` smallint(6) NOT NULL DEFAULT '4',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `game_sec_price`
--

DROP TABLE IF EXISTS `game_sec_price`;
CREATE TABLE `game_sec_price` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `security_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `split` tinyint(4) NOT NULL,
  `outstanding` int(11) DEFAULT NULL,
  `delta` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `game_settings`
--

DROP TABLE IF EXISTS `game_settings`;
CREATE TABLE `game_settings` (
  `game_id` int(11) NOT NULL,
  `settings_id` int(11) NOT NULL,
  `value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

DROP TABLE IF EXISTS `player`;
CREATE TABLE `player` (
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `balance` int(11) NOT NULL,
  UNIQUE KEY `UQ_USERID_GAMEID` (`user_id`,`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `portfolio`
--

DROP TABLE IF EXISTS `portfolio`;
CREATE TABLE `portfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `security_id` int(11) NOT NULL,
  `shares` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `security`
--

DROP TABLE IF EXISTS `security`;
CREATE TABLE `security` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `symbol` varchar(8) NOT NULL,
  `description` text NOT NULL,
  `dividend` int(11) NOT NULL,
  `dividend_label` varchar(32) NOT NULL,
  `outstanding` int(11) NOT NULL COMMENT 'number of shares',
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`symbol`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `security`
--

INSERT INTO `security` (`id`, `name`, `symbol`, `description`, `dividend`, `dividend_label`, `outstanding`, `price`) VALUES
(1, 'Growth Corporation of America', 'GRO', '', 1, 'Dividend', 600, 100),
(2, 'Metro Properties, Inc.', 'MET', '', 0, 'Dividend', 600, 100),
(3, 'Pioneer Mutual Fund', 'PIO', '', 4, 'Dividend', 600, 100),
(4, 'Shady Brooks Development', 'SHB', '', 7, 'Dividend', 600, 100),
(5, 'Stryker Drilling Company', 'STK', '', 0, 'Dividend', 600, 100),
(6, 'Tri-City Transport Company', 'TCT', '', 0, 'Dividend', 600, 100),
(7, 'United Auto Company', 'UAC', '', 2, 'Dividend', 600, 100),
(8, 'Uranium Enterprises, Inc.', 'URE', '', 6, 'Dividend', 600, 100),
(9, 'Valley Power & Light Company', 'VAL', '', 3, 'Dividend', 600, 100),
(10, 'Central City Municipal Bonds', 'BND', '', 5, 'Interest', 60000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `security_delta`
--

DROP TABLE IF EXISTS `security_delta`;
CREATE TABLE `security_delta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `security_id` int(11) NOT NULL,
  `roll` int(11) NOT NULL,
  `market` tinyint(4) NOT NULL,
  `delta` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `name`) VALUES
(1, 'margin');

-- --------------------------------------------------------

--
-- Table structure for table `txn`
--

DROP TABLE IF EXISTS `txn`;
CREATE TABLE `txn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `action` varchar(16) NOT NULL,
  `security_id` int(11) DEFAULT NULL,
  `shares` int(11) DEFAULT NULL,
  `income` int(11) DEFAULT NULL,
  `margin` int(11) DEFAULT NULL,
  `margin_charge` int(11) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `balance` int(11) DEFAULT NULL,
  `invalid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `txn_order`
--

DROP TABLE IF EXISTS `txn_order`;
CREATE TABLE `txn_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `security_symbol` varchar(255) NOT NULL,
  `shares` int(11) NOT NULL,
  `margin` int(11) NOT NULL DEFAULT '0',
  `comment` varchar(255) DEFAULT NULL,
  `invalid` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(128) NOT NULL,
  `password` varchar(256) NOT NULL,
  `salt` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`,`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `salt`, `email`) VALUES
(1, 'carbontax', '2f11d176d8d89843dd9f6a5fbe8c2291f976a5e5', 'berkshirehathaway', 'carbontax@gmail.com'),
(2, 'googalan', '2f11d176d8d89843dd9f6a5fbe8c2291f976a5e5', 'berkshirehathaway', 'googalan@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE IF NOT EXISTS `user_role` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  UNIQUE KEY `user_id` (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
