import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { useSurroundingsWS } from "../context/SurroundingsWSContext";
import { getLiveWeather } from "../calls/liveweathercall";


interface LiveWeather {
  coord: { lon: number; lat: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  base: string;
  main: { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number; sea_level?: number; grnd_level?: number };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

const defaultLiveWeather: LiveWeather = {
  coord: { lon: 0, lat: 0 },
  weather: { id: 0, main: "", description: "", icon: "" },
  base: "",
  main: { temp: 0, feels_like: 0, temp_min: 0, temp_max: 0, pressure: 0, humidity: 0 },
  visibility: 0,
  wind: { speed: 0, deg: 0 },
  clouds: { all: 0 },
  dt: 0,
  sys: { country: "", sunrise: 0, sunset: 0 },
  timezone: 0,
  id: 0,
  name: "",
  cod: 0,
};

const useLiveWeather = () => {
  const { isAuthenticated, isInitializing } = useUser();
  const { lastLocationId, lastLatAndLong } = useSurroundingsWS();
  const [lat, lon] = Array.isArray(lastLatAndLong) ? lastLatAndLong : [null, null]; 
  const locationCacheExpiration = 1000 * 60 * 60; // 1 hour

  const [liveWeather, setLiveWeather] = useState<LiveWeather>(defaultLiveWeather);
  const [ liveTemperature, setLiveTemperature ] = useState(null);
  const [ liveWeatherId, setLiveWeatherId] = useState(null);
  const [liveWeatherString, setLiveWeatherString] = useState<string>('');


  const {
    data: liveWeatherData,
    isFetching,
    isPending,
    isSuccess,
  } = useQuery<LiveWeather | null>({
    queryKey: ["liveWeather", lastLocationId, lat, lon],
    queryFn: () => getLiveWeather({ lat, lon }),
    enabled: !!isAuthenticated && !!lastLocationId && !isInitializing && !!lastLatAndLong,
    staleTime: locationCacheExpiration,
    gcTime: locationCacheExpiration,
  });

  useEffect(() => {
    if (liveWeatherData) {
      // Set live weather data first
      setLiveWeather(liveWeatherData); 
      setLiveTemperature(liveWeatherData.main.temp || null);
      
      // Set the weather string before id
      setLiveWeatherString(JSON.stringify(liveWeatherData));
      
      // Now set the weather id after the string is set
      setLiveWeatherId(liveWeatherData.weather[0]?.id || null);
    } else {
      setLiveWeather(defaultLiveWeather);
      setLiveTemperature(null);
      setLiveWeatherId(null);
      setLiveWeatherString('');
    }
  }, [liveWeatherData]);
  

  return { liveWeather, liveTemperature, liveWeatherId, liveWeatherString, isFetching, isPending, isSuccess };
};
export default useLiveWeather;
