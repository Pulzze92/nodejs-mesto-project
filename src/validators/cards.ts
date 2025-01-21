import { celebrate, Joi } from 'celebrate';

const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+\.[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=#]*$/;

export const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex),
  }),
});

export const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});