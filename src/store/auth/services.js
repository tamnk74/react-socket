import request from 'utils/request';

export const login = async ({ email, password }) => {
  const res = await request.post('/api/login', {
    email,
    password,
  });
  const { access_token: accessToken, refresh_token: refreshToken } = res;
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  request.setToken(accessToken);

  return request.get('/api/me');
};

export const loginGoogle = async ({ tokenId }) => {
  const { accessToken, refreshToken } = await request.post('/api/auth/google', {
    access_token: tokenId,
  });
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  request.setToken(accessToken);

  return request.get('/api/me');
};

export const getUserInfo = () => {
  return request.get('/api/me');
};

export const logout = () => {
  // remove user from local storage to log user out
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const register = (user) => {
  return request.post(`/auth/register`, user);
};
