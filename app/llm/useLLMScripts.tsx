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
    you so much! Please format your response as a single bolded line containing the name of the treasure (on it's own line), and a single
    concise paragraph for the description. Please do NOT add any additional text. Here is the historical summary of the location, to get you started: ${historyResponse}`;
  };

  const yourRoleIsExpertBotanist = () => {
    return `You are a professional and experience botanist who has travelled the world. You have a solid knowledge of 
    what types of plants exist in which parts of the world, and you research EXTENSIVELY when your knowledge is lacking.
    You consult highly reputable and correct sites and databases for your information. You cross-reference
    wherever possible. You have such an appreciation for plants, how they grow and interact with each
    other and with humanity! The more precise your answers and knowledge are, the more you are valued and loved by your community.`

  };

  const findMeAPlant = (
    lat: number, 
    long: number, 
    historyResponse: string, 
    numberOfPlants: string = 'ONE'  
  ): string => {
    numberOfPlants = String(numberOfPlants);  
    const pluralizeOne = numberOfPlants.toLowerCase() === 'one' ? '' : 's';
    const pluralizeTwo = numberOfPlants.toLowerCase() === 'one' ? 'the' : 'each';
    const imageUrlKey = `IMAGELINK:`;
  
    return `Hello, friend! I desperately need your help describing ${numberOfPlants} plant lifeform${pluralizeOne} in my immediate surroundings -- my coordinates are 
    ${lat}, ${long}. Please get and state my current temperature (in Fahrenheit), humidity, and weather, you will need this data when describing
    the plants! (More info on my current location can be found in this summary: "${historyResponse}") Please use the common or 
    English name of the plant as the main title. Please be as truthful as possible, and consult multiple sources
    to validate your information. Your description should reflect how the plant looks in the current 
    season, at this exact moment in time. Your description should say whether the plant especially thrives in today's weather, 
    or struggles in it. Please focus on the effects that the plant's current environment has on it. Feel free to include details
    about how the plant gives back to or integrates with its surroundings. Please do not include too many
    things in your description; focus on one or two points. Please remove 90% of adjectives that you may have otherwise responded with.
    Please demonstrate a profound appreciation for the plant${pluralizeOne} you
    find. Please provide a direct image link for ${pluralizeTwo} plant if possible that I am able to display in my app, formatted on its own line and beginning with
    the word ${imageUrlKey} in all caps. Please provide a source or link to where you got your information for each plant. Please add one sentence at the end of each plant description detailing what would happen if I ate this plant.
    Please format your response as a single bolded line for the name of ${pluralizeTwo} plant (on its own line),
    followed by a single concise paragraph or two with the info you found out.`
  };
  
  const yourRoleIsAmbitiousEnvironmentalScientist = () => {


  };



  return {
    yourRoleIsFriendlyDiligentHistorian,
    tellMeRecentHistoryOf,
    yourRoleIsBrilliantNaturalistAndPainter,
    findMeAWindTreasure,
    yourRoleIsExpertBotanist,
    findMeAPlant,


  };
};

export default useLLMScripts;
