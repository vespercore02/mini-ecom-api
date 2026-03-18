const logger = require("../utils/logger");

module.exports = function (err, req, res, next) {

  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  res.status(500).json({
    message: "Internal Server Error"
  });

};