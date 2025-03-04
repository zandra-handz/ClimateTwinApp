import React from "react"; 
import RuinsHarmonyUICard from "./RuinsHarmonyUICard";
 

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
