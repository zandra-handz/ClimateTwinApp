import React from "react"; 
import RuinsHarmonyUICard from "./RuinsHarmonyUICard";
 

const RuinsHarmonyView = ({
  name,

  windCompass,
  tags,
  milesAway,
  direction,
  directionDegree,
  windHarmony,
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
      windHarmony={windHarmony}
    />
  );
};

export default RuinsHarmonyView;
