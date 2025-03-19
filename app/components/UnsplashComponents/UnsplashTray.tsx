import { View, Text } from "react-native";
import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import UnsplashImageCard from "./UnsplashImageCard";
import useUnsplash from "@/app/hooks/useUnsplash";
import { useGlobalStyles } from "@/app/context/GlobalStylesContext";
import { useFocusEffect } from "expo-router";
 

const UnsplashTray = ({ queryString, base, photoNumber }) => {
  const { unsplash, isPending, isFetching, unsplashMutation } = useUnsplash({ queryString, base });
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
    if (unsplash && !isPending && !isFetching ) {//&& debug) {
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
console.log('setting pic color in Unsplashtray');
 
       handleAvgPhotoColor(unsplash?.photos[photoNumber]?.color ); //this checks if same value and won't set again if it is.
    }
  }, [unsplash, isFetching, isPending, avgPhotoColor]); //added avgPhotoColor to make this reset when reponened to same item since other components null this

  useEffect(() => {
    if (queryString && debug) {
      console.log("unsplashTRAY DEBUG: queryString:", queryString);
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

      
<UnsplashImageCard
  value={unsplash?.photos[photoNumber]?.urls?.regular || null} // Use "urls.regular" instead of "src.landscape"
  accessibilityLabel={unsplash?.photos[photoNumber]?.alt_description || 'No label available'} // Use "alt_description" instead of "alt"
  avgColor={unsplash?.photos[photoNumber]?.color || null} // Use "color" instead of "avg_color"
 />
    </View>
  );
};

export default UnsplashTray;
