CREATE TABLE categories
(
  id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);

CREATE TABLE users
(
  id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  avatar varchar(50) NOT NULL
);

CREATE TABLE articles
(
  id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  picture varchar(50),
  announce varchar(255) NOT NULL,
  full_text text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  user_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE comments
(
  id integer PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
  created_at timestamp DEFAULT current_timestamp,
  text text NOT NULL,
  user_id integer NOT NULL,
  article_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE article_categories
(
  article_id integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX ON articles(title);
