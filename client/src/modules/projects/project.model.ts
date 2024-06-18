export type TNameValue = {
  name: string;
  value: string;
};

export type TProjectStage = {
  vus: number;
  duration: number;
};

export type TRequestProtocol = 'http' | 'https';

export type TRequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD';

export type TRequest = {
  id: string;
  name: string;
  protocol: TRequestProtocol;
  host: string;
  port: number;
  path: string;
  method: TRequestMethod;
  headers?: TNameValue[];
  params?: TNameValue[];
  body?: string;
};

export type TRunRequestMetric = {
  // avgResponseTime: number;
  // minResponseTime: number;
  // maxResponseTime: number;
  // totalRequests: number;
  // totalFailures: number;
  // totalSuccesses: number;
  // totalSentBytes: number;
  // totalRecvBytes: number;
  isSuccess: boolean;
  startTimestamp: number;
  finishTimestamp: number;
};

export type TRunResultDataItem = {
  stageIndex: number;
  vuIndex: number;
  requestId: string;
  metric: TRunRequestMetric;
};

export type TRunResult = {
  id: string;
  projectId: string;
  startTimestamp: number;
  finishTimestamp: number;
  stages: TProjectStage[];
};

export type TRunResultDetail = TRunResult & {
  data: TRunResultDataItem[];
};

export type TProject = {
  id: string;
  name: string;
  description?: string;
  stages: TProjectStage[];
  envs: TNameValue[];
  requests: TRequest[];
  runResults: TRunResult[];
};

export type TCreateProjectDto = {
  name: string;
  description?: string;
  stages?: TProjectStage[];
  envs?: TNameValue[];
};

export type TUpdateProjectDto = {
  name?: string;
  description?: string;
  stages?: TProjectStage[];
  envs?: TNameValue[];
};

export type TAddRequestDto = {
  name: string;
  protocol: TRequestProtocol;
  host: string;
  port: number;
  path: string;
  method: TRequestMethod;
  headers?: TNameValue[];
  params?: TNameValue[];
  body?: string;
};

export type TUpdateRequestDto = {
  name?: string;
  protocol?: TRequestProtocol;
  host?: string;
  port?: number;
  path?: string;
  method?: TRequestMethod;
  headers?: TNameValue[];
  params?: TNameValue[];
  body?: string;
};
