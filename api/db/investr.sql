-- phpMyAdmin SQL Dump
-- version 3.2.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 17, 2012 at 01:44 PM
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

CREATE TABLE IF NOT EXISTS `chance_event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `die_one` int(11) NOT NULL,
  `die_two` int(11) NOT NULL,
  `market` int(11) NOT NULL,
  `card_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=84 ;

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE IF NOT EXISTS `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `initial_balance` int(11) NOT NULL DEFAULT '5000',
  `year` int(11) NOT NULL DEFAULT '0',
  `last_year` int(11) NOT NULL DEFAULT '10',
  `number_of_players` smallint(6) NOT NULL DEFAULT '4',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=42 ;

-- --------------------------------------------------------

--
-- Table structure for table `game_sec_price`
--

CREATE TABLE IF NOT EXISTS `game_sec_price` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `security_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `split` tinyint(4) NOT NULL,
  `outstanding` int(11) DEFAULT NULL,
  `delta` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1717 ;

-- --------------------------------------------------------

--
-- Table structure for table `game_settings`
--

CREATE TABLE IF NOT EXISTS `game_settings` (
  `game_id` int(11) NOT NULL,
  `settings_id` int(11) NOT NULL,
  `value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `player`
--

CREATE TABLE IF NOT EXISTS `player` (
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `balance` int(11) NOT NULL,
  UNIQUE KEY `UQ_USERID_GAMEID` (`user_id`,`game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `portfolio`
--

CREATE TABLE IF NOT EXISTS `portfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `security_id` int(11) NOT NULL,
  `shares` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=64 ;

-- --------------------------------------------------------

--
-- Table structure for table `security`
--

CREATE TABLE IF NOT EXISTS `security` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `security`
--

INSERT INTO `security` (`id`, `name`, `symbol`, `description`, `dividend`, `dividend_label`, `outstanding`, `price`) VALUES
(11, 'Growth Corporation of America', 'GRO', '', 1, 'Dividend', 600, 100),
(12, 'Metro Properties, Inc.', 'MET', '', 0, 'Dividend', 600, 100),
(13, 'Pioneer Mutual Fund', 'PIO', '', 4, 'Dividend', 600, 100),
(14, 'Shady Brooks Development', 'SHB', '', 7, 'Dividend', 600, 100),
(15, 'Stryker Drilling Company', 'STK', '', 0, 'Dividend', 600, 100),
(16, 'Tri-City Transport Company', 'TCT', '', 0, 'Dividend', 600, 100),
(17, 'United Auto Company', 'UAC', '', 2, 'Dividend', 600, 100),
(18, 'Uranium Enterprises, Inc.', 'URE', '', 6, 'Dividend', 600, 100),
(19, 'Valley Power & Light Company', 'VAL', '', 3, 'Dividend', 600, 100),
(20, 'Central City Municipal Bonds', 'BND', '', 5, 'Interest', 60000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `security_delta`
--

CREATE TABLE IF NOT EXISTS `security_delta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `security_id` int(11) NOT NULL,
  `roll` int(11) NOT NULL,
  `market` tinyint(4) NOT NULL,
  `delta` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=423 ;

--
-- Dumping data for table `security_delta`
--

INSERT INTO `security_delta` (`id`, `security_id`, `roll`, `market`, `delta`) VALUES
(225, 11, 2, 0, 12),
(226, 11, 3, 0, 7),
(227, 11, 4, 0, 9),
(228, 11, 5, 0, 7),
(229, 11, 6, 0, 8),
(230, 11, 7, 0, 6),
(231, 11, 8, 0, 5),
(232, 11, 9, 0, -2),
(233, 11, 10, 0, 11),
(234, 11, 11, 0, -5),
(235, 11, 12, 0, -8),
(236, 11, 2, 1, -2),
(237, 11, 3, 1, 26),
(238, 11, 4, 1, 18),
(239, 11, 5, 1, 23),
(240, 11, 6, 1, 20),
(241, 11, 7, 1, 17),
(242, 11, 8, 1, 19),
(243, 11, 9, 1, 11),
(244, 11, 10, 1, 13),
(245, 11, 11, 1, 14),
(246, 11, 12, 1, 24),
(247, 12, 2, 0, 14),
(248, 12, 3, 0, -6),
(249, 12, 4, 0, 10),
(250, 12, 5, 0, 8),
(251, 12, 6, 0, 6),
(252, 12, 7, 0, 4),
(253, 12, 8, 0, 7),
(254, 12, 9, 0, 6),
(255, 12, 10, 0, 11),
(256, 12, 11, 0, 13),
(257, 12, 12, 0, -10),
(258, 12, 2, 1, -10),
(259, 12, 3, 1, 16),
(260, 12, 4, 1, 23),
(261, 12, 5, 1, 28),
(262, 12, 6, 1, 15),
(263, 12, 7, 1, 21),
(264, 12, 8, 1, 24),
(265, 12, 9, 1, 18),
(266, 12, 10, 1, 31),
(267, 12, 11, 1, -8),
(268, 12, 12, 1, 24),
(269, 13, 2, 0, 13),
(270, 13, 3, 0, 10),
(271, 13, 4, 0, 7),
(272, 13, 5, 0, 5),
(273, 13, 6, 0, 4),
(274, 13, 7, 0, 3),
(275, 13, 8, 0, -1),
(276, 13, 9, 0, -3),
(277, 13, 10, 0, -5),
(278, 13, 11, 0, -8),
(279, 13, 12, 0, -10),
(280, 13, 2, 1, -7),
(281, 13, 3, 1, 25),
(282, 13, 4, 1, 11),
(283, 13, 5, 1, -2),
(284, 13, 6, 1, 15),
(285, 13, 7, 1, 13),
(286, 13, 8, 1, 17),
(287, 13, 9, 1, 14),
(288, 13, 10, 1, 1),
(289, 13, 11, 1, 19),
(290, 13, 12, 1, 23),
(291, 14, 2, 0, 10),
(292, 14, 3, 0, -10),
(293, 14, 4, 0, -5),
(294, 14, 5, 0, -6),
(295, 14, 6, 0, -4),
(296, 14, 7, 0, 3),
(297, 14, 8, 0, -3),
(298, 14, 9, 0, -8),
(299, 14, 10, 0, -7),
(300, 14, 11, 0, 6),
(301, 14, 12, 0, -15),
(302, 14, 2, 1, -9),
(303, 14, 3, 1, 8),
(304, 14, 4, 1, 12),
(305, 14, 5, 1, 11),
(306, 14, 6, 1, 7),
(307, 14, 7, 1, -2),
(308, 14, 8, 1, 9),
(309, 14, 9, 1, 22),
(310, 14, 10, 1, 14),
(311, 14, 11, 1, -1),
(312, 14, 12, 1, 20),
(313, 15, 2, 0, 10),
(314, 15, 3, 0, 30),
(315, 15, 4, 0, -20),
(316, 15, 5, 0, -40),
(317, 15, 6, 0, 40),
(318, 15, 7, 0, -15),
(319, 15, 8, 0, 45),
(320, 15, 9, 0, -20),
(321, 15, 10, 0, 30),
(322, 15, 11, 0, 25),
(323, 15, 12, 0, -20),
(324, 15, 2, 1, -2),
(325, 15, 3, 1, -14),
(326, 15, 4, 1, 46),
(327, 15, 5, 1, 56),
(328, 15, 6, 1, -20),
(329, 15, 7, 1, 37),
(330, 15, 8, 1, -5),
(331, 15, 9, 1, 67),
(332, 15, 10, 1, -11),
(333, 15, 11, 1, -9),
(334, 15, 12, 1, 51),
(335, 16, 2, 0, 20),
(336, 16, 3, 0, 6),
(337, 16, 4, 0, 12),
(338, 16, 5, 0, 3),
(339, 16, 6, 0, 8),
(340, 16, 7, 0, 5),
(341, 16, 8, 0, 6),
(342, 16, 9, 0, 7),
(343, 16, 10, 0, 10),
(344, 16, 11, 0, 4),
(345, 16, 12, 0, -20),
(346, 16, 2, 1, -9),
(347, 16, 3, 1, 21),
(348, 16, 4, 1, 18),
(349, 16, 5, 1, 19),
(350, 16, 6, 1, 15),
(351, 16, 7, 1, 23),
(352, 16, 8, 1, 26),
(353, 16, 9, 1, 15),
(354, 16, 10, 1, 18),
(355, 16, 11, 1, 25),
(356, 16, 12, 1, 27),
(357, 17, 2, 0, 21),
(358, 17, 3, 0, -19),
(359, 17, 4, 0, 21),
(360, 17, 5, 0, 16),
(361, 17, 6, 0, 4),
(362, 17, 7, 0, 8),
(363, 17, 8, 0, -10),
(364, 17, 9, 0, 10),
(365, 17, 10, 0, -11),
(366, 17, 11, 0, 18),
(367, 17, 12, 0, -23),
(368, 17, 2, 1, -7),
(369, 17, 3, 1, 14),
(370, 17, 4, 1, -5),
(371, 17, 5, 1, 30),
(372, 17, 6, 1, 13),
(373, 17, 7, 1, 23),
(374, 17, 8, 1, 13),
(375, 17, 9, 1, 22),
(376, 17, 10, 1, 18),
(377, 17, 11, 1, -10),
(378, 17, 12, 1, 38),
(379, 18, 2, 0, 25),
(380, 18, 3, 0, 22),
(381, 18, 4, 0, 18),
(382, 18, 5, 0, -14),
(383, 18, 6, 0, -12),
(384, 18, 7, 0, -8),
(385, 18, 8, 0, 10),
(386, 18, 9, 0, 14),
(387, 18, 10, 0, -18),
(388, 18, 11, 0, -22),
(389, 18, 12, 0, -25),
(390, 18, 2, 1, -16),
(391, 18, 3, 1, -4),
(392, 18, 4, 1, 34),
(393, 18, 5, 1, 29),
(394, 18, 6, 1, -10),
(395, 18, 7, 1, 19),
(396, 18, 8, 1, -7),
(397, 18, 9, 1, 18),
(398, 18, 10, 1, -14),
(399, 18, 11, 1, 13),
(400, 18, 12, 1, 33),
(401, 19, 2, 0, 8),
(402, 19, 3, 0, -2),
(403, 19, 4, 0, 7),
(404, 19, 5, 0, 4),
(405, 19, 6, 0, 3),
(406, 19, 7, 0, 5),
(407, 19, 8, 0, 4),
(408, 19, 9, 0, 6),
(409, 19, 10, 0, -4),
(410, 19, 11, 0, -4),
(411, 19, 12, 0, -7),
(412, 19, 2, 1, -4),
(413, 19, 3, 1, 17),
(414, 19, 4, 1, 15),
(415, 19, 5, 1, 14),
(416, 19, 6, 1, 12),
(417, 19, 7, 1, 14),
(418, 19, 8, 1, 15),
(419, 19, 9, 1, 13),
(420, 19, 10, 1, 10),
(421, 19, 11, 1, 19),
(422, 19, 12, 1, 18);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `name`) VALUES
(1, 'margin');

-- --------------------------------------------------------

--
-- Table structure for table `txn`
--

CREATE TABLE IF NOT EXISTS `txn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `security_id` int(11) DEFAULT NULL,
  `shares` int(11) DEFAULT NULL,
  `income` int(11) DEFAULT NULL,
  `margin` int(11) DEFAULT NULL,
  `margin_charge` int(11) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `balance` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=311 ;

-- --------------------------------------------------------

--
-- Table structure for table `txn_order`
--

CREATE TABLE IF NOT EXISTS `txn_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `security_symbol` varchar(255) NOT NULL,
  `shares` int(11) NOT NULL,
  `margin` int(11) NOT NULL DEFAULT '0',
  `comment` varchar(255) DEFAULT NULL,
  `invalid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=190 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(128) NOT NULL,
  `password` varchar(256) NOT NULL,
  `salt` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`,`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `salt`, `email`) VALUES
(3, 'carbontax', '2f11d176d8d89843dd9f6a5fbe8c2291f976a5e5', 'berkshirehathaway', 'carbontax@gmail.com'),
(4, 'googalan', '2f11d176d8d89843dd9f6a5fbe8c2291f976a5e5', 'berkshirehathaway', 'googalan@gmail.com');
