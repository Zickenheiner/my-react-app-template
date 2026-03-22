const isTokenExpired = (token: string | null | unknown): boolean => {
  if (!token || typeof token !== 'string') return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export { isTokenExpired };
