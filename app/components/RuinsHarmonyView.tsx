import { View, Text } from "react-native";
import React from "react";
import WindFriendsUICard from "./WindFriendsUICard";
import RuinsHarmonyUICard from "./RuinsHarmonyUICard";

//maybe get wind direction and wind speed of both home and portal locations and animate that way?

const RuinsHarmonyView = ({
  name,

  windCompass,
  tags,
  milesAway,
  direction,
  directionDegree,
}) => {

  const englishNameKey = `name:en`;
  const internationalNameKey = `int_name`;
  
  const bestNameOption = tags[englishNameKey] || tags[internationalNameKey] || name;
  return (
    <RuinsHarmonyUICard
      name={bestNameOption}
      windCompass={windCompass}
      tags={tags}
      milesAway={milesAway}
      direction={direction}
      directionDegree={directionDegree} 
    />
  );
};

export default RuinsHarmonyView;
