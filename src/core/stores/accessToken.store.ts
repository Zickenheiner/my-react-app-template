import secureLocalStorage from 'react-secure-storage';

const getAccessToken = () => {
  return secureLocalStorage.getItem('accessToken');
};

const setAccessToken = (token: string) => {
  secureLocalStorage.setItem('accessToken', token);
};

const removeAccessToken = () => {
  secureLocalStorage.removeItem('accessToken');
};

export { getAccessToken, setAccessToken, removeAccessToken };
