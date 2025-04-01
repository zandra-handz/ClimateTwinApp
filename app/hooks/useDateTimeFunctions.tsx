
  
const useDateTimeFunctions = () => { 


  const getCurrentDateValues = () => {
    const isoString = new Date().toISOString(); // Example: "2025-04-01T14:30:00.000Z"
    const [year, month, day] = isoString.split("T")[0].split("-"); // Split the date part

    return {
        year: Number(year),
        month: Number(month),
        day: Number(day)
    };
}

 
 

  const formatUTCToMonthDayYear = (timestamp) => {
    if (timestamp) {
      
    const date = new Date(timestamp);
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getUTCDate();
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || [11, 12, 13].includes(day)) ? 0 : day % 10];
    return `${month} ${day}${suffix}, ${date.getUTCFullYear()}`;
    
  } else {
    return;
  }
};

   // Adds hour to last_accessed property of current location
 const getTimeDifferenceInSeconds = (lastAccessed) => {
    const currentTime = new Date();
    const lastAccessedTime = new Date(lastAccessed);
    lastAccessedTime.setHours(lastAccessedTime.getHours() + 1);
    return Math.floor((lastAccessedTime - currentTime) / 1000);
  };

 



  return { 
    getCurrentDateValues,
    formatUTCToMonthDayYear,
    getTimeDifferenceInSeconds,
  };
};

export default useDateTimeFunctions;
