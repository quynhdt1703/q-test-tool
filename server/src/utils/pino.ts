import { createPinoLogger } from '@bogeychan/elysia-logger';

export const pinoTransport = {
  targets: [
    {
      level: 'info',
      target: 'pino/file',
      options: {
        destination: 'logs/app.log',
      },
    },
    {
      level: 'error',
      target: 'pino/file',
      options: {
        destination: 'logs/error.log',
      },
    },
    {
      target: 'pino-pretty',
      options: {},
    },
  ],
};

export const pino = createPinoLogger({
  transport: pinoTransport,
});
