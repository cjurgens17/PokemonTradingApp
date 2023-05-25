export const environment = {
  production: true,
  withCredentials: true,
  baseUrl: 'https://pokemon-server.herokuapp.com/',
  headers: {
    'content-type' : 'application/json',
    'Access-Control-Allow-Origin': 'https://pokemon-trading.herokuapp.com/'
  }
};
