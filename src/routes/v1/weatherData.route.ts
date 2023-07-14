import express, { Router } from "express";
import { stationController } from "../../modules/stations";

const router: Router = express.Router();
router.route("/:stationId")
  .post(stationController.saveWeatherData)
  .get(stationController.getWeatherData)

export default router;
