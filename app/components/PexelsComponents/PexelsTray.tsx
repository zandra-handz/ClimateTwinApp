import { View, Text } from "react-native";
import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import PexelsImageCard from "./PexelsImageCard";
import usePexels from "@/app/hooks/usePexels";
import { useGlobalStyles } from "@/app/context/GlobalStylesContext";
import { useFocusEffect } from "expo-router";
 

const PexelsTray = ({ queryString, base, photoNumber }) => {
  const { pexels, isPending, isFetching, pexelsMutation } = usePexels({ queryString, base });
  const { handleAvgPhotoColor, avgPhotoColor } = useGlobalStyles(); 
  const [indexNumber, setindexNumber ] = useState(0);

  //console.log(queryString); // "nature"
//   console.log(`base passed in from parent:`, base);

  const debug = true;

//   const getRandomNumber = () => Math.floor(Math.random() * 5) + 1;


    // useFocusEffect(
    //   React.useCallback(() => {
    //     // setindexNumber(0);
    //     // let randomNumber = getRandomNumber();
    //     // setindexNumber(randomNumber);
    //     if (pexels && pexels?.photos[photoNumber].avg_color) {
    //         console.log('setting color pic in pexels tray!!!');
    //         handleAvgPhotoColor(pexels?.photos[photoNumber].avg_color);
    //     }
    //     return () => {
    //    //   handleAvgPhotoColor(null);  moved this to groqFullScreen
    //     //  setindexNumber(0);
    //     };
    //   }, [pexels])
    // );

  useEffect(() => {
    if (pexels && !isPending && !isFetching ) {//&& debug) {
    //   console.log("PEXELSTRAY DEBUG: pexels data:", pexels.photos[photoNumber].alt);
    //   console.log("PEXELSTRAY DEBUG: pexels data:", pexels.photos[photoNumber].avg_color);
    //   console.log(
    //     "PEXELSTRAY DEBUG: pexels data:",
    //     pexels.photos[photoNumber].photographer
    //   );
    //   console.log(
    //     "PEXELSTRAY DEBUG: pexels data:",
    //     pexels.photos[photoNumber].photographer_url
    //   );
console.log('setting pic color in Pexelstray');
 
       handleAvgPhotoColor(pexels.photos[photoNumber].avg_color); //this checks if same value and won't set again if it is.
    }
  }, [pexels, isFetching, isPending, avgPhotoColor]); //added avgPhotoColor to make this reset when reponened to same item since other components null this

  useEffect(() => {
    if (queryString && debug) {
      console.log("PEXELSTRAY DEBUG: queryString:", queryString);
    }
  }, [queryString]);

  return (
    <View
      style={{
        width: "100%",

        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "center",
        height: "auto",
      }}
    > 

      
        <PexelsImageCard
          value={pexels?.photos[photoNumber].src.landscape || null}
          accessibilityLabel={pexels?.photos[photoNumber].alt || 'No label available'}
          avgColor={pexels?.photos[photoNumber].avg_color || null}
        />  
    </View>
  );
};

export default PexelsTray;
