import { ApiError } from '../errors/api.error';
import { getAccessToken } from '../stores/accessToken.store';
import type { QueryParams } from '../types/query.type';

interface Config {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  query?: QueryParams;
  data?: unknown;
  requireToken?: boolean;
}

const request = async <T = unknown>(config: Config): Promise<T> => {
  const init: RequestInit = {
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
    body: JSON.stringify(config.data),
  };

  if (config.query) {
    const searchParams = new URLSearchParams();

    Object.entries(config.query).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    config.url += `?${searchParams.toString()}`;
  }

  if (config.requireToken) {
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    };
  }

  const response: Response = await fetch(
    `${import.meta.env.VITE_API_URL}${config.url}`,
    init,
  );

  if (!response.ok) throw new ApiError(response.statusText, response.status);

  return await response.json();
};

export default request;
