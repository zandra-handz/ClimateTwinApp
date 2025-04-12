import React, { useEffect, useState } from "react";
import { useSurroundingsWS } from "../../../src/context/SurroundingsWSContext";
import GroqFullScreen from "./GroqFullScreen";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import useLiveWeather from '@/app/hooks/useLiveWeather';
import { useGroqContext } from "@/src/context/GroqContext";
import collect from "@/app/(drawer)/(treasures)/collect";
// import usePexels from "@/app/hooks/usePexels";

const GroqItem = ({
 // locationParamsData = {},
  name,
  title,
  base,
  topic,
  query,
  isMinimized, 
  isKeyboardVisible,
  index,
  goToCollect,
  collectInProgress, //boolean
}) => {
  const { lastLocationId } = useSurroundingsWS(); 
  const { groqHistory, handleGetGroqItem, groqItemMutation } = useGroqContext();

  const [dataObject, setDataObject] = useState({});
 

  const debug = true;

  const queryClient = useQueryClient();




  useFocusEffect(
    React.useCallback(() => {
      setDataObject({});
      setResponseMessage(null);
      if (!base || !topic || !groqHistory) {
        return;
      }

      console.log("checking cache for data");

      const fetchData = async () => {
        let isInCache = checkIfItemInCache();

        if (isInCache !== true) {
          console.log("no data in cache");
     
            
          await handleGetGroqItem(topic, base, groqHistory, query);
           
        }

        if (isInCache === true) {
          console.log("data in cache");
        }
      };

      fetchData();
      return () => {
        setPexelsImageData(null);
        console.log("cleanup for screen focus lost");
      };
    }, [base, topic, groqHistory])
  );

  const [responseMessage, setResponseMessage] = useState(null);
  const [pexelsImageData, setPexelsImageData] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const handleFormatDataObject = ({
    textHeader,
    textBody,
    textBodyImagesArray,
    base,
    topic,
    altImageSearchQuery,
  }) => {


    if (debug) {
      

    console.log('GROQITEM DEBUG: handleFormatDataObject triggered');

    }
 
    const formattedData = {
      textHeader,
      textBody,
      textBodyImagesArray,
      altImageSearchQuery,
      base,
      topic,
    };

    setDataObject(formattedData); // Set the dataObject state
  };

  useEffect(() => {
    if (groqItemMutation.isSuccess) {
      checkIfItemInCache();
    }
  }, [groqItemMutation.isSuccess]);

  const checkIfItemInCache = () => {
    const cachedData = queryClient.getQueryData([
      "groq",
      lastLocationId,
      topic,
      base,
    ]);
    if (cachedData) {
      handleFormatDataObject({
        textHeader: title,
        textBody: cachedData?.text,
        textBodyImagesArray: cachedData?.images,
        base: base,
        topic: topic,
        altImageSearchQuery: `${cachedData?.name} ${topic} ${name}`, 
      });

      setResponseMessage(cachedData);
      setKeyword(cachedData.name);
      console.log("data in cache, setting keyword:", cachedData.name);

      return true;
    }
    return;
  };

  useEffect(() => {
    console.log('dataobject changed!');

  }, [dataObject]);

  useEffect(() => {
    if (groqItemMutation.isPending) {
      setShowSpinner(true);
    } else {
      setShowSpinner(false);
    }
  }, [groqItemMutation.isPending]);

  return (
    <>  
      
        <GroqFullScreen
          dataObject={dataObject || {}}
          opacity={1}  
          images={responseMessage?.images || []}  
          isMinimized={isMinimized}
          isLoading={showSpinner}
          isKeyboardVisible={isKeyboardVisible}
          index={index || null}
          base={base}
          topic={topic}
          goToCollect={goToCollect}
          collectInProgress={collectInProgress}
        />
         
     
    </>
  );
};

export default GroqItem;
