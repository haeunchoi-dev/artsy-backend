


CREATE TABLE user (
  id                CHAR(16) NOT NULL UNIQUE,
  display_name      VARCHAR(30) NOT NULL,
  email             VARCHAR(50) NOT NULL UNIQUE,
  password          VARCHAR(100),
  create_date       DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
) ENGINE=MYISAM CHARSET=utf8;

INSERT INTO user(id, display_name, email, password)
VALUES('1234567890123456', '최원진', 'test1@test.com', '1234');


CREATE TABLE category (
  id                INT NOT NULL AUTO_INCREMENT,
  name              VARCHAR(10) NOT NULL,
  color             CHAR(7) NOT NULL,
  sort              TINYINT(1) NOT NULL,
  PRIMARY KEY(id)
) ENGINE=MYISAM CHARSET=utf8;


CREATE TABLE ticket (
  id                INT NOT NULL AUTO_INCREMENT,
  user_id           CHAR(16) NOT NULL,
  category_id       INT NOT NULL,
  title             VARCHAR(30) NOT NULL,
  show_date         DATE NOT NULL,
  place             VARCHAR(30),
  price             INT,
  rating            TINYINT(1),
  review            VARCHAR(1000),
  create_date       DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date       DATETIME ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  FOREIGN KEY (user_id) references user(id),
  FOREIGN KEY (category_id) references category(id)
) ENGINE=MYISAM CHARSET=utf8;


CREATE TABLE image (
  id                INT NOT NULL AUTO_INCREMENT,
  ticket_id         INT NOT NULL,
  url               VARCHAR(1000) NOT NULL,
  original_name     VARCHAR(255) NOT NULL,
  file_name         VARCHAR(255) NOT NULL,
  width             INT UNSIGNED NOT NULL,
  height            INT UNSIGNED NOT NULL,
  extension         VARCHAR(5) NOT NULL,
  size              BIGINT NOT NULL,
  is_primary        BOOLEAN DEFAULT false,
  create_date       DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  FOREIGN KEY (ticket_id) references ticket(id)
) ENGINE=MYISAM CHARSET=utf8;