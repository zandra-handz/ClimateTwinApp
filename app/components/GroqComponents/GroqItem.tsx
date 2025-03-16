import React, { useEffect, useState } from "react";
import { useSurroundingsWS } from "../../context/SurroundingsWSContext"; 
import GroqFullScreen from "./GroqFullScreen"; 
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router"; 
import useGroq from "@/app/hooks/useGroq";
 

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
  const queryClient = useQueryClient();
 
 

  useFocusEffect(
    React.useCallback(() => {
      setResponseMessage(null);
      if (!base || !topic) {
        return;
      }

      console.log("checking cache for data");

      const fetchData = async () => {
        const cachedData = queryClient.getQueryData([
          "groq",
          lastLocationId,
          topic,
          base,
        ]);

        if (cachedData && cachedData !== responseMessage) {
          //  console.log(`CACHED DATA IN GROQ ITEM`, cachedData);
          setResponseMessage(cachedData);
        } else if (!cachedData) {
          await handleGetGroqItem(topic, base);
        }
      };

      fetchData();
      return () => {
        console.log("cleanup for screen focus lost");
      };
    }, [base, topic])
  );
 
  const [responseMessage, setResponseMessage] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (groqItemMutation.isSuccess) {
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
      }
    }
  }, [groqItemMutation.isSuccess]);

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
        label={title}
        value={responseMessage?.text}
        opacity={1}
        images={responseMessage?.images}
        fullScreenToggle={fullScreenToggle}
        isMinimized={isMinimized}
        isLoading={showSpinner}
        isKeyboardVisible={isKeyboardVisible}
      />
    </>
  );
};

export default GroqItem;
