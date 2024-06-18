import httpService from '@/shared/http-service';
import { TDeleteManyDto } from '@/shared/types/delete-many.dto';

import {
  TAddRequestDto,
  TCreateProjectDto,
  TProject,
  TRunResultDetail,
  TUpdateProjectDto,
  TUpdateRequestDto,
} from './project.model';

class ProjectService {
  async getList() {
    return httpService.request<TProject[]>({
      url: '/api/projects',
      method: 'GET',
    });
  }

  async get(id: string) {
    return httpService.request<TProject>({
      url: `/api/projects/${id}`,
      method: 'GET',
    });
  }

  async create(data: TCreateProjectDto) {
    return httpService.request<TProject>({
      url: '/api/projects',
      method: 'POST',
      data,
    });
  }

  async update(id: string, data: TUpdateProjectDto) {
    return httpService.request<TProject>({
      url: `/api/projects/${id}`,
      method: 'PATCH',
      data,
    });
  }

  async delete(id: string) {
    return httpService.request({
      url: `/api/projects/${id}`,
      method: 'DELETE',
    });
  }

  async deleteMany(ids: string[]) {
    return httpService.request({
      url: `/api/projects`,
      method: 'DELETE',
      data: { ids } as TDeleteManyDto,
    });
  }

  async addRequest(projectId: string, data: TAddRequestDto) {
    return httpService.request({
      url: `/api/projects/${projectId}/requests`,
      method: 'POST',
      data,
    });
  }

  async updateRequest(
    projectId: string,
    requestId: string,
    data: TUpdateRequestDto,
  ) {
    return httpService.request<boolean>({
      url: `/api/projects/${projectId}/requests/${requestId}`,
      method: 'PATCH',
      data,
    });
  }

  async deleteRequest(projectId: string, requestId: string) {
    return httpService.request({
      url: `/api/projects/${projectId}/requests/${requestId}`,
      method: 'DELETE',
    });
  }

  async deleteRequests(projectId: string, requestIds: string[]) {
    return httpService.request({
      url: `/api/projects/${projectId}/requests`,
      method: 'DELETE',
      data: { ids: requestIds } as TDeleteManyDto,
    });
  }

  async getResult(projectId: string, resultId: string, withData = false) {
    return httpService.request<TRunResultDetail>({
      url: `/api/projects/${projectId}/results/${resultId}`,
      method: 'GET',
      params: { withData },
    });
  }

  async deleteResult(projectId: string, resultId: string) {
    return httpService.request({
      url: `/api/projects/${projectId}/results/${resultId}`,
      method: 'DELETE',
    });
  }
}

const projectService = new ProjectService();

export default projectService;
