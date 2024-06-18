import { JSONFilePreset } from 'lowdb/node';
import { Project } from './project.model';
import { t, type Static } from 'elysia';
import { RunResult } from './run-result.model';

const Db = t.Object({
  projects: t.Array(Project),
});

type TDb = Static<typeof Db>;

export const db = await JSONFilePreset<TDb>('db.json', {
  projects: [],
});
