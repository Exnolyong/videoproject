-- Table structure for table `v_comment`
DROP TABLE IF EXISTS `v_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `v_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `nickname` varchar(30) DEFAULT NULL,
  `avatar` varchar(100) DEFAULT NULL,
  `video_id` int(11) NOT NULL,
  `content` varchar(100) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `parent_comment_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `v_comment_user_id_0bfd570d_fk_v_user_id` (`user_id`),
  KEY `v_comment_video_id_6f2c2405_fk_v_video_id` (`video_id`),
  KEY `v_comment_parent_comment_id_5c5c4c5c_fk_v_comment_id` (`parent_comment_id`),
  CONSTRAINT `v_comment_user_id_0bfd570d_fk_v_user_id` FOREIGN KEY (`user_id`) REFERENCES `v_user` (`id`),
  CONSTRAINT `v_comment_video_id_6f2c2405_fk_v_video_id` FOREIGN KEY (`video_id`) REFERENCES `v_video` (`id`),
  CONSTRAINT `v_comment_parent_comment_id_5c5c4c5c_fk_v_comment_id` FOREIGN KEY (`parent_comment_id`) REFERENCES `v_comment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `v_danmaku`
--

DROP TABLE IF EXISTS `v_danmaku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `v_danmaku` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `nickname` varchar(30) DEFAULT NULL,
  `video_id` int(11) NOT NULL,
  `content` varchar(50) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `play_time` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `v_danmaku_user_id_0bfd570d_fk_v_user_id` (`user_id`),
  KEY `v_danmaku_video_id_6f2c2405_fk_v_video_id` (`video_id`),
  CONSTRAINT `v_danmaku_user_id_0bfd570d_fk_v_user_id` FOREIGN KEY (`user_id`) REFERENCES `v_user` (`id`),
  CONSTRAINT `v_danmaku_video_id_6f2c2405_fk_v_video_id` FOREIGN KEY (`video_id`) REFERENCES `v_video` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;