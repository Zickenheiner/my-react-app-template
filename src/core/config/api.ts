import { ApiError } from '../errors/api.error';

interface Config {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  headers?: HeadersInit;
  data?: any;
  requireToken?: boolean;
}

export const request = async (config: Config) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}${config.url}`, {
    method: config.method,
    headers: config.headers,
    body: config.data,
  });
  if (!response.ok) throw new ApiError(response.statusText, response.status);
  return await response.json();
};

export const endpoints = {};

export const methods = {
  post: 'POST',
  get: 'GET',
  patch: 'PATCH',
  delete: 'DELETE',
};
