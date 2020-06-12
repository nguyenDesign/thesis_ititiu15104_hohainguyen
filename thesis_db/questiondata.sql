use questiondata;
CREATE TABLE `set` (
  `id` int(11) NOT NULL,
  `titile` varchar(45) NOT NULL,
  PRIMARY KEY (`titile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `questiontoset_idx` (`type`),
  CONSTRAINT `qtos` FOREIGN KEY (`type`) REFERENCES `set` (`titile`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


