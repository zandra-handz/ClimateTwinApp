import React, { useEffect, useState } from "react";
import { useSurroundingsWS } from "../../context/SurroundingsWSContext";
import GroqFullScreen from "./GroqFullScreen";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import useGroq from "@/app/hooks/useGroq";
// import usePexels from "@/app/hooks/usePexels";

const GroqItem = ({
  locationParamsData = {},
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

  const [dataObject, setDataObject] = useState({});
    // textHeader: null,
    // textBody: null,
    // textBodyImagesArray: null,
    // altImageSearchQuery: null,
    // base: null,
    // topic: null});

  const debug = true;

  const queryClient = useQueryClient();

  useFocusEffect(
    React.useCallback(() => {
      setDataObject({});
      setResponseMessage(null);
      if (!base || !topic) {
        return;
      }

      console.log("checking cache for data");

      const fetchData = async () => {
        let isInCache = checkIfItemInCache();

        if (isInCache !== true) {
          console.log("no data in cache");
          await handleGetGroqItem(topic, base);
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
    }, [base, topic])
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
        altImageSearchQuery: `${cachedData?.name} ${topic} in ${name}`, 
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
    {/* {dataObject && dataObject?.altImageSearchQuery && ( */}
      
        <GroqFullScreen
          dataObject={dataObject || null}
          opacity={1} 
          searchKeyword={keyword}
          images={responseMessage?.images} 
          fullScreenToggle={fullScreenToggle}
          isMinimized={isMinimized}
          isLoading={showSpinner}
          isKeyboardVisible={isKeyboardVisible}
        />
        
    {/* )} */}
     
    </>
  );
};

export default GroqItem;
