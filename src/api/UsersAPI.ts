import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseAPI } from './BaseAPI';
import { env } from '../utils/env';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

export class UsersAPI extends BaseAPI {
  private readonly usersUrl: string;

  constructor(request: APIRequestContext) {
    super(request);
    this.usersUrl = `${env.apiBaseUrl}/api/users`;
  }

  listUsers(page = 1): Promise<APIResponse> {
    return this.get(this.usersUrl, { params: { page } });
  }

  getUser(id: number): Promise<APIResponse> {
    return this.get(`${this.usersUrl}/${id}`);
  }

  createUser(name: string, job: string): Promise<APIResponse> {
    return this.post(this.usersUrl, { data: { name, job } });
  }

  updateUser(id: number, name: string, job: string): Promise<APIResponse> {
    return this.put(`${this.usersUrl}/${id}`, { data: { name, job } });
  }

  patchUser(id: number, data: { name?: string; job?: string }): Promise<APIResponse> {
    return this.patch(`${this.usersUrl}/${id}`, { data });
  }

  deleteUser(id: number): Promise<APIResponse> {
    return this.delete(`${this.usersUrl}/${id}`);
  }
}