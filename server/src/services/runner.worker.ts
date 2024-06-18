import type { Project } from '@/models/project.model';
import type { Static } from 'elysia';
import type { RunRequestMetric, RunResult } from '@/models/run-result.model';
import { sleep } from 'bun';

declare var self: Worker;

self.onmessage = async (
  event: MessageEvent<{
    duration: number;
    requests: any[];
  }>,
) => {
  const { data } = event;
  const { requests } = data;

  const metricsMaps = new Map<string, Array<any>>();
  const metrics: Array<Static<typeof RunRequestMetric>> = [];

  let remainingTime = data.duration * 1000;

  while (remainingTime > 0) {
    for (const request of requests) {
      const requestStartTimestamp = Date.now();
      let requestEndTimestamp = Date.now() - 1;
      let metric: Static<typeof RunRequestMetric> | undefined = undefined;

      const query = request.params ? `?${new URLSearchParams(request.params)}` : '';

      if (request.method === 'POST') {
        console.log(request);
      }

      try {
        const response = await fetch(
          `${request.protocol}://${request.host}:${request.port}${request.path}` + query,
          {
            method: request.method,
            body: request.body || undefined,
            headers: {
              'Content-Type': 'application/json',
              ...request.headers,
            },
          },
        );
        requestEndTimestamp = Date.now();

        metric = {
          isSuccess: response.status < 400,
          startTimestamp: requestStartTimestamp,
          finishTimestamp: requestEndTimestamp,
        };
      } catch (error: any) {
        requestEndTimestamp = Date.now();

        metric = {
          isSuccess: false,
          startTimestamp: requestStartTimestamp,
          finishTimestamp: requestEndTimestamp,
        };
      } finally {
        if (requestEndTimestamp - requestStartTimestamp < 1000) {
          await sleep(1000 - (requestEndTimestamp - requestStartTimestamp));
        }

        remainingTime -= requestEndTimestamp - requestStartTimestamp;
        if (remainingTime <= 0) {
          break;
        }

        self.postMessage({
          topic: 'progress',
          payload: {
            requestId: request.id,
            metric,
          },
        });

        if (metric) {
          metricsMaps.set(request.id, [...(metricsMaps.get(request.id) || []), metric]);
          metrics.push(metric);
        }
      }
    }
  }

  self.postMessage({
    topic: 'done',
    payload: metrics,
  });
};
