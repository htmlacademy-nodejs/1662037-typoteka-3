'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../const`);

const ErrorRegisterMessage = {
  NAME: `Name shouldn't include special characters or numbers`,
  EMAIL: `Email is invalid`,
  EMAIL_EXIST: `Email is already registered`,
  PASSWORD: `Password should be at least 6 characters long`,
  PASSWORD_REPEATED: `Passwords do not match`,
  AVATAR: `Image is not choosen or format is not supported`,
};

const schema = Joi.object({
  name: Joi.string()
    .pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/)
    .required()
    .messages({
      'string.pattern.base': ErrorRegisterMessage.NAME,
    }),
  email: Joi.string().email().required().messages({
    'string.email': ErrorRegisterMessage.EMAIL,
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': ErrorRegisterMessage.PASSWORD,
  }),
  passwordRepeated: Joi.string()
    .required()
    .valid(Joi.ref(`password`))
    .required()
    .messages({
      'any.only': ErrorRegisterMessage.PASSWORD_REPEATED,
    }),
  avatar: Joi.string().required().messages({
    'string.empty': ErrorRegisterMessage.AVATAR,
  }),
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .send(ErrorRegisterMessage.EMAIL_EXIST);
  }

  return next();
};
