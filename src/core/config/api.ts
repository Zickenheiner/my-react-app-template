import { ApiError } from '../errors/api.error';

interface Config {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  data?: unknown;
  requireToken?: boolean;
}

export const request = async <T = unknown>(config: Config): Promise<T> => {
  const init: RequestInit = {
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
    body: JSON.stringify(config.data),
  };
  const response: Response = await fetch(
    `${import.meta.env.VITE_API_URL}${config.url}`,
    init,
  );
  if (!response.ok) throw new ApiError(response.statusText, response.status);
  return await response.json();
};

export const methods = {
  POST: 'POST',
  GET: 'GET',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const endpoints = {};
