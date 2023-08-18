CREATE TABLE `user` (
  `id`                CHAR(36) NOT NULL DEFAULT (UUID()),
  `display_name`      VARCHAR(30) NOT NULL,
  `email`             VARCHAR(50) NOT NULL UNIQUE,
  `password`          VARCHAR(100),
  `create_date`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
) CHARSET=utf8;

CREATE TABLE `category` (
  `id`                INT(11) NOT NULL AUTO_INCREMENT,
  `name`              VARCHAR(10) NOT NULL,
  `color`             CHAR(7) NOT NULL,
  `sort`              TINYINT(1) NOT NULL,
  PRIMARY KEY(`id`)
) CHARSET=utf8;

INSERT INTO category(name, color, sort) VALUES('영화', '#8B97FF', 1);
INSERT INTO category(name, color, sort) VALUES('뮤지컬', '#A888FF', 2);
INSERT INTO category(name, color, sort) VALUES('전시', '#D373FA', 3);
INSERT INTO category(name, color, sort) VALUES('콘서트', '#FFC348', 4);
INSERT INTO category(name, color, sort) VALUES('연극', '#FFA888', 5);

CREATE TABLE `ticket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` char(36) NOT NULL,
  `category_id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `show_date` date NOT NULL,
  `place` varchar(30),
  `price` int(11),
  `rating` tinyint(1) ,
  `review` varchar(1000) ,
  `create_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp on update CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `category_id_idx` (`category_id`),
  CONSTRAINT `ticket_fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ticket_fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` int(11) NOT NULL,
  `image_url` varchar(1000) NOT NULL,
  `original_name` varchar(1000) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `width` int(10) unsigned NOT NULL,
  `height` int(10) unsigned NOT NULL,
  `extension` varchar(10) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `is_primary` tinyint(4) DEFAULT '0',
  `create_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `image_fk_ticket_id_idx` (`ticket_id`),
  CONSTRAINT `image_fk_ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) CHARSET=utf8