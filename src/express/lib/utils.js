'use strict';

module.exports.prepareErrors = (errors) => {
  const errorsMessages = errors.response.data;

  return Array.isArray(errorsMessages) ? errorsMessages : [errorsMessages];
};
