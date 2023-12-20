import { useState } from 'react';

interface UserToken {
  token: string | null;
}

interface UseTokenResult {
  setToken: (userToken: UserToken) => void;
  token: string | null;
}

export default function useToken(): UseTokenResult {
  const getToken = (): string | null => {
    const tokenString = localStorage.getItem('token');
    const userToken: UserToken = JSON.parse(tokenString || 'null');
    return userToken?.token;
  };

  const [token, setToken] = useState<string | null>(getToken());

  const saveToken = (userToken: UserToken): void => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token,
  };
}
