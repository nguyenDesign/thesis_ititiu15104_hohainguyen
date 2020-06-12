CREATE TABLE `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `set_id` int(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_to_set_idx` (`set_id`),
  CONSTRAINT `question_to_set` FOREIGN KEY (`set_id`) REFERENCES `questionset` (`questionset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
