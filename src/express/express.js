'use strict';

const express = require(`express`);
const helmet = require(`helmet`);
const path = require(`path`);
const cookieParser = require(`cookie-parser`);
const mainRoutes = require(`./routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const {HttpCode} = require(`../const`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();
app.locals.moment = require(`moment`);

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'default-src':
            helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
          'scriptSrc': [`cdn.socket.io`, `'self'`, `'unsafe-eval'`],
        },
      },
      referrerPolicy: {policy: `same-origin`},
      xssFilter: true,
    }),
);

app.use(cookieParser());

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use((req, res) => res.status(HttpCode.NOT_FOUND).render(`errors/404`));

app.use((err, _req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT);
