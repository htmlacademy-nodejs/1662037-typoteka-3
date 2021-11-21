'use strict';

const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../const`);
const fs = require(`fs`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const MAX_ANNOUNCE_SENTENCES = 5;
const MAX_FULL_TEXT_SENTENCES = 10;
const MAX_CATEGORIES = 3;
const MAX_DAYS_PERIOD = 90;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать,`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`,
];

const ANNOUNCE = [
  `Ёлки — это не просто красивое дерево.`,
  `Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего.`,
  `Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка.`,
  `Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно.`,
  `Возьмите новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно.`,
  `Просто действуйте.`,
  `Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания.`,
  `Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами.`,
  `Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать?`,
  `Для начала просто соберитесь.`,
  `Игры и программирование разные вещи.`,
  `Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года.`,
  `Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`,
];

function getRandomDate() {
  const today = new Date();
  return new Date(
      today.setDate(today.getDate() - getRandomInt(0, MAX_DAYS_PERIOD)),
  );
}

const generateMocks = (count) =>
  Array(count)
    .fill({})
    .map(() => ({
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
      createdDate: getRandomDate(),
      announce: shuffle(ANNOUNCE).slice(
          0,
          getRandomInt(1, MAX_ANNOUNCE_SENTENCES),
      ),
      fullText: shuffle(ANNOUNCE).slice(
          0,
          getRandomInt(MAX_ANNOUNCE_SENTENCES, MAX_FULL_TEXT_SENTENCES),
      ),
      category: shuffle(CATEGORIES).slice(0, getRandomInt(1, MAX_CATEGORIES)),
    }));

module.exports = {
  name: `--generate`,
  run(args) {
    const [param] = args;
    const count = Number.parseInt(param, 10) || DEFAULT_COUNT;

    if (count > 1000) {
      console.info(`Не больше 1000 публикаций`);
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generateMocks(count));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  },
};
