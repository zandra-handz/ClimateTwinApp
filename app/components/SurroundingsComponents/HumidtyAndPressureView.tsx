import { View, Text } from "react-native";
import React from "react";
import MediumUICard from "../Scaffolding/MediumUICard";


//maybe get wind direction and wind speed of both home and portal locations and animate that way?

const HumidityAndPressureView = ({
  description,
  windSpeed,
  windDirection,
  cloudiness,
  windFriends,
  specialHarmony,
  details,
  experience,
  windSpeedInteraction,
  pressureInteraction,
  humidtyInteraction,
  strongerWindInteraction,
}) => {
  return ( 
                  <MediumUICard
              label={'Winds'}
              value={'value'}
            /> 
  );
};

export default HumidityAndPressureView;



