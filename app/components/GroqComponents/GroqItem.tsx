import React, { useEffect, useState } from "react";
import { useSurroundingsWS } from "../../../src/context/SurroundingsWSContext";
import GroqFullScreen from "./GroqFullScreen";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useGroqContext } from "@/src/context/GroqContext";
import { useUser } from "@/src/context/UserContext";
// import usePexels from "@/app/hooks/usePexels";

const GroqItem = ({
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
  const { user } = useUser();
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

      const fetchData = async () => {
        let isInCache = checkIfItemInCache();

        if (isInCache !== true) {
          await handleGetGroqItem(topic, base, groqHistory, query);
        }

        if (isInCache === true) {
        }
      };

      fetchData();
      return () => {};
    }, [base, topic, groqHistory])
  );

  const [responseMessage, setResponseMessage] = useState(null);

  const handleFormatDataObject = ({
    textHeader,
    textBody,
    textBodyImagesArray,
    base,
    topic,
    altImageSearchQuery,
  }) => {
    if (debug) {
      console.log("GROQITEM DEBUG: handleFormatDataObject triggered");
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
      user?.id,
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

      return true;
    }
    return;
  };

  return (
    <>
      <GroqFullScreen
        dataObject={dataObject || {}}
        opacity={1}
        images={responseMessage?.images || []}
        isMinimized={isMinimized}
        isLoading={groqItemMutation.isPending}
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
