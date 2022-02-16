'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const article = require(`./article`);
const user = require(`./user`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const UserService = require(`../data-service/user`);
const passwordUtils = require(`../lib/password`);

const {HttpCode} = require(`../../const`);

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`,
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`,
  },
];

const mockCategories = [`Животные`, `Журналы`, `Игры`, `IT`];

const mockArticles = [
  {
    title: `Оценка авторынка`,
    picture: `sea@1x.jpg`,
    announce: `Альбом стал настоящим открытием года. Как начать действовать?`,
    user: `ivanov@example.com`,
    fullText: `Это один из лучших рок-музыкантов. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Альбом стал настоящим открытием года. Помните, небольшое количество ежедневных упражнений лучше чем один раз, но много. Достичь успеха помогут ежедневные повторения.`,
    createdAt: `2022-01-05T11:42:29.502Z`,
    updatedAt: `2022-01-05T11:42:29.502Z`,
    categories: [`Животные`, `IT`],
    comments: [
      {
        user: `petrov@example.com`,
        text: `Согласен с автором! Мне кажется или я уже читал это где-то?`,
        createdAt: `2022-01-05T11:42:29.623Z`,
        updatedAt: `2022-01-05T11:42:29.623Z`,
      },
    ],
  },
  {
    title: `Ёлки. История деревьев`,
    picture: `skyscraper@1x.jpg`,
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    user: `ivanov@example.com`,
    fullText: `Он написал больше 30 хитов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Мощное авто - роскошь или необходимость? Дети - цветы жизни. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    createdAt: `2022-01-05T11:42:29.502Z`,
    updatedAt: `2022-01-05T11:42:29.502Z`,
    categories: [`Животные`],
    comments: [
      {
        user: `petrov@example.com`,
        text: `Совсем немного... Мне кажется или я уже читал это где-то? Согласен с автором!`,
        createdAt: `2022-01-05T11:42:29.523Z`,
        updatedAt: `2022-01-05T11:42:29.523Z`,
      },
      {
        user: `petrov@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Планируете записать видосик на эту тему?`,
        createdAt: `2022-01-05T11:42:29.523Z`,
        updatedAt: `2022-01-05T11:42:29.523Z`,
      },
      {
        user: `petrov@example.com`,
        text: `Планируете записать видосик на эту тему?`,
        createdAt: `2022-01-05T11:42:29.523Z`,
        updatedAt: `2022-01-05T11:42:29.523Z`,
      },
    ],
  },
  {
    title: `Title specially in English`,
    picture: `sea@1x.jpg`,
    announce: `Первая большая ёлка была установлена только в 1938 году.`,
    user: `ivanov@example.com`,
    fullText: `Лучше турбированных двигателей еще ничего не придумали. Этот смартфон — настоящая находка. Возьмите новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево.`,
    createdAt: `2022-01-05T11:42:29.502Z`,
    updatedAt: `2022-01-05T11:42:29.502Z`,
    categories: [`Журналы`, `Игры`, `IT`],
    comments: [
      {
        user: `petrov@example.com`,
        text: `Мне кажется или я уже читал это где-то? Хочу такую же футболку :-)`,
        createdAt: `2022-01-05T11:42:29.593Z`,
        updatedAt: `2022-01-05T11:42:29.593Z`,
      },
    ],
  },
  {
    title: `Как перестать беспокоиться и начать жить`,
    picture: `sea-fullsize@1x.jpg`,
    announce: `Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать?`,
    user: `ivanov@example.com`,
    fullText: `Этот смартфон — настоящая находка. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Для начала просто соберитесь. Мощное авто - роскошь или необходимость?`,
    createdAt: `2022-01-05T11:42:29.501Z`,
    updatedAt: `2022-01-05T11:42:29.501Z`,
    categories: [`Животные`, `Игры`],
    comments: [
      {
        user: `petrov@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы!`,
        createdAt: `2022-01-05T11:42:29.520Z`,
        updatedAt: `2022-01-05T11:42:29.520Z`,
      },
      {
        user: `petrov@example.com`,
        text: `Мне кажется или я уже читал это где-то? Это где ж такие красоты?`,
        createdAt: `2022-01-05T11:42:29.520Z`,
        updatedAt: `2022-01-05T11:42:29.520Z`,
      },
    ],
  },
  {
    title: `New test value`,
    picture: `skyscraper@1x.jpg`,
    announce: `Дети - цветы жизни. Так ли это на самом деле? Он написал больше 30 хитов.`,
    user: `ivanov@example.com`,
    fullText: `Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Для начала просто соберитесь. Он написал больше 30 хитов. Так ли это на самом деле? Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Не стоит идти в программисты, если вам нравятся только игры.`,
    createdAt: `2022-01-05T11:42:29.500Z`,
    updatedAt: `2022-01-05T11:42:29.500Z`,
    categories: [`Журналы`, `Игры`, `IT`],
    comments: [
      {
        user: `petrov@example.com`,
        text: `Мне кажется или я уже читал это где-то?`,
        createdAt: `2022-01-05T11:42:29.516Z`,
        updatedAt: `2022-01-05T11:42:29.516Z`,
      },
      {
        user: `petrov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему?`,
        createdAt: `2022-01-05T11:42:29.516Z`,
        updatedAt: `2022-01-05T11:42:29.516Z`,
      },
      {
        user: `petrov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
        createdAt: `2022-01-05T11:42:29.516Z`,
        updatedAt: `2022-01-05T11:42:29.516Z`,
      },
    ],
  },
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  console.log(1);
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });
  console.log(2);
  const app = express();
  app.use(express.json());
  article(app, new ArticleService(mockDB), new CommentService(mockDB));
  user(app, new UserService(mockDB));
  return app;
};

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Test title not less than 30 symbols`,
    announce: `Test announce not less than 30 symbols`,
    userId: 1,
    fullText: `Этот смартфон — настоящая находка. Просто действуйте. Вы можете достичь всего. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году.`,
    categories: [1, 3],
  };

  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code is 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns new article`, () =>
    expect(response.body.title).toEqual(newArticle.title));

  test(`Total articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6)));

  test(`id key is added to article object`, () => {
    expect(response.body).toHaveProperty(`id`);
  });
});

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 5 articles`, () =>
    expect(response.body.length).toBe(5));
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(200));

  test(`Offer title is "Оценка авторынка"`, () =>
    expect(response.body.title).toBe(`Оценка авторынка`));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Test`,
    announce: `You can achieve something`,
    user: `ivanov@example.com`,
    fullText: `Так ли это на самом деле? Лучше турбированных двигателей еще ничего не придумали. Этот смартфон — настоящая находка. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Альбом стал настоящим открытием года. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    userId: 1
  };
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any of required properties response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const corruptedArticle = {...newArticle};
      delete corruptedArticle[key];

      await request(app)
        .post(`/articles`)
        .send(corruptedArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, picture: 12345},
      {...newArticle, categories: `Котики`},
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, title: `too short`},
      {...newArticle, categories: []},
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes article content by received data`, () => {
  const newArticle = {
    title: `Test must be not less than 30 symbols. Just to be sure.`,
    announce: `You can achieve something. Not less than 30 symbols`,
    fullText: `Так ли это на самом деле? Лучше турбированных двигателей еще ничего не придумали. Этот смартфон — настоящая находка. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Альбом стал настоящим открытием года. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    categories: [1, 3],
    userId: 1
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/2`).send(newArticle);
  });

  test(`Status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed in articles list`, () =>
    request(app)
      .get(`/articles/2`)
      .expect((res) => expect(res.body.title).toEqual(newArticle.title)));
});

test(`API returns status code 404 when trying to change non-existing article`, async () => {
  const newArticle = {
    title: `Test`,
    announce: `You can achieve something`,
    user: `ivanov@example.com`,
    fullText: `Так ли это на самом деле? Лучше турбированных двигателей еще ничего не придумали. Этот смартфон — настоящая находка. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Альбом стал настоящим открытием года. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    categories: [1, 3],
  };

  const app = await createAPI();

  return request(app)
    .put(`/articles/1000`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change article with invalid data`, async () => {
  const newArticle = {
    title: `Test`,
    announce: `You can achieve something`,
  };

  const app = await createAPI();

  return request(app)
    .put(`/articles/4`)
    .send(newArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/5`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(200));

  test(`Articles count decreased to 4`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => {
        expect(res.body.length).toBe(4);
      }));
});

describe(`API creates a comment with text`, () => {
  const newComment = {
    text: `Test text not less than 20 symbols`,
    userId: 2
  };

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).post(`/articles/3/comments`).send(newComment);
  });

  test(`Status code is 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returned comment includes "Test text not less than 20 symbols"`, () =>
    expect(response.body.text).toBe(`Test text not less than 20 symbols`));

  test(`Id key added to new comment`, () =>
    expect(response.body).toHaveProperty(`id`));
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1000/comments`)
    .send({
      text: `Some text`,
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment without text field`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/3/comments`)
    .send({
      test: `Wrong key`,
    })
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment with empty text field`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/3/comments`)
    .send({
      text: ``,
    })
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/3/comments/100`)
    .expect(HttpCode.NOT_FOUND);
});
