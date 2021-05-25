import express from 'express';
import routes from './routes';
import Logger from './logger/logger';
import compression from 'compression';
import * as dotenv from 'dotenv';

// load env var
dotenv.config()

const app = express();
const PORT = process.env.PORT || 8000;

// gzip responses
app.use(compression());

app.use(routes);

const server = app.listen(PORT, () => {
  Logger.info(`Server is up and running @ http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  Logger.info('Shutting down server gracefully');
  server.close(() => {
    Logger.info('shutting down...');
  });
});
