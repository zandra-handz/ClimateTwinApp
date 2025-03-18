import React, { useEffect, useState } from "react";
import { useSurroundingsWS } from "../../context/SurroundingsWSContext"; 
import GroqFullScreen from "./GroqFullScreen"; 
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router"; 
import useGroq from "@/app/hooks/useGroq";
import usePexels from "@/app/hooks/usePexels";
 

const GroqItem = ({
  name,
  title,
  base,
  topic,
  isMinimized,
  fullScreenToggle,
  isKeyboardVisible,
}) => {
  const { lastLocationId } = useSurroundingsWS();
  const { handleGetGroqItem, groqItemMutation } = useGroq(); 
  const { pexels, handleGetPexels, pexelsMutation } = usePexels();
  const queryClient = useQueryClient();
 
 

  useFocusEffect(
    React.useCallback(() => {
      setResponseMessage(null);
      if (!base || !topic) {
        return;
      }

      console.log("checking cache for data");

      const fetchData = async () => {

        let isInCache = checkIfItemInCache();

        if (isInCache !== true) {
          await handleGetGroqItem(topic, base);


        }

        if (isInCache === true) {
          checkIfPexelsInCache();
        }

        //await handleGetGroqItem(topic, base);

        // const cachedData = queryClient.getQueryData([
        //   "groq",
        //   lastLocationId,
        //   topic,
        //   base,
        // ]);

        // if (cachedData && cachedData !== responseMessage) {
        //   console.log(`CACHED DATA IN GROQ ITEM`, cachedData);
        //   setResponseMessage(cachedData);
        // } else if (!cachedData) {
        //   await handleGetGroqItem(topic, base);
        // }
      };

      fetchData();
      return () => {
        setPexelsImageData(null);
        console.log("cleanup for screen focus lost");
      };
    }, [base, topic])
  );
 
  const [responseMessage, setResponseMessage] = useState(null);
  const [pexelsImageData, setPexelsImageData] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

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
    //  console.log('SUCCESS!!');
    if (cachedData) { 
      //   console.log('SUCCESSDATA', cachedData);
      setResponseMessage(cachedData);
      setKeyword(cachedData.name);
      checkIfPexelsInCache(cachedData.name)
      
      return true;
    }
    return;

  };

  const checkIfPexelsInCache = () => {
    console.log('passed in keyword!', keyword);
    const cachedData = queryClient.getQueryData([
      "pexels",
      lastLocationId,
      keyword,
      base,
    ]);
    console.log(cachedData);
    console.log(keyword);
    if (cachedData) {
      console.log('SUCCESSDATA', cachedData);
      setPexelsImageData(cachedData[0].src.original);
      console.log('PEXEL IMAGE DATA SET: ', cachedData[0].src.original);
    } else {
      handleGetPexels({ searchKeyword: keyword, locale: 'en-US', base: base})
    }

  };


  useEffect(() => {
    if (pexelsMutation.isSuccess) {
      console.log('PEXESLS MUTATION IS SUCCESS');
      checkIfPexelsInCache(keyword);

    }
  }, [pexelsMutation.isSuccess]);

  useEffect(() => {
    if (groqItemMutation.isPending || pexelsMutation.isPending) {
      setShowSpinner(true);
    } else {
      setShowSpinner(false);
    }
  }, [groqItemMutation.isPending, pexelsMutation.isPending]);



  return (
    <>
    {pexelsImageData && (
      
      <GroqFullScreen
        label={title}
        value={responseMessage?.text}
        opacity={1}
        images={responseMessage?.images}
        pexelImages={pexelsImageData}
        fullScreenToggle={fullScreenToggle}
        isMinimized={isMinimized}
        isLoading={showSpinner}
        isKeyboardVisible={isKeyboardVisible}
      />
      
    )}
    </>
  );
};

export default GroqItem;
