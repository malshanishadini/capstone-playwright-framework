import { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../utils/env';

type RequestOptions = {
  params?: Record<string, string | number>;
  data?: unknown;
};

export class BaseAPI {
  constructor(protected request: APIRequestContext) {}

  protected get headers() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': env.reqresApiKey,
      'User-Agent': 'capstone-playwright-tests/1.0',
    };
  }

  async get(url: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.request.get(url, { headers: this.headers, params: options.params });
  }

  async post(url: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.request.post(url, { headers: this.headers, data: options.data });
  }

  async put(url: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.request.put(url, { headers: this.headers, data: options.data });
  }

  async patch(url: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.request.patch(url, { headers: this.headers, data: options.data });
  }

  async delete(url: string): Promise<APIResponse> {
    return this.request.delete(url, { headers: this.headers });
  }

  async getResponseBody<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }
}