const winstonLogger = require('winston');

const winston = winstonLogger.createLogger({
    format: winstonLogger.format.json(),
    transports: [new winstonLogger.transports.Console()],
    level: "debug"
});

module.exports = winston;
