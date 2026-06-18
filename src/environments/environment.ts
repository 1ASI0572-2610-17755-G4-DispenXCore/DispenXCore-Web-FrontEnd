export const environment = {
  production: true,
  apiBaseUrl: 'https://dispenxcore-backend-production.up.railway.app/api/v1',
  signInPath: '/auth/login',
  signUpPath: '/auth/register',
  usersEndpointPath: '/users',
  dispensatorsPath: '/dispensators',
  schedulesPath: '/schedules',
  dispenserEventsPath: '/dispenser-events',
  dispensatorStatusPath: '/dispensators', // GET /dispensators/{id} devuelve el status
  notificationsPath: '/notifications',
  devicePath: '/device',
  firmwarePath: '/firmware',
};
