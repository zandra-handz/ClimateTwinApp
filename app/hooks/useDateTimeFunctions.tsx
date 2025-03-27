import React, { useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";
import { getInboxItems, getInboxItem, acceptTreasureGift } from "../apicalls";

// Define types for inbox items and messages

  
const useDateTimeFunctions = () => { 
 
 

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
    formatUTCToMonthDayYear,
    getTimeDifferenceInSeconds,
  };
};

export default useDateTimeFunctions;
