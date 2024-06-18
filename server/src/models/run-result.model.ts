import { t } from 'elysia';

export const RunRequestMetric = t.Object({
  // avgResponseTime: t.Number(),
  // minResponseTime: t.Number(),
  // maxResponseTime: t.Number(),
  // totalRequests: t.Number(),
  // totalFailures: t.Number(),
  // totalSuccesses: t.Number(),
  // totalSentBytes: t.Number(),
  // totalRecvBytes: t.Number(),
  isSuccess: t.Boolean(),
  startTimestamp: t.Number(),
  finishTimestamp: t.Number(),
});

export const RunResultDataItem = t.Object({
  stageIndex: t.Number(),
  vuIndex: t.Number(),
  requestId: t.String(),
  metric: RunRequestMetric,
});

export const RunResult = t.Object({
  id: t.String(),
  projectId: t.String(),
  startTimestamp: t.Number(),
  finishTimestamp: t.Number(),
  stages: t.Array(
    t.Object({
      vus: t.Number(),
      duration: t.Number(),
    }),
  ),
});
