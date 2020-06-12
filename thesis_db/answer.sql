CREATE TABLE `answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `point` int(11) NOT NULL,
  `q_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `answer_to_question_idx` (`q_id`),
  CONSTRAINT `answer_to_question` FOREIGN KEY (`q_id`) REFERENCES `question` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
