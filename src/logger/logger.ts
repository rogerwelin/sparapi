import winston from 'winston';

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
}

winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  )
  const transports = [
    new winston.transports.Console(),
  ]

  const Logger = winston.createLogger({
    level: 'info',
    format,
    transports,
  })

  export default Logger