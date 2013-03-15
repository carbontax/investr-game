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
  `split` tinyint(4) NULL,
  `bust` tinyint(4)  NULL,
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
(1, 'AAA Corporation', 'AAA', '', 1, 'Dividend', 600, 100),
(2, 'BBB Realty', 'BBB', '', 0, 'Dividend', 600, 100),
(3, 'CCC Equity Fund', 'CCC', '', 4, 'Dividend', 600, 100),
(4, 'DDD Income Trist', 'DDD', '', 7, 'Dividend', 600, 100),
(5, 'EE Exploration', 'EEE', '', 0, 'Dividend', 600, 100),
(6, 'FFF Bus Company', 'FFF', '', 0, 'Dividend', 600, 100),
(7, 'GGG Motors', 'GGG', '', 2, 'Dividend', 600, 100),
(8, 'HHH Mining & Smelting', 'HHH', '', 6, 'Dividend', 600, 100),
(9, 'III Utilities', 'III', '', 3, 'Dividend', 600, 100),
(10, 'Provincial Bonds', 'BND', '', 5, 'Interest', 60000, 1);

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

--
-- Dumping data for table `security_delta`
--

INSERT INTO `security_delta` VALUES 
(1,-9,2,0,12),
(2,-9,3,0,7),
(3,-9,4,0,9),
(4,-9,5,0,7),
(5,-9,6,0,8),
(6,-9,7,0,6),
(7,-9,8,0,5),
(8,-9,9,0,-2),
(9,-9,10,0,11),
(10,-9,11,0,-5),
(11,-9,12,0,-8),
(12,-9,2,1,-2),
(13,-9,3,1,26),
(14,-9,4,1,18),
(15,-9,5,1,23),
(16,-9,6,1,20),
(17,-9,7,1,17),
(18,-9,8,1,19),
(19,-9,9,1,11),
(20,-9,10,1,13),
(21,-9,11,1,14),
(22,-9,12,1,24),
(23,-8,2,0,14),
(24,-8,3,0,-6),
(25,-8,4,0,10),
(26,-8,5,0,8),
(27,-8,6,0,6),
(28,-8,7,0,4),
(29,-8,8,0,7),
(30,-8,9,0,6),
(31,-8,10,0,11),
(32,-8,11,0,13),
(33,-8,12,0,-10),
(34,-8,2,1,-10),
(35,-8,3,1,16),
(36,-8,4,1,23),
(37,-8,5,1,28),
(38,-8,6,1,15),
(39,-8,7,1,21),
(40,-8,8,1,24),
(41,-8,9,1,18),
(42,-8,10,1,31),
(43,-8,11,1,-8),
(44,-8,12,1,24),
(45,-7,2,0,13),
(46,-7,3,0,10),
(47,-7,4,0,7),
(48,-7,5,0,5),
(49,-7,6,0,4),
(50,-7,7,0,3),
(51,-7,8,0,-1),
(52,-7,9,0,-3),
(53,-7,10,0,-5),
(54,-7,11,0,-8),
(55,-7,12,0,-10),
(56,-7,2,1,-7),
(57,-7,3,1,25),
(58,-7,4,1,11),
(59,-7,5,1,-2),
(60,-7,6,1,15),
(61,-7,7,1,13),
(62,-7,8,1,17),
(63,-7,9,1,14),
(64,-7,10,1,1),
(65,-7,11,1,19),
(66,-7,12,1,23),
(67,-6,2,0,10),
(68,-6,3,0,-10),
(69,-6,4,0,-5),
(70,-6,5,0,-6),
(71,-6,6,0,-4),
(72,-6,7,0,3),
(73,-6,8,0,-3),
(74,-6,9,0,-8),
(75,-6,10,0,-7),
(76,-6,11,0,6),
(77,-6,12,0,-15),
(78,-6,2,1,-9),
(79,-6,3,1,8),
(80,-6,4,1,12),
(81,-6,5,1,11),
(82,-6,6,1,7),
(83,-6,7,1,-2),
(84,-6,8,1,9),
(85,-6,9,1,22),
(86,-6,10,1,24),
(87,-6,11,1,-1),
(88,-6,12,1,20),
(89,-5,2,0,10),
(90,-5,3,0,30),
(91,-5,4,0,-20),
(92,-5,5,0,-40),
(93,-5,6,0,40),
(94,-5,7,0,-15),
(95,-5,8,0,45),
(96,-5,9,0,-20),
(97,-5,10,0,30),
(98,-5,11,0,25),
(99,-5,12,0,-20),
(100,-5,2,1,-2),
(101,-5,3,1,-14),
(102,-5,4,1,46),
(103,-5,5,1,56),
(104,-5,6,1,-20),
(105,-5,7,1,37),
(106,-5,8,1,-5),
(107,-5,9,1,67),
(108,-5,10,1,-11),
(109,-5,11,1,-9),
(110,-5,12,1,51),
(111,-4,2,0,20),
(112,-4,3,0,6),
(113,-4,4,0,12),
(114,-4,5,0,3),
(115,-4,6,0,8),
(116,-4,7,0,5),
(117,-4,8,0,6),
(118,-4,9,0,7),
(119,-4,10,0,10),
(120,-4,11,0,4),
(121,-4,12,0,-20),
(122,-4,2,1,-9),
(123,-4,3,1,21),
(124,-4,4,1,18),
(125,-4,5,1,19),
(126,-4,6,1,15),
(127,-4,7,1,23),
(128,-4,8,1,26),
(129,-4,9,1,15),
(130,-4,10,1,18),
(131,-4,11,1,25),
(132,-4,12,1,27),
(133,-3,2,0,21),
(134,-3,3,0,-19),
(135,-3,4,0,21),
(136,-3,5,0,16),
(137,-3,6,0,4),
(138,-3,7,0,8),
(139,-3,8,0,-10),
(140,-3,9,0,10),
(141,-3,10,0,-11),
(142,-3,11,0,18),
(143,-3,12,0,-23),
(144,-3,2,1,-7),
(145,-3,3,1,14),
(146,-3,4,1,-5),
(147,-3,5,1,30),
(148,-3,6,1,13),
(149,-3,7,1,23),
(150,-3,8,1,13),
(151,-3,9,1,22),
(152,-3,10,1,18),
(153,-3,11,1,-10),
(154,-3,12,1,38),
(155,-2,2,0,25),
(156,-2,3,0,22),
(157,-2,4,0,18),
(158,-2,5,0,-14),
(159,-2,6,0,-12),
(160,-2,7,0,-8),
(161,-2,8,0,10),
(162,-2,9,0,14),
(163,-2,10,0,-18),
(164,-2,11,0,-22),
(165,-2,12,0,-25),
(225,1,2,0,12),
(226,1,3,0,7),
(227,1,4,0,9),
(228,1,5,0,7),
(229,1,6,0,8),
(230,1,7,0,6),
(231,1,8,0,5),
(232,1,9,0,-2),
(233,1,10,0,11),
(234,1,11,0,-5),
(235,1,12,0,-8),
(236,1,2,1,-2),
(237,1,3,1,26),
(238,1,4,1,18),
(239,1,5,1,23),
(240,1,6,1,20),
(241,1,7,1,17),
(242,1,8,1,19),
(243,1,9,1,11),
(244,1,10,1,13),
(245,1,11,1,14),
(246,1,12,1,24),
(247,2,2,0,14),
(248,2,3,0,-6),
(249,2,4,0,10),
(250,2,5,0,8),
(251,2,6,0,6),
(252,2,7,0,4),
(253,2,8,0,7),
(254,2,9,0,6),
(255,2,10,0,11),
(256,2,11,0,13),
(257,2,12,0,-10),
(258,2,2,1,-10),
(259,2,3,1,16),
(260,2,4,1,23),
(261,2,5,1,28),
(262,2,6,1,15),
(263,2,7,1,21),
(264,2,8,1,24),
(265,2,9,1,18),
(266,2,10,1,31),
(267,2,11,1,-8),
(268,2,12,1,24),
(269,3,2,0,13),
(270,3,3,0,10),
(271,3,4,0,7),
(272,3,5,0,5),
(273,3,6,0,4),
(274,3,7,0,3),
(275,3,8,0,-1),
(276,3,9,0,-3),
(277,3,10,0,-5),
(278,3,11,0,-8),
(279,3,12,0,-10),
(280,3,2,1,-7),
(281,3,3,1,25),
(282,3,4,1,11),
(283,3,5,1,-2),
(284,3,6,1,15),
(285,3,7,1,13),
(286,3,8,1,17),
(287,3,9,1,14),
(288,3,10,1,1),
(289,3,11,1,19),
(290,3,12,1,23),
(291,4,2,0,10),
(292,4,3,0,-10),
(293,4,4,0,-5),
(294,4,5,0,-6),
(295,4,6,0,-4),
(296,4,7,0,3),
(297,4,8,0,-3),
(298,4,9,0,-8),
(299,4,10,0,-7),
(300,4,11,0,6),
(301,4,12,0,-15),
(302,4,2,1,-9),
(303,4,3,1,8),
(304,4,4,1,12),
(305,4,5,1,11),
(306,4,6,1,7),
(307,4,7,1,-2),
(308,4,8,1,9),
(309,4,9,1,22),
(310,4,10,1,14),
(311,4,11,1,-1),
(312,4,12,1,20),
(313,5,2,0,10),
(314,5,3,0,30),
(315,5,4,0,-20),
(316,5,5,0,-40),
(317,5,6,0,40),
(318,5,7,0,-15),
(319,5,8,0,45),
(320,5,9,0,-20),
(321,5,10,0,30),
(322,5,11,0,25),
(323,5,12,0,-20),
(324,5,2,1,-2),
(325,5,3,1,-14),
(326,5,4,1,46),
(327,5,5,1,56),
(328,5,6,1,-20),
(329,5,7,1,37),
(330,5,8,1,-5),
(331,5,9,1,67),
(332,5,10,1,-11),
(333,5,11,1,-9),
(334,5,12,1,51),
(335,6,2,0,20),
(336,6,3,0,6),
(337,6,4,0,12),
(338,6,5,0,3),
(339,6,6,0,8),
(340,6,7,0,5),
(341,6,8,0,6),
(342,6,9,0,7),
(343,6,10,0,10),
(344,6,11,0,4),
(345,6,12,0,-20),
(346,6,2,1,-9),
(347,6,3,1,21),
(348,6,4,1,18),
(349,6,5,1,19),
(350,6,6,1,15),
(351,6,7,1,23),
(352,6,8,1,26),
(353,6,9,1,15),
(354,6,10,1,18),
(355,6,11,1,25),
(356,6,12,1,27),
(357,7,2,0,21),
(358,7,3,0,-19),
(359,7,4,0,21),
(360,7,5,0,16),
(361,7,6,0,4),
(362,7,7,0,8),
(363,7,8,0,-10),
(364,7,9,0,10),
(365,7,10,0,-11),
(366,7,11,0,18),
(367,7,12,0,-23),
(368,7,2,1,-7),
(369,7,3,1,14),
(370,7,4,1,-5),
(371,7,5,1,30),
(372,7,6,1,13),
(373,7,7,1,23),
(374,7,8,1,13),
(375,7,9,1,22),
(376,7,10,1,18),
(377,7,11,1,-10),
(378,7,12,1,38),
(379,8,2,0,25),
(380,8,3,0,22),
(381,8,4,0,18),
(382,8,5,0,-14),
(383,8,6,0,-12),
(384,8,7,0,-8),
(385,8,8,0,10),
(386,8,9,0,14),
(387,8,10,0,-18),
(388,8,11,0,-22),
(389,8,12,0,-25),
(390,8,2,1,-16),
(391,8,3,1,-4),
(392,8,4,1,34),
(393,8,5,1,29),
(394,8,6,1,-10),
(395,8,7,1,19),
(396,8,8,1,-7),
(397,8,9,1,18),
(398,8,10,1,-14),
(399,8,11,1,13),
(400,8,12,1,33),
(401,9,2,0,8),
(402,9,3,0,-2),
(403,9,4,0,7),
(404,9,5,0,4),
(405,9,6,0,3),
(406,9,7,0,5),
(407,9,8,0,4),
(408,9,9,0,6),
(409,9,10,0,-4),
(410,9,11,0,-4),
(411,9,12,0,-7),
(412,9,2,1,-4),
(413,9,3,1,17),
(414,9,4,1,15),
(415,9,5,1,14),
(416,9,6,1,12),
(417,9,7,1,14),
(418,9,8,1,15),
(419,9,9,1,13),
(420,9,10,1,10),
(421,9,11,1,19),
(422,9,12,1,18);

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
  `security_id` int(11)  DEFAULT NULL,
  `security_symbol` varchar(255)  DEFAULT NULL,
  `shares` int(11)  DEFAULT NULL,
  `margin` int(11)  DEFAULT NULL,
  `comment` varchar(255)  DEFAULT NULL,
  `invalid` int(11)  DEFAULT NULL,
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
