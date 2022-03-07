'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const socket = io(SERVER_URL);

  const MAX_TEXT_LENGTH = 100;

  const latestCommentsListElement = document.querySelector(`.last__list`);
  const mostCommentedListElement = document.querySelector(`.hot__list`);

  const truncateText = (text) =>
    text.length > MAX_TEXT_LENGTH
      ? text.slice(0, MAX_TEXT_LENGTH).concat('...')
      : text;

  const createCommentElement = (comment) => {
    const newComment = document.createElement(`div`);

    newComment.innerHTML = `
    <li class="last__list-item">
      <img class="last__list-image" src="/img/${
        comment.users.avatar ? comment.users.avatar : `/icons/smile.svg`
      }" width="20" height="20" alt="Аватар пользователя">
      <b class="last__list-name">${comment.users.name} ${
      comment.users.surname
    }</b>
      <a class="last__list-link" href="/articles/${comment.articleId}">
        ${truncateText(comment.text)}
      </a>
    </li>`;

    return newComment.firstElementChild;
  };

  const createArticleElement = (article) => {
    const newArticle = document.createElement(`div`);

    newArticle.innerHTML = `
    <li class="hot__list-item">
      <a class="hot__list-link" href="/articles/${article.id}">
      ${truncateText(article.announce)}<sup class="hot__link-sup">${article.commentsCount}</sup>
      </a>
    </li>`;

    return newArticle.firstElementChild;
  };

  socket.addEventListener(
    'updateHotSection',
    ({latestComments, latestArticles}) => {
      latestCommentsListElement.innerHTML = ``;
      mostCommentedListElement.innerHTML = ``;

      latestComments.forEach((comment) =>
        latestCommentsListElement.appendChild(createCommentElement(comment)),
      );

      latestArticles.forEach((article) =>
        mostCommentedListElement.appendChild(createArticleElement(article)),
      );
    },
  );
})();
