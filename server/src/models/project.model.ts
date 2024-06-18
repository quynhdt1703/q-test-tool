import { t } from 'elysia';
import { NameValue } from './common.model';
import { RunResult } from './run-result.model';

export const ProjectStage = t.Object({
  vus: t.Number(),
  duration: t.Number(),
});

const RequestMethod = t.Union([
  t.Literal('GET'),
  t.Literal('POST'),
  t.Literal('PUT'),
  t.Literal('DELETE'),
  t.Literal('PATCH'),
  t.Literal('OPTIONS'),
  t.Literal('HEAD'),
]);

const RequestProtocol = t.Union([t.Literal('http'), t.Literal('https')]);

export const Request = t.Object({
  id: t.String(),
  name: t.String(),
  protocol: RequestProtocol,
  host: t.String(),
  port: t.Number(),
  path: t.String(),
  method: RequestMethod,
  headers: t.Optional(t.Array(NameValue)),
  params: t.Optional(t.Array(NameValue)),
  body: t.Optional(t.String()),
});

export const Project = t.Object({
  id: t.String(),
  name: t.String(),
  description: t.Optional(t.String()),
  stages: t.Array(ProjectStage),
  envs: t.Array(NameValue),
  requests: t.Array(Request),
  runResults: t.Array(RunResult),
});

export const CreateProjectDto = t.Object({
  name: t.String(),
  description: t.Optional(t.String()),
  stages: t.Optional(t.Array(ProjectStage)),
  envs: t.Optional(t.Array(NameValue)),
});

export const UpdateProjectDto = t.Object({
  name: t.Optional(t.String()),
  description: t.Optional(t.String()),
  stages: t.Optional(t.Array(ProjectStage)),
  envs: t.Optional(t.Array(NameValue)),
});

export const AddRequestDto = t.Object({
  name: t.String(),
  protocol: RequestProtocol,
  host: t.String(),
  port: t.Number(),
  path: t.String(),
  method: RequestMethod,
  headers: t.Optional(t.Array(NameValue)),
  params: t.Optional(t.Array(NameValue)),
  body: t.Optional(t.String()),
});

export const UpdateRequestDto = t.Object({
  name: t.Optional(t.String()),
  protocol: t.Optional(RequestProtocol),
  host: t.Optional(t.String()),
  port: t.Optional(t.Number()),
  path: t.Optional(t.String()),
  method: t.Optional(RequestMethod),
  headers: t.Optional(t.Array(NameValue)),
  params: t.Optional(t.Array(NameValue)),
  body: t.Optional(t.String()),
});
