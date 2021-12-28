INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');

INSERT INTO categories(name) VALUES
('Животные'),
('Игры'),
('Разное');

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, picture, announce, full_text, user_id) VALUES
('Как достигнуть успеха не вставая с кресла', 'image1.jpg', 'Стоит только немного постараться и запастись книгами.', 'Процессор заслуживает особого внимания. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Приезжайте на Бали - учитесь серфингу. Он обязательно понравится геймерам со стажем. Для начала просто соберитесь. Бороться с прокрастинацией несложно. Жить - значит путешествовать. Путешествовать - значит жить. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко если вы прирожденный герой.', 1),
('Как перестать беспокоиться и начать жить', 'image2.jpg', 'Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Это прочная древесина.', 'Лучше турбированных двигателей еще ничего не придумали. Золотое сечение — соотношение двух величин, гармоническая пропорция. Для начала просто соберитесь. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать?', 2);
ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3);
ALTER TABLE article_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(text, user_id, article_id) VALUES
('Купи мой гараж', 2, 1),
('Купи, кому говорю', 2, 1),
('Плохой гараж', 1, 2),
('Не куплю', 1, 2);
ALTER TABLE comments ENABLE TRIGGER ALL;
