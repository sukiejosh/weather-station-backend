import mongoose from 'mongoose';
import { paginate } from '../paginate';
import { toJSON } from '../toJSON';
import { IWeatherDataDoc, IWeatherDataModel } from './station.interface';

const weatherDataSchema = new mongoose.Schema<IWeatherDataDoc, IWeatherDataModel>(
  {
    station: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Station',
      required: true,
    },

    bmpTemp: {
      type: Number,
      required: false,
    },

    dhtTemp: {
      type: Number,
      required: false,
    },

    humidity: {
      type: Number,
      required: false,
    },

    pressure: {
      type: Number,
      required: false,
    },

    windspeed: {
      type: Number,
      required: false,
    },

    rainfall: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

weatherDataSchema.plugin(toJSON);
weatherDataSchema.plugin(paginate);

const WeatherData = mongoose.model<IWeatherDataDoc, IWeatherDataModel>('WeatherData', weatherDataSchema);

export default WeatherData;
