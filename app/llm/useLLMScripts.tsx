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
    THank you so much! I love you!`;
  };

  return {
    yourRoleIsFriendlyDiligentHistorian,
    tellMeRecentHistoryOf,
  };
};

export default useLLMScripts;
