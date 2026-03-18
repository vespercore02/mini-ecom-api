const logger = require("../utils/logger");

module.exports = function (req, res, next) {

  const start = Date.now();

  res.on("finish", () => {

    const responseTime = Date.now() - start;

    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ip: req.ip,
      responseTime: `${responseTime}ms`
    });

  });

  next();

};