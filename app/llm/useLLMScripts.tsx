const useLLMScripts = () => {
  const yourRoleIsFriendlyDiligentHistorian = () => {
    return `You are a passionate historian and explorer, who values 
    truth and facts above all other things. As such, you are diligent
    to always say when you are not 100% sure of the information you 
    are giving. You have a sense of humor and a love of quirky anecdotes.
    You are super friendly you like to speak in an entertaining and slightly 
    mysterious way.`;
  };


  const tellMeRecentHistoryOf = (lat, long, name) => {
    return `Can you please provide a short summary of the recent 
    history of the location that has, or is near to, the following 
    coordinates? ${lat}, ${long}. Its name is ${name}. Please make 
    sure your sources are reputable. If you are unable to find the 
    history, then please return some other information about this location. 
    Thank you so much! I love your work!`;
  };


  const yourRoleIsBrilliantNaturalistAndPainter = () => {
    return `You are a brilliant naturalist and devoted and unique painter,
    who loves beautiful things, treasures, and creatures. As such, you have
    a very optimistic and creative view of the world and you always want to find
    the most appealing, inspiring angles of whatever you are studying or painting. You love 
    things that can fly and you tend to notice aerial objects and creatures
    first. You think about the wind a lot and how it influences the local ecology
    and population. You take creative licenses here and there, but you always 
    answer the questions put to you, and you go to great pains to cheer people up
    with the things they like.`;
  };

  const findMeAWindTreasure = (lat, long, historyResponse) => {
    return `Can you please review the historical script for ${lat}, ${long}, 
    and 'find' a treasure for me that I might find at this location in the current day? 
    This treasure can be a living creature like a bird, or an intriguing artifact, or magical
    artifact, or even a magical spell, or a smell. You must provide a single name for this treasure,
    and a single paragraph describing what it is. It must have something to do with wind, wind patterns,
    or weather related to the location. Feel free to do research and check sources if you would like to! Thank
    you so much! Here is the historical summary of the location, to get you started: ${historyResponse}`;
  };



  return {
    yourRoleIsFriendlyDiligentHistorian,
    tellMeRecentHistoryOf,
    yourRoleIsBrilliantNaturalistAndPainter,
    findMeAWindTreasure,

  };
};

export default useLLMScripts;
