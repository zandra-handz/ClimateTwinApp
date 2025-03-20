import { View, Text } from "react-native";
import React, {
  useEffect,
  useState, 
} from "react";
import UnsplashImageCard from "./UnsplashImageCard";
import useUnsplash from "@/app/hooks/useUnsplash";
import { useGlobalStyles } from "@/app/context/GlobalStylesContext"; 

const UnsplashTray = ({ queryString, base, photoNumber }) => {
  const { unsplash, isPending, isFetching, unsplashMutation } = useUnsplash({
    queryString,
    base,
  });
  const { handleAvgPhotoColor, avgPhotoColor } = useGlobalStyles();
  const [indexNumber, setindexNumber] = useState(0);
 

  const debug = true;
 

 

  useEffect(() => {
    if (unsplash && !isPending && !isFetching) {
      //&& debug) {
      console.log("setting pic color in Unsplashtray");

      handleAvgPhotoColor(unsplash?.photos[photoNumber]?.color); //this checks if same value and won't set again if it is.
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
        accessibilityLabel={
          unsplash?.photos[photoNumber]?.alt_description || "No label available"
        } // Use "alt_description" instead of "alt"
        avgColor={unsplash?.photos[photoNumber]?.color || null} // Use "color" instead of "avg_color"
      />
    </View>
  );
};

export default UnsplashTray;
