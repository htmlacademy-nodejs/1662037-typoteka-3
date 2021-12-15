'use strict';

const express = require(`express`);
const request = require(`supertest`);
const cloneDeep = require(`lodash/cloneDeep`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);

const {HttpCode} = require(`../../const`);

const mockData = [
  {
    id: `33gARk`,
    title: `Выбираем новое авто`,
    createdDate: `2021-12-03T14:37:32.408Z`,
    announce: `Освоить вёрстку несложно.`,
    fullText: `Этот смартфон — настоящая находка. Просто действуйте. Вы можете достичь всего. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году.`,
    category: [`Путешествия`, `Дети`, `Программирование`],
    comments: [
      {
        id: `S0nR-u`,
        text: `Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    id: `QTPDQU`,
    title: `Как достигнуть успеха не вставая с кресла`,
    createdDate: `2021-11-20T14:37:32.409Z`,
    announce: `Не стоит идти в программисты, если вам нравятся только игры. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Это прочная древесина.`,
    fullText: `Помните, небольшое количество ежедневных упражнений лучше чем один раз, но много. Альбом стал настоящим открытием года. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Приезжайте на Бали - учитесь серфингу. Рок-музыка всегда ассоциировалась с протестами. Для начала просто соберитесь. Он написал больше 30 хитов.`,
    category: [`Программирование`, `За жизнь`, `Дети`],
    comments: [
      {
        id: `7IjyUn`,
        text: `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        id: `-PzS_E`,
        text: `Совсем немного... Хочу такую же футболку :-) Плюсую, но слишком много буквы!`,
      },
      {
        id: `-kW-pM`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
  },
  {
    id: `-wqx62`,
    title: `Как достигнуть успеха не вставая с кресла`,
    createdDate: `2021-10-07T14:37:32.409Z`,
    announce: `Стоит только немного постараться и запастись книгами.`,
    fullText: `Процессор заслуживает особого внимания. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Приезжайте на Бали - учитесь серфингу. Он обязательно понравится геймерам со стажем. Для начала просто соберитесь. Бороться с прокрастинацией несложно. Жить - значит путешествовать. Путешествовать - значит жить. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко если вы прирожденный герой.`,
    category: [`Железо`],
    comments: [],
  },
  {
    id: `rqHDXw`,
    title: `Как перестать беспокоиться и начать жить`,
    createdDate: `2021-11-17T14:37:32.409Z`,
    announce: `Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Это прочная древесина.`,
    fullText: `Лучше турбированных двигателей еще ничего не придумали. Золотое сечение — соотношение двух величин, гармоническая пропорция. Для начала просто соберитесь. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать?`,
    category: [`Кино`, `Программирование`, `Путешествия`],
    comments: [],
  },
  {
    id: `tO8tIt`,
    title: `Путешествия по южной Азии`,
    createdDate: `2021-10-28T14:37:32.409Z`,
    announce: `Вы можете достичь всего.`,
    fullText: `Так ли это на самом деле? Лучше турбированных двигателей еще ничего не придумали. Этот смартфон — настоящая находка. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Альбом стал настоящим открытием года. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    category: [`Разное`, `Путешествия`, `Железо`],
    comments: [
      {
        id: `ZjYgmK`,
        text: `Планируете записать видосик на эту тему? Совсем немного... Плюсую, но слишком много буквы!`,
      },
    ],
  },
];

const createApi = () => {
  const app = express();
  const cloneData = cloneDeep(mockData);

  app.use(express.json());
  article(app, new DataService(cloneData));
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 5 articles`, () =>
    expect(response.body.length).toBe(5));

  test(`First article's id is 33gARk`, () =>
    expect(response.body[0].id).toBe(`33gARk`));
});

describe(`API returns an article with given id`, () => {
  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/33gARk`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(200));

  test(`Offer title is "Выбираем новое авто"`, () =>
    expect(response.body.title).toBe(`Выбираем новое авто`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Test`,
    createdDate: `2021-10-28T14:37:32.409Z`,
    announce: `You can achieve something`,
    fullText: `Так ли это на самом деле? Лучше турбированных двигателей еще ничего не придумали. Этот смартфон — настоящая находка. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Альбом стал настоящим открытием года. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    category: [`Test`],
  };

  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code is 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns new article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Total articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6)));

  test(`id and comments keys are added to article object`, () => {
    expect(response.body).toHaveProperty(`id`);
    expect(response.body).toHaveProperty(`comments`);
  });
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Test`,
    createdDate: `2021-10-28T14:37:32.409Z`,
    announce: `You can achieve something`,
    fullText: `Так ли это на самом деле? Лучше турбированных двигателей еще ничего не придумали. Этот смартфон — настоящая находка. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Альбом стал настоящим открытием года. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    category: [`Test`],
  };

  const app = createApi();

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
});

describe(`API changes article content by received data`, () => {
  const newArticle = {
    title: `Test`,
    createdDate: `2021-10-28T14:37:32.409Z`,
    announce: `You can achieve something`,
    fullText: `Так ли это на самом деле? Лучше турбированных двигателей еще ничего не придумали. Этот смартфон — настоящая находка. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Альбом стал настоящим открытием года. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    category: [`Test`],
  };

  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/QTPDQU`).send(newArticle);
  });

  test(`Status code is 200`, () =>
    expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed in articles list`, () =>
    request(app)
      .get(`/articles/QTPDQU`)
      .expect((res) =>
        expect(res.body).toEqual(expect.objectContaining(newArticle)),
      ));
});

test(`API returns status code 404 when trying to change non-existing article`, () => {
  const newArticle = {
    title: `Test`,
    createdDate: `2021-10-28T14:37:32.409Z`,
    announce: `You can achieve something`,
    fullText: `Так ли это на самом деле? Лучше турбированных двигателей еще ничего не придумали. Этот смартфон — настоящая находка. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Альбом стал настоящим открытием года. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    category: [`Test`],
  };

  const app = createApi();

  return request(app)
    .put(`/articles/NOEXST`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change article with invalid data`, () => {
  const newArticle = {
    title: `Test`,
    createdDate: `2021-10-28T14:37:32.409Z`,
    announce: `You can achieve something`,
    category: [`Test`],
  };

  const app = createApi();

  return request(app)
    .put(`/articles/QTPDQU`)
    .send(newArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes article`, () => {
  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/33gARk`);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(200));

  test(`Received deleted article`, () =>
    expect(response.body.id).toBe(`33gARk`));

  test(`Articles count decreased to 4`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => {
        console.log(res.body);
        expect(res.body.length).toBe(4);
      }));
});

describe(`API creates a comment with text`, () => {
  const newComment = {
    text: `Test text`,
  };

  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/rqHDXw/comments`)
      .send(newComment);
  });

  test(`Status code is 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returned comment includes "Test text"`, () => expect(response.body.text).toBe(`Test text`));

  test(`Id key added to new comment`, () => expect(response.body).toHaveProperty(`id`));
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createApi();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Some text`,
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment without text field`, () => {
  const app = createApi();

  return request(app)
    .post(`/articles/rqHDXw/comments`)
    .send({
      test: `Wrong key`,
    })
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment with empty text field`, () => {
  const app = createApi();

  return request(app)
    .post(`/articles/rqHDXw/comments`)
    .send({
      text: ``,
    })
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createApi();

  return request(app)
    .delete(`/articles/QTPDQU/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
