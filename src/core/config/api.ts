interface Config {
  url: string;
  method: string;
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
  return response;
};

export const endpoints = {
  users: 'users/',
};
