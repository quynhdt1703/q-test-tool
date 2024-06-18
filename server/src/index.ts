import { Elysia, t } from 'elysia';
import Container from 'typedi';
import { ProjectService } from './services/project.service';
import swagger from '@elysiajs/swagger';
import { logger } from '@bogeychan/elysia-logger';
import {
  AddRequestDto,
  CreateProjectDto,
  UpdateRequestDto,
  UpdateProjectDto,
} from './models/project.model';
import 'reflect-metadata';
import { configDotenv } from 'dotenv';
import { pino, pinoTransport } from './utils/pino';
import { RunnerService } from './services/runner.service';
import { cors } from '@elysiajs/cors';
import { DeleteManyDto } from './models/common.model';
import { staticPlugin } from '@elysiajs/static';

configDotenv();

const projectService = Container.get(ProjectService);
const runnerService = Container.get(RunnerService);

const PORT = process.env.PORT || 8080;

const app = new Elysia()
  .use(logger({ transport: pinoTransport }))
  .use(cors())
  .on('error', ctx => {
    pino.error(ctx, ctx.error.name, { ctx });
  })
  .use(swagger({ path: '/api-docs' }))
  .use(staticPlugin({ prefix: '/', assets: '../client/dist' }))
  .get('/', ({ set }) => {
    set.redirect = '/index.html';
  })
  .group('/api/projects', app =>
    app
      .get('/', () => projectService.getProjects())
      .get('/:id', ({ params }) => projectService.getProject(params.id))
      .post('/', ({ body }) => projectService.createProject(body), {
        body: CreateProjectDto,
      })
      .patch('/:id', ({ params, body }) => projectService.updateProject(params.id, body), {
        body: UpdateProjectDto,
      })
      .delete('/:id', ({ params }) => projectService.deleteProject(params.id))
      .delete('/', ({ body }) => projectService.deleteProjects(body.ids), {
        body: DeleteManyDto,
      })
      .post('/:id/requests', ({ params, body }) => projectService.addRequest(params.id, body), {
        body: AddRequestDto,
      })
      .patch(
        '/:id/requests/:rid',
        ({ params, body }) => projectService.updateRequest(params.id, params.rid, body),
        {
          body: UpdateRequestDto,
        },
      )
      .delete('/:id/requests/:rid', ({ params }) =>
        projectService.deleteRequest(params.id, params.rid),
      )
      .delete(
        '/:id/requests',
        ({ params, body }) => projectService.deleteRequests(params.id, body.ids),
        { body: DeleteManyDto },
      )
      .get('/:id/run', ({ params }) => runnerService.run(params.id, null))
      .get('/:id/results/:resultId', ({ params, query }) =>
        runnerService.getRunResult(params.id, params.resultId, query.withData === 'true'),
      )
      .delete('/:id/results/:resultId', ({ params }) =>
        runnerService.deleteResult(params.id, params.resultId),
      ),
  )
  .ws('/api/ws', {
    open(ws) {},
    body: t.Object({
      event: t.Union([t.Literal('run'), t.Literal('run-stop')]),
      payload: t.Object({
        projectId: t.String(),
      }),
    }),
    message(ws, data) {
      if (data.event === 'run') {
        runnerService.run(data.payload.projectId, ws);
      }
    },
  })
  .listen(PORT);

pino.info(`Server started at http://localhost:${PORT}`);
