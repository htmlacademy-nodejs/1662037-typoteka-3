-- Delete DB
DROP DATABASE typoteka;

-- Create DB
CREATE DATABASE typoteka
  WITH
  OWNER = academy
  ENCODING = 'UTF8'
  TEMPLATE = template0
  LC_COLLATE = 'C'
  LC_CTYPE = 'C'
  CONNECTION LIMIT = -1;

-- Get all categories
SELECT * FROM categories;

-- Get all categories which have at least 1 article
SELECT id, name, COUNT(article_categories.article_id) FROM categories
  JOIN article_categories ON categories.id = article_categories.category_id
  GROUP BY id, name;


-- Get all categories with articles count for each
SELECT id, name, COUNT(article_categories.article_id) FROM categories
  LEFT JOIN article_categories ON categories.id = article_categories.article_id
  GROUP BY id

-- Get list of articles with user name and email, comments count and categories names
SELECT
  articles.*,
  users.first_name,
  users.last_name,
  users.email,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  JOIN users ON articles.user_id = users.id
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON articles.id = comments.article_id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_at DESC

-- Get particular article with user name and email, comments count and categories names
SELECT
  articles.*,
  users.first_name,
  users.last_name,
  users.email,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  JOIN users ON articles.user_id = users.id
  JOIN article_categories ON articles.id = article_categories.article_id
  JOIN categories ON article_categories.category_id = categories.id
  LEFT JOIN comments ON articles.id = comments.article_id
WHERE articles.id = 1
  GROUP BY articles.id, users.id

-- Get 5 latest comments with user info
SELECT
  comments.id,
  article_id,
  users.first_name,
  users.last_name,
  text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY created_at DESC
  LIMIT 5;

-- Get comments for particular article (sort by date desc)
SELECT
  comments.id,
  article_id,
  users.first_name,
  users.last_name,
  text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE article_id = 1
  ORDER BY created_at DESC;

-- Update title for particular article
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
