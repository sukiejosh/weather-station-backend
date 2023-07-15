import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { stationController } from '../../modules/stations';

const router: Router = express.Router();

router.route('/').post(auth(), stationController.registerStation).get(auth(), stationController.getStations);
router.get('/gettoken', auth(), stationController.getRegToken);
router.post('/create', auth(), stationController.registerStation);
router.route('/:stationId')
  .patch(stationController.updateStation)
  .get(stationController.getStation)


export default router;
