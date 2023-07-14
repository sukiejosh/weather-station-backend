import { Request, Response } from 'express';
import httpStatus from "http-status";
import mongoose from 'mongoose';
import { ApiError } from '../errors';
import { IOptions } from '../paginate/paginate';
import { IUserDoc } from '../user/user.interfaces';
import { catchAsync, pick } from "../utils";
import * as stationService from "./station.service";


export const registerStation = catchAsync(async (req: Request, res: Response) => {
  const station = await stationService.registerStation(req.body, req.user as IUserDoc);
  res.status(httpStatus.CREATED).send(station);
});

export const getRegToken = catchAsync(async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req.user?.id
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const token = await stationService.generateStationToken(userId);
  res.status(httpStatus.CREATED).send(token);
});

export const saveWeatherData = catchAsync(async (req: Request, res: Response) => {
  const stationId = req.params['stationId'];
  let s
  if (typeof stationId === 'string') {
    s = await stationService.getStationByIdentifier(stationId);
    if (!s) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Station not found');
    }
  }
  const station = await stationService.saveWeatherData(s?.id, req.body as IUserDoc);
  res.status(httpStatus.CREATED).send(station);
});

export const getStations = catchAsync(async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req.user?.id
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const { lang, lat } = req.body

  if (lang && !lat || !lang && lat) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Both lang and lat are required');
  }

  //@ts-ignore
  const filter = { ...pick(req.query, ['name', 'identifier', 'lang', 'lat']), owner: userId }
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const stations = await stationService.queryStations(filter, options);
  console.log('ss', stations)
  res.send(stations);
});

export const getWeatherData = catchAsync(async (req: Request, res: Response) => {
  const stationId = req.params['stationId'];
  let s
  if (typeof stationId === 'string') {
    s = await stationService.getStationByIdentifier(stationId);
    if (!s) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Station not found');
    }
  }
  const filter = { station: s?.id }
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);

  const weatherData = await stationService.getWeatherData(filter, options);
  res.status(httpStatus.CREATED).send(weatherData);
});


export const getStation = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['stationId'] === 'string') {
    const station = await stationService.getStationById(new mongoose.Types.ObjectId(req.params['stationId']));
    if (!station) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Station not found');
    }
    res.send(station);
  }
});

export const updateStation = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['stationId'] === 'string') {
    const station = await stationService.updateStationById(new mongoose.Types.ObjectId(req.params['stationId']), req.body);
    res.send(station);
  }
});

export const deleteStation = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['stationId'] === 'string') {
    await stationService.deleteStationById(new mongoose.Types.ObjectId(req.params['stationId']));
    res.status(httpStatus.NO_CONTENT).send();
  }
});
