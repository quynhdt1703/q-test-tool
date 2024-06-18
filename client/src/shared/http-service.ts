import axios, { AxiosRequestConfig, Method } from 'axios';

type THttpRequest = {
  url: string;
  method: Method;
  data?: any;
  params?: any;
  contentType?: string;
  paramsSerializer?: (params: any) => string;
};

class HttpService {
  public readonly http = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 30000,
  });

  constructor() {}

  async request<T>({
    url,
    params,
    data,
    method,
    contentType,
    paramsSerializer,
  }: THttpRequest): Promise<T> {
    const config: AxiosRequestConfig = {
      url,
      method,
      params,
      data,
      headers: {
        'Content-Type': contentType || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      paramsSerializer,
    };

    const response = await this.http.request<T>(config);

    return response.data;
  }
}

const httpService = new HttpService();

export default httpService;
