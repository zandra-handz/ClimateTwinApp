import { View, Text } from "react-native";
import React from "react";
import CurrentSurroundingsUICard from "./CurrentSurroundingsUICard";


//maybe get wind direction and wind speed of both home and portal locations and animate that way?

const WindFriendsView = ({
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
                  <CurrentSurroundingsUICard
              label={'Winds'}
              value={'value'}
            /> 
  );
};

export default WindFriendsView;



