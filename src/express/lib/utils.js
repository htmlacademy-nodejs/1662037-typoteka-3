'use strict';

module.exports.prepareErrors = (errors) => {
  const errorsMessages = errors.response.data;

  return typeof errorsMessages === Array ? errorsMessages : [errorsMessages];
};
