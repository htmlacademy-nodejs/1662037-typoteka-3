'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const user = require(`./user`);
const UserService = require(`../../data-service/user`);
const RefreshTokenService = require(`../../data-service/refresh-token`);
const passwordUtils = require(`../../lib/password`);
const {HttpCode, UserRole} = require(`../../../const`);

const mockUsers = [
  {
    name: `Иван`,
    surname: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`,
    role: UserRole.ADMIN,
  },
  {
    name: `Пётр`,
    surname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`,
    role: UserRole.USER,
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
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });
  const app = express();
  app.use(express.json());
  user(app, new UserService(mockDB), new RefreshTokenService(mockDB));
  return app;
};

describe(`API creates user if data is valid`, () => {
  const validUserData = {
    name: `Сидор`,
    surname: `Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
    avatar: `sidorov.jpg`,
  };

  let response;

  beforeAll(async () => {
    let app = await createAPI();
    response = await request(app).post(`/user`).send(validUserData);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));
});

describe(`API refuses to create user if data is invalid`, () => {
  const validUserData = {
    name: `Сидор`,
    surname: `Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(validUserData)) {
      const badUserData = {...validUserData};
      delete badUserData[key];
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, firstName: true},
      {...validUserData, email: 1},
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid`},
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When password and passwordRepeated are not equal, code is 400`, async () => {
    const badUserData = {...validUserData, passwordRepeated: `not sidorov`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When email is already in use status code is 400`, async () => {
    const badUserData = {...validUserData, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API authentificates user if data is valid and returns access and refresh tokens`, () => {
  const validUserData = {
    email: `ivanov@example.com`,
    password: `ivanov`,
  };

  let response;

  beforeAll(async () => {
    let app = await createAPI();
    response = await request(app).post(`/user/auth`).send(validUserData);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Access token exists`, () =>
    expect(response.body.accessToken).toBeDefined());

  test(`Refresh token exists`, () =>
    expect(response.body.refreshToken).toBeDefined());
});

describe(`API refuses to authentificates user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If email is incorrect, status is 401`, async () => {
    const invalidUserData = {
      email: `not-exist@example.com`,
      password: `ivanov`,
    };

    await request(app)
      .post(`/user/auth`)
      .send(invalidUserData)
      .expect(HttpCode.UNAUTHORIZED);
  });

  test(`If password is incorrect, status is 401`, async () => {
    const invalidUserData = {
      email: `ivanov@example.com`,
      password: `not-a-password`,
    };

    await request(app)
      .post(`/user/auth`)
      .send(invalidUserData)
      .expect(HttpCode.UNAUTHORIZED);
  });
});

describe(`API returns new access token on /refresh`, () => {
  const validUserData = {
    email: `ivanov@example.com`,
    password: `ivanov`,
  };

  let response;

  beforeAll(async () => {
    let app = await createAPI();
    const authResponse = await request(app)
      .post(`/user/auth`)
      .send(validUserData);
    const refreshToken = authResponse.body.refreshToken;
    response = await request(app)
      .post(`/user/refresh`)
      .send({refreshToken});
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`New access token exists`, () =>
    expect(response.body.newAccessToken).toBeDefined());

  test(`New refresh token exists`, () =>
    expect(response.body.newRefreshToken).toBeDefined());
});

describe(`API doesn't return new access token on /refresh`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If refresh token hasn't been sent`, async () => {
    await request(app)
      .post(`/user/refresh`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);
  });


  test(`If refresh token is invalid`, async () => {
    await request(app)
      .post(`/user/refresh`)
      .send({refreshToken: `not-a-valid-refresh-token`})
      .expect(HttpCode.NOT_FOUND);
  });
});

test(`API returns 200 on /logout with correct refreshToken`, async () => {
  const validUserData = {
    email: `ivanov@example.com`,
    password: `ivanov`,
  };

  const app = await createAPI();

  const authResponse = await request(app)
  .post(`/user/auth`)
  .send(validUserData);

  const refreshToken = authResponse.body.refreshToken;

  await request(app)
    .post(`/user/logout`)
    .send({refreshToken})
    .expect(HttpCode.OK);
});

describe(`API doesn't /logout`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If refresh token hasn't been sent`, async () => {
    await request(app)
      .post(`/user/logout`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`If refresh token is invalid`, async () => {
    await request(app)
      .post(`/user/logout`)
      .send({refreshToken: `not-a-valid-refresh-token`})
      .expect(HttpCode.NOT_FOUND);
  });
});

describe(`API on /admin`, () => {
  const adminUserData = {
    email: `ivanov@example.com`,
  };

  const regularUserData = {
    email: `petrov@example.com`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Returns 200 if user is Admin`, async () => {
    await request(app)
      .post(`/user/admin`)
      .send(adminUserData)
      .expect(HttpCode.OK);
  });

  test(`Returns 403 if user is not Admin`, async () => {
    await request(app)
      .post(`/user/admin`)
      .send(regularUserData)
      .expect(HttpCode.FORBIDDEN);
  });

  test(`Returns 400 if user data is not sent`, async () => {
    await request(app)
      .post(`/user/admin`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);
  });
});
