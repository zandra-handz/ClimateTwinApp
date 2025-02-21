import { View, Text } from "react-native";
import React from "react";
import WindFriendsUICard from "./WindFriendsUICard";

//maybe get wind direction and wind speed of both home and portal locations and animate that way?

const WindFriendsView = ({
  name,
  description,
  windSpeed,
  windDirection,
  homeDescription,
  homeWindSpeed,
  homeWindDirection,
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
    <WindFriendsUICard
      name={name}
      description={description}
      windFriends={windFriends}
      windSpeed={windSpeed}
      windDirection={windDirection}
      homeDescription={homeDescription}
      homeWindSpeed={homeWindSpeed}
      homeWindDirection={homeWindDirection}
    />
  );
};

export default WindFriendsView;
