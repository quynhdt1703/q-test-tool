import { db } from '@/models';
import {
  UpdateRequestDto,
  AddRequestDto,
  CreateProjectDto,
  UpdateProjectDto,
} from '@/models/project.model';
import type { Static } from 'elysia';
import { Service } from 'typedi';
import * as uuid from 'uuid';

@Service()
export class ProjectService {
  async getProjects() {
    await db.read();

    return db.data.projects;
  }

  async getProject(id: string) {
    await db.read();

    return db.data.projects.find(g => g.id === id) || null;
  }

  async createProject(input: Static<typeof CreateProjectDto>) {
    await db.read();

    const newId = uuid.v4().split('-')[4];
    db.data.projects.push({
      id: newId,
      name: input.name,
      stages: input.stages || [],
      envs: input.envs || [],
      requests: [],
      runResults: [],
    });

    await db.write();

    return db.data.projects.find(g => g.id === newId) || null;
  }

  async updateProject(id: string, input: Static<typeof UpdateProjectDto>) {
    await db.read();

    const project = db.data.projects.find(g => g.id === id);

    if (!project) {
      return null;
    }

    project.name = input.name || project.name;
    project.description = input.description || project.description;
    project.stages = input.stages || project.stages;
    project.envs = input.envs || project.envs;

    await db.write();

    return project;
  }

  async deleteProject(id: string) {
    await db.read();

    db.data.projects = db.data.projects.filter(g => g.id !== id);

    await db.write();
  }

  async deleteProjects(ids: string[]) {
    await db.read();

    db.data.projects = db.data.projects.filter(g => !ids.includes(g.id));

    await db.write();
  }

  async addRequest(projectId: string, input: Static<typeof AddRequestDto>) {
    await db.read();

    const group = db.data.projects.find(g => g.id === projectId);

    if (!group) {
      return null;
    }

    group.requests.push({
      id: uuid.v4().split('-')[4],
      name: input.name,
      protocol: input.protocol,
      host: input.host,
      port: input.port,
      path: input.path,
      method: input.method,
      headers: input.headers,
      params: input.params,
      body: input.body,
    });

    await db.write();

    return group;
  }

  async deleteRequest(projectId: string, requestId: string) {
    await db.read();

    const group = db.data.projects.find(g => g.id === projectId);

    if (!group) {
      return null;
    }

    group.requests = group.requests.filter(e => e.id !== requestId);

    await db.write();

    return group;
  }

  async updateRequest(
    projectId: string,
    requestId: string,
    input: Static<typeof UpdateRequestDto>,
  ) {
    await db.read();

    const group = db.data.projects.find(g => g.id === projectId);

    if (!group) {
      return null;
    }

    const endpoint = group.requests.find(e => e.id === requestId);

    if (!endpoint) {
      return null;
    }

    endpoint.name = input.name || endpoint.name;
    endpoint.protocol = input.protocol || endpoint.protocol;
    endpoint.host = input.host || endpoint.host;
    endpoint.port = input.port || endpoint.port;
    endpoint.path = input.path || endpoint.path;
    endpoint.method = input.method || endpoint.method;
    endpoint.headers = input.headers || endpoint.headers;
    endpoint.params = input.params || endpoint.params;
    endpoint.body = input.body || endpoint.body;

    await db.write();

    return group;
  }

  async deleteRequests(proejctId: string, requestIds: string[]) {
    await db.read();

    const group = db.data.projects.find(g => g.id === proejctId);

    if (!group) {
      return null;
    }

    group.requests = group.requests.filter(e => !requestIds.includes(e.id));

    await db.write();

    return group;
  }
}
