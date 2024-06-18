import { Service } from 'typedi';
import { ProjectService } from './project.service';
import { pino } from '@/utils/pino';
import * as uuid from 'uuid';
import type { RunResult, RunResultDataItem } from '@/models/run-result.model';
import type { Static } from 'elysia';
import { db } from '@/models';
import fs from 'fs/promises';
import { sleep } from 'bun';

@Service()
export class RunnerService {
  constructor(private readonly projectService: ProjectService) {}

  async run(projectId: string, ws: any) {
    const project = await this.projectService.getProject(projectId);

    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const envs = project.envs.reduce((obj: any, item) => {
      obj[item.name] = item.value;
      return obj;
    }, {});
    const requests = project.requests.map(request => {
      const json = JSON.stringify(request);
      const envRegex = /\${(.*?)}/g;
      const parsedJson = json.replace(envRegex, (_, key) => envs[key]);
      request = JSON.parse(parsedJson);

      return {
        ...request,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers?.reduce((obj: any, item) => {
            obj[item.name] = item.value;
            return obj;
          }, {}),
        },
        params: request.params?.length
          ? request.params?.reduce((obj: any, item) => {
              obj[item.name] = item.value;
              return obj;
            })
          : undefined,
      };
    });

    pino.info(`Running project ${project.name}`);

    const result: Static<typeof RunResult> = {
      id: uuid.v4().split('-')[4],
      projectId: project.id,
      startTimestamp: Date.now(),
      finishTimestamp: Date.now(),
      stages: project.stages,
    };
    const runResultData: Static<typeof RunResultDataItem>[] = [];

    for (const [stageIndex, stage] of project.stages.entries()) {
      const { vus } = stage;

      for (let vuIndex = 0; vuIndex < vus; vuIndex++) {
        const worker = new Worker(new URL('./runner.worker.ts', import.meta.url).href);
        worker.postMessage({
          duration: stage.duration,
          requests: requests,
        });

        worker.onmessage = event => {
          if (event.data.topic === 'progress') {
            const dataItem = {
              stageIndex,
              vuIndex,
              ...event.data.payload,
            };

            runResultData.push(dataItem);

            // ws.send(JSON.stringify(dataItem));
          } else if (event.data.topic === 'done') {
            worker.terminate();
          }
        };
      }

      await sleep(stage.duration * 1000);
    }

    result.finishTimestamp = Date.now();

    await db.read();

    project.runResults.unshift(result);
    db.data.projects = db.data.projects.map(p => (p.id === project.id ? project : p));

    ws.send(
      JSON.stringify({
        topic: 'done',
        payload: {
          projectId,
          resultId: result.id,
        },
      }),
    );

    await db.write();

    await fs.writeFile(
      `data/run-results/${result.id}.json`,
      JSON.stringify(runResultData, null, 2),
    );
  }

  async getRunResult(projectId: string, id: string, withData = false) {
    await db.read();

    const project = db.data.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const result = project.runResults.find(result => result.id === id);

    if (!result) {
      throw new Error(`Run result with id ${id} not found`);
    }

    if (!withData) {
      return result;
    }

    const runResultData = await fs.readFile(`data/run-results/${id}.json`, 'utf-8');
    if (!runResultData) {
      throw new Error(`Run result data with id ${id} not found`);
    }

    return {
      ...result,
      data: JSON.parse(runResultData),
    };
  }

  async deleteResult(projectId: string, id: string) {
    await db.read();

    const project = db.data.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    project.runResults = project.runResults.filter(result => result.id !== id);

    await db.write();

    await fs.unlink(`data/run-results/${id}.json`);
  }
}
