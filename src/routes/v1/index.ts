import express, { Router } from 'express';
import config from '../../config/config';
import authRoute from './auth.route';
import stationRoute from './stations.route';
import docsRoute from './swagger.route';
import userRoute from './user.route';
import weatherData from './weatherData.route';
const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/stations',
    route: stationRoute,
  },
  {
    path: '/weather',
    route: weatherData,
  }
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
